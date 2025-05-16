// src/utils/exportLinhasExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import api from "../../../service/index";

const exportLinhasExcel = async () => {
  try {
    const response = await api.get("/produtos");
    const produtos = response.data;

    const precoVivo = 69.21;
    const precoTim = 60.0;
    const precoClaro = 62.96;

    const data = produtos.map((p) => {
      const precoUnit =
        p.operator === "VIVO" ? precoVivo : p.operator === "TIM" ? precoTim : precoClaro;

      const custoTotal = precoUnit;

      return {
        Responsável: p.responsible,
        "Obra de Origem": p.artwork,
        "Obra Vinculada": p.destiwork,
        Operadora: p.operator,
        "Número da Linha": p.phoneNumber,
        Data: moment(p.date).format("DD/MM/YYYY"),
        Status: p.category,
        "Custo da Linha (R$)": custoTotal.toFixed(2).replace(".", ","),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Linhas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(dataBlob, "controle_de_linhas.xlsx");
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
  }
};

export default exportLinhasExcel;
