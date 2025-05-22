const express = require("express");
const db = require("../database/db"); // Conexão com o SQLite3
const router = express.Router();

// Get all divisions
router.get("/division", (req, res) => {
  const query = "SELECT * FROM Divisions";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao obter divisões" });
    }
    res.json(rows);
  });
});

// Create a new division
router.post("/division", (req, res) => {
  const { divisionName, costCenter, divisionNumber, responsibleCompany, startDate, status } = req.body;
  
  // Prepara a consulta para inserir uma nova divisão
  const query = `
    INSERT INTO Divisions (divisionName, costCenter, divisionNumber, responsibleCompany, startDate, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Insere a nova divisão no banco de dados
  db.run(query, [divisionName, costCenter, divisionNumber, responsibleCompany, startDate, status, new Date()], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar divisão" });
    }

    // Retorna a resposta com o ID e data de criação
    res.json({
      id: this.lastID,
      createdAt: new Date(),
      message: "Divisão adicionada com sucesso!"
    });
  });
});

module.exports = router;
