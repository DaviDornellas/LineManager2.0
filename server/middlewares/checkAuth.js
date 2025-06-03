// middlewares/checkAuth.js
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const secretKey = process.env.JWT_SECRET || "secreta";

function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    db.get(
      "SELECT isLoggedIn, forcar_logout FROM Users WHERE id = ?",
      [userId],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao verificar status do usuário" });
        }

        if (!row || row.isLoggedIn === 0) {
          return res.status(401).json({ error: "Usuário não está logado" });
        }

        if (row.forcar_logout === 1) {
          // Faz logout forçado e reseta o forcar_logout
          db.run(
            "UPDATE Users SET isLoggedIn = 0, forcar_logout = 0 WHERE id = ?",
            [userId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: "Erro ao forçar logout" });
              }
              return res.status(401).json({ error: "Usuário foi deslogado forçadamente" });
            }
          );
        } else {
          req.user = decoded; // adiciona os dados decodificados no `req.user` se quiser usar depois
          next(); // continua para a próxima rota
        }
      }
    );
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = checkAuth;
