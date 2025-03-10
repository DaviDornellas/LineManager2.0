const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/authcrud.sqlite",
});

module.exports = sequelize;
