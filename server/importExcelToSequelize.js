const XLSX = require("xlsx");
const moment = require("moment");
const path = require("path");
const Product = require("./model/produtos"); // Ajuste se o caminho for diferente
const sequelize = require("./database/bd");

const importExcel = async () => {
  try {
    const filePath = path.resolve(__dirname, "Downloads", "linhas_geradas.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    await sequelize.sync(); // garante que as tabelas estejam criadas

    const products = rows.map((row) => ({
      responsible: row["Responsável"] || "",
      artwork: row["Obra de Origem"] || "",
      destiwork: row["Obra Vinculada"] || "",
      operator: row["Operadora"] || "",
      phoneNumber: row["Número da Linha"] || "",
      date: moment(row["Data"], "DD/MM/YYYY").format("YYYY-MM-DD"),
      category: row["Status"] || "",
    }));

    await Product.bulkCreate(products); // Inserção em massa

    console.log("✅ Linhas importadas com sucesso para o banco via Sequelize!");
  } catch (error) {
    console.error("❌ Erro ao importar dados:", error);
  } finally {
    await sequelize.close();
  }
};

importExcel();
