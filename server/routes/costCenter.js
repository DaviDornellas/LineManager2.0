const express = require("express");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Buscar todos os centros de custo
router.get("/costcenter", (req, res) => {
  const query = "SELECT * FROM CostCenter";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao obter centros de custo" });
    }
    res.json(rows);
  });
});

// Buscar centros de custo por divisionID
router.get("/costcenter/byDivision/:divisionNumber", (req, res) => {
  const { divisionNumber } = req.params;

  const query = "SELECT * FROM CostCenter WHERE divisionNumber = ?";
  db.all(query, [divisionNumber], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar centros de custo por divisão" });
    }
    res.json(rows);
  });
});

router.post("/costcenter", (req, res) => {
  const { costCenter, divisionNumber } = req.body;

  if (!costCenter || !divisionNumber) {
    return res.status(400).json({ error: "Campos obrigatórios: costCenter e divisionNumber" });
  }

  const query = `
    INSERT INTO CostCenter (costCenter, divisionNumber, createdAt)
    VALUES (?, ?, ?)
  `;

  db.run(query, [costCenter, divisionNumber, new Date()], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar centro de custo" });
    }

    res.json({
      id: this.lastID,
      createdAt: new Date(),
      message: "Centro de custo criado com sucesso!"
    });
  });
});
// Atualizar centro de custo por ID
router.put("/costcenter/:id", (req, res) => {
  const { id } = req.params;
  const { costCenter, divisionNumber } = req.body;

  if (!costCenter || !divisionNumber) {
    return res.status(400).json({ error: "Campos obrigatórios: costCenter e divisionNumber" });
  }

  const query = `
    UPDATE CostCenter
    SET costCenter = ?, divisionNumber = ?
    WHERE id = ?
  `;

  db.run(query, [costCenter, divisionNumber, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar centro de custo" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Centro de custo não encontrado" });
    }

    res.json({ message: "Centro de custo atualizado com sucesso!" });
  });
});


module.exports = router;
