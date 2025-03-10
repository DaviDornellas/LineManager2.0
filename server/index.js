require("dotenv").config(); // Carrega variáveis de ambiente
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/produto");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// Middleware global
app.use(cors());  // Permite requisições de outras origens (ajuste conforme necessário)
app.use(express.json()); // Faz o parse do corpo das requisições em JSON
app.use(morgan("dev"));  // Log de requisições HTTP no console

// Rotas
app.use("/api/auth", authRoutes);  // Rota pública para login e registro
app.use("/api/product", productRoutes); // Rota pública ou protegida para produtos



// Middleware de erro global (caso algo dê errado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor" });
});

// Inicializando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
