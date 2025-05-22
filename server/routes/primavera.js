const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Função para gerar a senha no formato P12345@TR
function gerarSenha() {
  const numeros = Math.floor(10000 + Math.random() * 90000); // 5 dígitos aleatórios
  const letras = Array(2)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras A-Z
    .join('');
  return `P${numeros}@${letras}`;
}

// Get all
router.get("/primavera", (req, res) => {
  db.all("SELECT * FROM primavera", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// Create new
router.post("/primavera", (req, res) => {
  const { NOME, BASE } = req.body;

  if (!NOME || !BASE) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes: NOME e BASE" });
  }

  const SENHA = gerarSenha();

  const nomes = NOME.trim().split(/\s+/);
  const primeiroNome = nomes[0].toLowerCase();
  const ultimoNome = nomes[nomes.length - 1].toLowerCase();
  const USUARIO = `${primeiroNome}.${ultimoNome}`;

  const query = `
    INSERT INTO primavera (NOME, USUARIO, SENHA, BASE)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [NOME.toUpperCase(), USUARIO, SENHA, BASE.toUpperCase()], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao inserir" });

    res.json({
      id: this.lastID,
      usuario: USUARIO,
      senhaGerada: SENHA,
      message: "Registro adicionado com sucesso!"
    });
  });
});

module.exports = router;
