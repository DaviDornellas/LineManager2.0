// src/utils/exportResumoWord.js
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import moment from "moment";
import api from "../../../service";

const exportResumoWord = async () => {
  try {
    const response = await api.get("/produtos");
    const produtos = response.data;

    const precoVivo = 69.21;
    const precoTim = 60.0;
    const precoClaro = 62.96;

    const parágrafos = [
      new Paragraph({
        children: [new TextRun({ text: "Resumo de Linhas Cadastradas", bold: true, size: 28 })],
        spacing: { after: 400 },
      }),
    ];

    produtos.forEach((p, index) => {
      const precoUnit =
        p.operator === "VIVO" ? precoVivo : p.operator === "TIM" ? precoTim : precoClaro;
      const custoTotal = precoUnit.toFixed(2).replace(".", ",");

      parágrafos.push(
        new Paragraph({
          children: [new TextRun({ text: `#${index + 1}`, bold: true })],
        }),
        new Paragraph(`Responsável: ${p.responsible}`),
        new Paragraph(`Obra de Origem: ${p.artwork}`),
        new Paragraph(`Obra Vinculada: ${p.destiwork}`),
        new Paragraph(`Operadora: ${p.operator}`),
        new Paragraph(`Número da Linha: ${p.phoneNumber}`),
        new Paragraph(`Data: ${moment(p.date).format("DD/MM/YYYY")}`),
        new Paragraph(`Status: ${p.category}`),
        new Paragraph(`Custo da Linha: R$ ${custoTotal}`),
        new Paragraph("") // espaço entre registros
      );
    });

    const doc = new Document({ sections: [{ children: parágrafos }] });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resumo_linhas.docx");
  } catch (error) {
    console.error("Erro ao gerar Word:", error);
  }
};

export default exportResumoWord;
