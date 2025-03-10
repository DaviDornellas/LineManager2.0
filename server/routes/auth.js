const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'secreta'; // Substitua pela sua chave secreta


router.post("/register", async (req, res) => {
  try {
    const { username, position, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "E-mail já existente" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      position,
      email,
      password: hashedPassword,
      role

    });

    res.status(201).json({ message: "Usuário cadastrado com exito!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado no sistema" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
     // Gerar um token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, "secreta", { expiresIn: "1h",});

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

router.get("/me", async (req, res) => {
  try {
    // Recupera o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token não fornecido ou inválido" });
    }

    // Extrai o token
    const token = authHeader.split(' ')[1];

    try {
      // Verifica e decodifica o token
      const decoded = jwt.verify(token, secretKey);

      // Busca o usuário no banco de dados usando o ID do token
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Retorna os dados do usuário (excluindo informações sensíveis, como a senha)
      res.json({
        username: user.username,
        position: user.position,
        email: user.email,
        
        
      });
    } catch (err) {
      // Erro na verificação do token
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  } catch (error) {
    // Erro genérico no servidor
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
});

router.get("/users", async (req, res) => {
  try {
    // Recupera o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token não fornecido ou inválido" });
    }

    // Extrai o token
    const token = authHeader.split(' ')[1];

    try {
      // Verifica e decodifica o token
      const decoded = jwt.verify(token, secretKey);

      // Busca o usuário autenticado para verificar permissões
      const authenticatedUser = await User.findByPk(decoded.id);

      if (!authenticatedUser) {
        return res.status(404).json({ error: "Usuário autenticado não encontrado" });
      }

      // Opcional: verificar se o usuário tem permissão para acessar essa rota
      // Exemplo: if (!authenticatedUser.isAdmin) { ... }

      // Busca todos os usuários no banco de dados
      const users = await User.findAll({
        attributes: ["id", "username", "email","role"], // Seleciona apenas os campos desejados
      });

      res.json(users); // Retorna a lista de usuários
    } catch (err) {
      // Erro na verificação do token
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  } catch (error) {
    // Erro genérico no servidor
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o usuário que está sendo excluído
    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verifica se o usuário a ser excluído é um administrador
    if (userToDelete.role === "admin") {
      return res.status(403).json({ error: "Não é permitido excluir um administrador" });
    }

    // Exclui o usuário
    await userToDelete.destroy();

    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});






// Exportar as rotas e o middleware 
module.exports = router;
