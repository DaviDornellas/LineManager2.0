const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

// 1. Lê o Excel
const workbook = XLSX.readFile('Downloads/divisions2.xlsx');
const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

// 2. Conecta ao SQLite
const db = new sqlite3.Database('database/banco2.db');

// 3. Cria a tabela (se não existir ainda)
db.run(`
  CREATE TABLE IF NOT EXISTS Divisions (
    divisionNumber TEXT,
    divisionName TEXT,
    status TEXT
  )
`, (err) => {
  if (err) return console.error("Erro ao criar tabela:", err.message);

  // 4. Insere os dados
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO Divisions (divisionNumber, divisionName, status)
    VALUES (?, ?, ?)
  `);

  worksheet.forEach(row => {
    stmt.run(row.divisionNumber, row.divisionName, row.status);
  });

  stmt.finalize(err => {
    if (err) return console.error("Erro ao finalizar inserção:", err.message);
    console.log("✅ Dados importados com sucesso para a tabela Divisions!");
  });

  // 5. Fecha o banco
  db.close();
});
