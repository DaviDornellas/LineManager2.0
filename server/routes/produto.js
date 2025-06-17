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
// Atualizar produto
router.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { responsible, artwork, destiwork, operator, phoneNumber, date, category } = req.body;

  const query = `
    UPDATE Products 
    SET responsible = ?, artwork = ?, destiwork = ?, operator = ?, phoneNumber = ?, date = ?, category = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [responsible, artwork, destiwork, operator, phoneNumber, date, category, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao atualizar produto" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json({ message: "Produto atualizado com sucesso!" });
    }
  );
});


// Transferir produto para nova obra
router.post("/produtos/transferir", checkAuth, (req, res) => {
  const { productId, toWork } = req.body;

  if (!productId || !toWork) {
    return res.status(400).json({ error: "productId e toWork são obrigatórios." });
  }

  // 1. Pega a obra atual
  const selectQuery = `SELECT destiwork FROM Products WHERE id = ?`;

  db.get(selectQuery, [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produto." });
    }

    if (!row) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    const fromWork = row.destiwork;

    // 2. Atualiza a obra do produto
    const updateQuery = `UPDATE Products SET destiwork = ? WHERE id = ?`;

    db.run(updateQuery, [toWork, productId], function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao atualizar obra." });
      }

      // 3. Insere no histórico
      const insertHistory = `
        INSERT INTO TransferHistory (productId, fromWork, toWork, transferDate)
        VALUES (?, ?, ?, datetime('now'))
      `;

      db.run(insertHistory, [productId, fromWork, toWork], function (err) {
        if (err) {
          return res.status(500).json({ error: "Erro ao registrar histórico." });
        }

        res.json({ message: "Transferência realizada com sucesso!" });
      });
    });
  });
});

// Buscar histórico de transferências por linha
router.get("/produtos/historico/linha/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT h.id, h.productId, h.fromWork, h.toWork, h.transferDate
    FROM TransferHistory h
    WHERE h.productId = ?
    ORDER BY h.transferDate ASC
  `;

  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao obter histórico da linha" });
    }

    res.json(rows);
  });
});


module.exports = router;
