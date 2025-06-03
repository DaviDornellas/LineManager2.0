//index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/produto");
const authMiddleware = require("./middlewares/authMiddleware");
const divisionRoutes = require("./routes/division");
const compor90Routes = require("./routes/compor90");
const credencialRoutes = require("./routes/credencial");
const primaveraRoutes = require("./routes/primavera");
const app = express();

app.use(cors({
  origin: "*", // ou coloque o IP do front específico, se quiser restringir
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(morgan("dev"));

// 🔓 Rotas públicas (Login e Cadastro)
app.use("/api/auth", authRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/product", productRoutes);
app.use("/api/compor90", compor90Routes);
app.use("/api/credencial", credencialRoutes);
app.use("/api/primavera", primaveraRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
