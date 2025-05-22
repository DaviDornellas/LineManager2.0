const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "secreta";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Você poderá acessar req.user.role etc. nas rotas
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }
    next();
  };
};
