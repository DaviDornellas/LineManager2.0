const express = require("express");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Get all
router.get("/credencial", (req, res) => {
  db.all("SELECT * FROM credencial", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// Create new
router.post("/credencial", (req, res) => {
  const { Nome, Office, Chamado } = req.body;

  const nomes = Nome.trim().split(/\s+/);
  const primeiroNome = nomes[0].toLowerCase();
  const ultimoNome = nomes[nomes.length - 1].toLowerCase();
  const USUARIO = `${primeiroNome}.${ultimoNome}`;

  const url_chamado = `http://sgc.aterpa.com.br/glpi/front/ticket.form.php?id=${Chamado}`;
  const VPN = 1;


  const query = `
    INSERT INTO credencial (Nome, Office, Usu_Rede, Chamado, VPN, url_chamado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [Nome, Office, USUARIO, Chamado, VPN, url_chamado], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao inserir credencial" });
    res.json({
      id: this.lastID,
      Usu_Rede: USUARIO,
      message: "Credencial criada com sucesso!"
    });
  });
});

// Atualizar campo VPN
router.put("/credencial/:code", (req, res) => {
  const code = parseInt(req.params.code, 10);
  const { VPN } = req.body;

  const query = `UPDATE credencial SET VPN = ? WHERE Code = ?`;

  db.run(query, [VPN, code], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao atualizar credencial" });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Credencial não encontrada" });
    }

    res.json({ message: "Credencial atualizada com sucesso!" });
    console.log("Atualizando VPN para o Code:", code, "Novo valor:", VPN);
  });
});


module.exports = router;
