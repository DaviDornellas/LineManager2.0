const express = require("express");
const db = require("../database/db");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Função para gerar Usu_Rede de forma única
function gerarUsuarioUnico(nomes, callback, ignorarUsuarioExistente = null) {
  const primeiroNome = nomes[0].toLowerCase();

  function tentar(index) {
    if (index >= nomes.length - 1) {
      // Se acabou os nomes intermediários, adiciona número incremental
      let contador = 1;
      const base = `${primeiroNome}.${nomes[nomes.length - 1].toLowerCase()}`;
      const tentativaComNumero = () => {
        const tentativa = `${base}${contador}`;
        const query = ignorarUsuarioExistente
          ? "SELECT 1 FROM credencial WHERE Usu_Rede = ? AND Usu_Rede != ?"
          : "SELECT 1 FROM credencial WHERE Usu_Rede = ?";
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
      ? "SELECT 1 FROM credencial WHERE Usu_Rede = ? AND Usu_Rede != ?"
      : "SELECT 1 FROM credencial WHERE Usu_Rede = ?";
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

// Get all
router.get("/credencial", (req, res) => {
  db.all("SELECT * FROM credencial", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao obter dados" });
    res.json(rows);
  });
});

// Create new
router.post("/credencial", (req, res) => {
  const { Nome, Office, Chamado } = req.body;
  const nomes = Nome.trim().split(/\s+/);
  const url_chamado = `http://sgc.aterpa.com.br/glpi/front/ticket.form.php?id=${Chamado}`;

  gerarUsuarioUnico(nomes, (err, USUARIO) => {
    if (err) return res.status(500).json({ error: "Erro ao gerar Usuário único" });

    const query = `
      INSERT INTO credencial (Nome, Office, Usu_Rede, Chamado, url_chamado)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [Nome, Office, USUARIO, Chamado, url_chamado], function (err) {
      if (err) return res.status(500).json({ error: "Erro ao inserir credencial" });
      res.json({
        id: this.lastID,
        Usu_Rede: USUARIO,
        message: "Credencial criada com sucesso!"
      });
    });
  });
});

// Update credencial
router.put("/credencial/:Code", (req, res) => {
  const { Code } = req.params;
  const { Nome, Office, Chamado } = req.body;

  if (!Nome || !Office || !Chamado) {
    return res.status(400).json({ error: "Campos obrigatórios não fornecidos." });
  }

  const nomes = Nome.trim().split(/\s+/);
  const url_chamado = `http://sgc.aterpa.com.br/glpi/front/ticket.form.php?id=${Chamado}`;

  // Pegar Usu_Rede atual para ignorar ele mesmo na verificação de duplicidade
  db.get("SELECT Usu_Rede FROM credencial WHERE Code = ?", [Code], (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar credencial existente" });
    if (!row) return res.status(404).json({ error: "Credencial não encontrada" });

    const usuarioAtual = row.Usu_Rede;

    gerarUsuarioUnico(nomes, (err, USUARIO) => {
      if (err) return res.status(500).json({ error: "Erro ao gerar Usuário único" });

      const query = `
        UPDATE credencial 
        SET Nome = ?, Office = ?, Usu_Rede = ?, Chamado = ?, url_chamado = ?
        WHERE Code = ?
      `;

      db.run(query, [Nome, Office, USUARIO, Chamado, url_chamado, Code], function (err) {
        if (err) return res.status(500).json({ error: "Erro ao atualizar credencial" });

        if (this.changes === 0) {
          return res.status(404).json({ error: "Credencial não encontrada" });
        }

        res.json({
          message: "Credencial atualizada com sucesso!",
          id: Code,
          Usu_Rede: USUARIO
        });
      });
    }, usuarioAtual);
  });
});

module.exports = router;
