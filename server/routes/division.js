const express = require("express");
const db = require("../database/db"); // Conexão com o SQLite3
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

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
  const { divisionName, divisionNumber, status } = req.body;
  
  // Prepara a consulta para inserir uma nova divisão
  const query = `
    INSERT INTO Divisions (divisionName, divisionNumber, status, createdAt)
    VALUES (?, ?, ?, ?)
  `;

  // Insere a nova divisão no banco de dados
  db.run(query, [divisionName, divisionNumber, status, new Date()], function (err) {
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

// Update an existing division
router.put("/division/:id", (req, res) => {
  const { id } = req.params;
  const { divisionName, divisionNumber, status } = req.body;

  const query = `
    UPDATE Divisions
    SET divisionName = ?, divisionNumber = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [divisionName, divisionNumber, status, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar divisão" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Divisão não encontrada" });
    }

    res.json({
      message: "Divisão atualizada com sucesso!",
      updatedAt: new Date()
    });
  });
});

module.exports = router;
