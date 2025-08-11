const express = require("express");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Função para gerar senha segura no formato P12345@TR
function gerarSenha() {
  const numeros = Math.floor(10000 + Math.random() * 90000); // 5 dígitos
  const letras = Array(2)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras A-Z
    .join('');
  return `P${numeros}@${letras}`;
}

// Função para gerar Usuário único no formato primeiro.ultimo
function gerarUsuarioUnico(nomes, callback, ignorarUsuarioExistente = null) {
  const primeiroNome = nomes[0].toLowerCase();

  function tentar(index) {
    if (index >= nomes.length - 1) {
      let contador = 1;
      const base = `${primeiroNome}.${nomes[nomes.length - 1].toLowerCase()}`;
      const tentativaComNumero = () => {
        const tentativa = `${base}${contador}`;
        const query = ignorarUsuarioExistente
          ? "SELECT 1 FROM primavera WHERE USUARIO = ? AND USUARIO != ?"
          : "SELECT 1 FROM primavera WHERE USUARIO = ?";
        const params = ignorarUsuarioExistente ? [tentativa, ignorarUsuarioExistente] : [tentativa];

        db.get(query, params, (err, row) => {
          if (err) return callback(err);
          if (row) {
            contador++;
            tentativaComNumero();
          } else {
            callback(null, tentativa);
          }
        });
      };
      return tentativaComNumero();
    }

    const segundoNome = nomes[nomes.length - 1 - index].toLowerCase();
    const tentativa = `${primeiroNome}.${segundoNome}`;
    const query = ignorarUsuarioExistente
      ? "SELECT 1 FROM primavera WHERE USUARIO = ? AND USUARIO != ?"
      : "SELECT 1 FROM primavera WHERE USUARIO = ?";
    const params = ignorarUsuarioExistente ? [tentativa, ignorarUsuarioExistente] : [tentativa];

    db.get(query, params, (err, row) => {
      if (err) return callback(err);
      if (row) {
        tentar(index + 1);
      } else {
        callback(null, tentativa);
      }
    });
  }

  tentar(1);
}

// GET all
router.get("/primavera", (req, res) => {
  db.all("SELECT * FROM primavera", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// POST new
router.post("/primavera", (req, res) => {
  const { NOME, BASE } = req.body;

  if (!NOME || !BASE) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes: NOME e BASE" });
  }

  const nomes = NOME.trim().split(/\s+/);
  const SENHA = gerarSenha();

  gerarUsuarioUnico(nomes, (err, USUARIO) => {
    if (err) return res.status(500).json({ error: "Erro ao gerar usuário único" });

    const query = `
      INSERT INTO primavera (NOME, USUARIO, SENHA, BASE)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [NOME.toUpperCase(), USUARIO, SENHA, BASE.toUpperCase()], function (err) {
      if (err) return res.status(500).json({ error: "Erro ao inserir" });

      res.json({
        id: this.lastID,
        usuario: USUARIO,
        senhaGerada: SENHA,
        message: "Registro adicionado com sucesso!"
      });
    });
  });
});

module.exports = router;
