const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const secretKey = process.env.JWT_SECRET || "secreta";

// Registrar um novo usuário
router.post("/register", (req, res) => {
  const { username, position, location, email, password, role } = req.body;

  db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
    if (row) {
      return res.status(400).json({ error: "E-mail já existente" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: "Erro ao criptografar senha" });

      const query = `INSERT INTO Users (username, position, location, email, password, role, isLoggedIn) 
                     VALUES (?, ?, ?, ?, ?, ?, 0)`;

      db.run(query, [username, position, location, email, hashedPassword, role], (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao registrar usuário" });
        }
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
      });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
    if (!row) return res.status(404).json({ error: "Usuário não encontrado" });

    bcrypt.compare(password, row.password, (err, isValid) => {
      if (!isValid) return res.status(401).json({ error: "Senha incorreta" });

      const token = jwt.sign({ id: row.id, role: row.role }, secretKey, { expiresIn: "15m" });
      const now = new Date().toISOString();

      db.run("UPDATE Users SET last_login = ?, isLoggedIn = 1, current_token = ? WHERE id = ?",
        [now, token, row.id], (err) => {
          if (err) console.error("Erro ao atualizar login:", err);
        });

      res.json({ token, role: row.role });
    });
  });
});

// Logout
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    db.run("UPDATE Users SET isLoggedIn = 0 WHERE id = ?", [decoded.id], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao fazer logout" });
      res.json({ message: "Logout realizado com sucesso" });
    });
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

// Dados do usuário logado
router.get("/me", checkAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);

    db.get(
      "SELECT id, username, position, location, email, role, forcar_logout FROM Users WHERE id = ?",
      [decoded.id],
      (err, user) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        if (user.forcar_logout === 1) {
          // Marca o usuário como desconectado no banco
          db.run("UPDATE Users SET isLoggedIn = 0 WHERE id = ?", [user.id]);

          return res.status(403).json({ error: "Sessão encerrada por um administrador." });
        }

        // Opcional: remover campo `forcar_logout` da resposta
        const { id, username, position, location, email, role } = user;
        res.json({ id, username, position, location, email, role });
      }
    );
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});


// Verifica se o usuário está logado
router.get("/isLoggedIn", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ isLoggedIn: false });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, secretKey);
    return res.json({ isLoggedIn: true });
  } catch (err) {
    return res.json({ isLoggedIn: false });
  }
});

// Listar usuários
router.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, secretKey);
    db.all("SELECT id, username, position, location, email, role, last_login, isLoggedIn FROM Users", [], (err, users) => {
      if (err) {
        console.error("Erro ao buscar usuários:", err);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
      }
      res.json(users);
    });
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

// Excluir usuário
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM Users WHERE id = ?", [id], (err, user) => {
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    if (user.role === "admin") return res.status(403).json({ error: "Não é permitido excluir um administrador" });

    db.run("DELETE FROM Users WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao excluir usuário" });
      res.status(200).json({ message: "Usuário excluído com sucesso" });
    });
  });
});

// Logout forçado por um admin
router.post("/logout/:id", checkAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Apenas administradores podem deslogar outros usuários" });
  }

  const userId = req.params.id;

  db.run("UPDATE Users SET isLoggedIn = 0 WHERE id = ?", [userId], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao deslogar usuário" });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: `Usuário ${userId} foi deslogado com sucesso` });
  });
});

// Atualizar dados do usuário (com opção de atualizar senha)
router.put("/users/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const { username, position, location, email, role, password } = req.body;

  // Verificar se o usuário existe
  db.get("SELECT * FROM Users WHERE id = ?", [id], (err, user) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Função para executar a atualização (com ou sem nova senha)
    const updateUser = (hashedPassword = null) => {
      const query = `
        UPDATE Users
        SET username = ?, position = ?, location = ?, email = ?, role = ?
        ${hashedPassword ? ", password = ?" : ""}
        WHERE id = ?
      `;

      const params = hashedPassword
        ? [username, position, location, email, role, hashedPassword, id]
        : [username, position, location, email, role, id];

      db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: "Erro ao atualizar usuário" });

        res.json({ message: "Usuário atualizado com sucesso" });
      });
    };

    // Se uma nova senha foi enviada, criptografa antes de salvar
    if (password && password.trim() !== "") {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Erro ao criptografar nova senha" });
        updateUser(hashedPassword);
      });
    } else {
      updateUser();
    }
  });
});


module.exports = router;
