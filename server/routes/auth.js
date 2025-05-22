// auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");  // Importando o DB SQLite
const router = express.Router();
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

      const query = `INSERT INTO Users (username, position, location, email, password, role) 
                     VALUES (?, ?, ?, ?, ?, ?)`;

      db.run(query, [username, position, location, email, hashedPassword, role], (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao registrar usuário" });
        }
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
      });
    });
  });
});

// Login do usuário
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
    if (!row) return res.status(404).json({ error: "Usuário não encontrado" });

    bcrypt.compare(password, row.password, (err, isValid) => {
      if (!isValid) return res.status(401).json({ error: "Senha incorreta" });

      const token = jwt.sign({ id: row.id, role: row.role }, secretKey, { expiresIn: "20m" });
      res.json({ token, role: row.role });
    });
  });
});

// Buscar dados do usuário autenticado
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    db.get("SELECT username, position, location, email FROM Users WHERE id = ?", [decoded.id], (err, user) => {
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    });
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

// Listar todos os usuários
router.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    db.all("SELECT id, username, position, location, email, role FROM Users", [], (err, users) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar usuários" });
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

const createDefaultUser = () => {
  const username = "Admin";
  const position = "Administrador";
  const location = "Matriz";
  const email = "admin@exemplo.com";
  const password = "admin123"; // Pode ser alterado depois
  const role = "admin";

  db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
    if (err) {
      console.error("Erro ao verificar usuário padrão:", err);
      return;
    }

    if (row) {
      console.log("Usuário admin já existe.");
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Erro ao criptografar a senha:", err);
          return;
        }

        const query = `INSERT INTO Users (username, position, location, email, password, role)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(query, [username, position, location, email, hashedPassword, role], (err) => {
          if (err) {
            console.error("Erro ao criar o usuário admin:", err);
          } else {
            console.log("Usuário admin criado com sucesso.");
          }
        });
      });
    }
  });
};

// Executar a função ao carregar o módulo
createDefaultUser();


module.exports = router;
