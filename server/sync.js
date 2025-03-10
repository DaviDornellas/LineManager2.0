const sequelize = require("./database/bd");
const Produtos = require("./model/produtos");
const User = require("./model/User");

sequelize.sync({ force: true }).then(() => {
    console.log("Banco de dados sincronizado.");
  }).catch((error) => {
    console.error("Erro ao sincronizar banco de dados:", error);
  });
