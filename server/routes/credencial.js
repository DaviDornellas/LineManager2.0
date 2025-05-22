const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Get all
router.get("/credencial", (req, res) => {
  db.all("SELECT * FROM credencial", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// Create new
router.post("/credencial", (req, res) => {
  const { Nome, Office, Chamado, VPN } = req.body;

  const nomes = Nome.trim().split(/\s+/);
  const primeiroNome = nomes[0].toLowerCase();
  const ultimoNome = nomes[nomes.length - 1].toLowerCase();
  const USUARIO = `${primeiroNome}.${ultimoNome}`;

  const query = `
    INSERT INTO credencial (Nome, Office, Usu_Rede, Chamado, VPN)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [Nome, Office, USUARIO, Chamado, VPN], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao inserir credencial" });
    res.json({
      id: this.lastID,
      Usu_Rede: USUARIO,
      message: "Credencial criada com sucesso!"
    });
  });
});

module.exports = router;
