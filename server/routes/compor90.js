const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Get all
router.get("/compor90", (req, res) => {
  db.all("SELECT * FROM compor90", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// Create new
router.post("/compor90", (req, res) => {
  const { NOME, BASE } = req.body;

  if (!NOME || !BASE) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes: NOME e BASE" });
  }

  // Gera uma senha aleatória iniciando com "90" + três dígitos aleatórios (ex: 90527)
  const SENHA = "90" + Math.floor(100 + Math.random() * 900).toString();

  const query = `
    INSERT INTO compor90 (NOME, SENHA, BASE)
    VALUES (?, ?, ?)
  `;

  db.run(query, [NOME.toUpperCase(), SENHA, BASE.toUpperCase()], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao inserir" });
    res.json({
      id: this.lastID,
      message: "Registro adicionado com sucesso!",
      senhaGerada: SENHA, // Opcional: retornar a senha para o frontend
    });
  });
});



module.exports = router;
