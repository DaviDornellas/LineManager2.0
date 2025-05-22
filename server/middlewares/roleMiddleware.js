function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const secretKey = process.env.JWT_SECRET || "secreta";

    try {
      const decoded = jwt.verify(token, secretKey);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      // Salva os dados do usuário decodificado no req para uso posterior
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}

module.exports = roleMiddleware;
