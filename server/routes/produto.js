// produto.js
const express = require("express");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Get all divisions
router.get("/produtos", (req, res) => {
  const query = "SELECT * FROM Products";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao obter Products" });
    }
    res.json(rows);
  });
});

// Criar produto
router.post("/produtos", (req, res) => {
  const { responsible, artwork, destiwork, operator, phoneNumber, date, category } = req.body;
  const query = `INSERT INTO Products (responsible, artwork, destiwork, operator, phoneNumber, date, category) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [responsible, artwork, destiwork, operator, phoneNumber, date, category], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar produto" });
    }
    res.json({ id: this.lastID, message: "Produto adicionado com sucesso!" });
  });
});

// Excluir produto
router.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Products WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir produto" });
    }
    res.json({ message: "Produto excluído com sucesso!" });
  });
});

module.exports = router;
