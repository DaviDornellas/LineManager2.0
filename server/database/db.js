// db.js
const sqlite3 = require("sqlite3").verbose();  // Importando sqlite3
const path = require("path");

// Caminho para o arquivo de banco de dados
const dbPath = path.resolve(__dirname, "./banco2.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

module.exports = db;
