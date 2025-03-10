const express = require("express");
const Produto = require("../model/produtos");
const router = express.Router();

router.get("/produtos", async (req, res) => {
  const produtos = await Produto.findAll();
  res.json(produtos);
});

router.post("/produtos", async (req, res) => {
  const { responsible, artwork, destiwork, operator, phoneNumber, date, category } = req.body;

  // Pega a data atual
  const currentDate = new Date();

  // Cria o novo produto com a data e o ID sendo gerado automaticamente
  const newProduct = await Produto.create({
    responsible,
    artwork,
    destiwork,
    operator,
    phoneNumber,
    date,
    category,
    createdAt: currentDate,  // Armazena a data de criação
  });

  res.json({ 
    id: newProduct.id,   // Retorna o id do produto
    createdAt: newProduct.createdAt,  // Retorna a data de criação
    message: "Produto adicionado com sucesso!"
  });
});

router.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { responsible, artwork, destiwork, operator, phoneNumber, date, category } = req.body;
  await Produto.update(
    {responsible, artwork, destiwork, operator, phoneNumber, date, category },
    { where: { id } }
  );
  res.json({ message: "Produto atualizado com sucesso" });
});

router.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  await Produto.destroy({ where: { id } });
  res.json({ message: "Produto deletado com sucesso" });
});

module.exports = router;
