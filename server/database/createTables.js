// createTables.js
const db = require("./db");

const createTables = () => {
  // Criação da tabela de Users
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      position TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      isLoggedIn BOOLEAN DEFAULT 0,
      forcar_logout  BOOLEAN DEFAULT 0,
      last_login TEXT,
      current_token TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Criação da tabela de Divisions
  const createDivisionsTable = `
    CREATE TABLE IF NOT EXISTS Divisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      divisionName TEXT NOT NULL,
      divisionNumber TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const createCostCenterTable = `
    CREATE TABLE IF NOT EXISTS CostCenter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costCenter TEXT NOT NULL,
      divisionNumber TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (divisionNumber) REFERENCES Divisions(divisionNumber)
    );
  `;


  // Criação da tabela de Produtos
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      responsible TEXT NOT NULL,
      artwork TEXT NOT NULL,
      operator TEXT NOT NULL,
      destiwork TEXT NOT NULL,
      phoneNumber TEXT NOT NULL UNIQUE,
      date DATE NOT NULL,
      category TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

   const createTransferHistoryTable = `
    CREATE TABLE IF NOT EXISTS TransferHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      fromWork TEXT NOT NULL,
      toWork TEXT NOT NULL,
      transferDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES Products(id)
    );
   `;

  // Tabela compor90
  const createCompor90Table = `
    CREATE TABLE IF NOT EXISTS compor90 (
      CODE INTEGER PRIMARY KEY,
      NOME TEXT,
      SENHA TEXT,
      BASE TEXT
    );
  `;

  // Tabela credencial
  const createCredencialTable = `
    CREATE TABLE IF NOT EXISTS credencial (
      Code INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT,
      Office TEXT,
      Usu_Rede TEXT,
      Chamado TEXT,
      url_chamado TEXT
    );
  `;

  // Tabela primavera
  const createPrimaveraTable = `
    CREATE TABLE IF NOT EXISTS primavera (
      CODE INTEGER PRIMARY KEY,
      NOME TEXT,
      USUARIO TEXT,
      BASE TEXT,
      SENHA TEXT
    );
  `;

  // Executando os comandos SQL
  db.serialize(() => {
    db.run(createUsersTable);
    db.run(createDivisionsTable);
    db.run(createCostCenterTable);
    db.run(createProductsTable);
    db.run(createCompor90Table);
    db.run(createCredencialTable);
    db.run(createTransferHistoryTable);
    db.run(createPrimaveraTable, (err) => {
      if (err) {
        console.error("Erro ao criar tabelas:", err.message);
      } else {
        console.log("Tabelas criadas com sucesso!");
      }
    });
  });
};

createTables(); // Chama a função para criar as tabelas
