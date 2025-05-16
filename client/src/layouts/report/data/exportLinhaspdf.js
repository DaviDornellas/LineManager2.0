// src/utils/exportControlePDF.js
import jsPDF from "jspdf";
import moment from "moment";
import api from "../../../service";

const exportControlePDF = async () => {
  try {
    const response = await api.get("/produtos");
    const produtos = response.data;

    const precoVivo = 69.21;
    const precoTim = 60.0;
    const precoClaro = 62.96;

    const dataAtual = moment().format("DD/MM/YYYY");
    const datas = produtos.map((p) => moment(p.date));
    const dataInicio = moment.min(datas).format("DD/MM/YYYY");
    const dataFim = moment.max(datas).format("DD/MM/YYYY");

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("RELATÓRIO DE CONTROLE DE LINHAS", 14, 15);
    doc.setFontSize(11);
    doc.text(`Data de Emissão: ${dataAtual}`, 14, 25);
    doc.text(`Período Analisado: ${dataInicio} a ${dataFim}`, 14, 32);

    let y = 42;

    // 1. Resumo Geral
    doc.setFontSize(13);
    doc.text("1. Resumo Geral", 14, y);
    y += 7;

    const totalLinhas = produtos.length;
    const valorTotal =
      produtos.filter((p) => p.operator === "VIVO").length * precoVivo +
      produtos.filter((p) => p.operator === "TIM").length * precoTim +
      produtos.filter((p) => p.operator === "CLARO").length * precoClaro;

    doc.setFontSize(11);
    doc.text(`Total de Linhas Cadastradas: ${totalLinhas}`, 14, y);
    y += 6;
    doc.text(`Valor Total Gasto: R$ ${valorTotal.toFixed(2).replace(".", ",")}`, 14, y);
    y += 10;

    // 2. Distribuição por Operadora
    doc.setFontSize(13);
    doc.text("2. Distribuição por Operadora", 14, y);
    y += 7;

    const operadoras = ["VIVO", "TIM", "CLARO"];
    const stats = operadoras.map((op) => {
      const count = produtos.filter((p) => p.operator === op).length;
      const valorUnit = op === "VIVO" ? precoVivo : op === "TIM" ? precoTim : precoClaro;
      const valorTotal = count * valorUnit;
      const media = valorUnit;
      const porcentagem = ((count / totalLinhas) * 100).toFixed(1);
      return { op, count, porcentagem, media, valorTotal };
    });

    const headers = ["Operadora", "Nº de Linhas", "%", "Médio (R$)", "Total (R$)"];
    doc.setFontSize(11);
    doc.text(headers.join("    "), 14, y);
    y += 6;

    stats.forEach((s) => {
      const linha = `${s.op} ${s.count} ${s.porcentagem}% 
      ${s.media.toFixed(2)} ${s.valorTotal.toFixed(2)}`;
      doc.text(linha, 14, y);
      y += 6;
    });

    doc.text(`Total ${totalLinhas} 100% - ${valorTotal.toFixed(2)}`, 14, y);
    y += 10;

    // 3. Detalhamento por Obra
    doc.setFontSize(13);
    doc.text("3. Detalhamento por Obra", 14, y);
    y += 7;

    const obras = {};
    produtos.forEach((p) => {
      if (!obras[p.artwork])
        obras[p.artwork] = { total: 0, operadoras: { VIVO: 0, TIM: 0, CLARO: 0 } };
      obras[p.artwork].total++;
      obras[p.artwork].operadoras[p.operator]++;
    });

    for (const obra in obras) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const o = obras[obra];
      const vivoVal = o.operadoras["VIVO"] * precoVivo;
      const timVal = o.operadoras["TIM"] * precoTim;
      const claroVal = o.operadoras["CLARO"] * precoClaro;
      const totalVal = vivoVal + timVal + claroVal;

      doc.setFontSize(11);
      doc.text(`Obra: ${obra}`, 14, y);
      y += 6;
      doc.text(`Nº de Linhas: ${o.total}`, 14, y);
      y += 6;
      doc.text(`Operadoras Utilizadas:`, 14, y);
      y += 6;
      if (o.operadoras["VIVO"] > 0)
        doc.text(`- Vivo: ${o.operadoras["VIVO"]} linhas (R$ ${vivoVal.toFixed(2)})`, 20, y),
          (y += 6);
      if (o.operadoras["TIM"] > 0)
        doc.text(`- TIM: ${o.operadoras["TIM"]} linhas (R$ ${timVal.toFixed(2)})`, 20, y), (y += 6);
      if (o.operadoras["CLARO"] > 0)
        doc.text(`- Claro: ${o.operadoras["CLARO"]} linhas (R$ ${claroVal.toFixed(2)})`, 20, y),
          (y += 6);

      doc.text(`Valor Total Gasto na Obra: R$ ${totalVal.toFixed(2)}`, 14, y);
      y += 10;
    }

    // 4. Análise de Custos
    const obraMaisLinhas = Object.entries(obras).reduce((a, b) =>
      a[1].total > b[1].total ? a : b
    );
    const obraMaisCara = Object.entries(obras).reduce((a, b) => {
      const aVal =
        a[1].operadoras["VIVO"] * precoVivo +
        a[1].operadoras["TIM"] * precoTim +
        a[1].operadoras["CLARO"] * precoClaro;
      const bVal =
        b[1].operadoras["VIVO"] * precoVivo +
        b[1].operadoras["TIM"] * precoTim +
        b[1].operadoras["CLARO"] * precoClaro;
      return aVal > bVal ? a : b;
    });

    const custoMedio = valorTotal / totalLinhas;

    doc.setFontSize(13);
    doc.text("4. Análise de Custos", 14, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(
      `Obra com Maior Nº de Linhas: ${obraMaisLinhas[0]} (${obraMaisLinhas[1].total} linhas)`,
      14,
      y
    );
    y += 6;
    const valMaisCara =
      obraMaisCara[1].operadoras["VIVO"] * precoVivo +
      obraMaisCara[1].operadoras["TIM"] * precoTim +
      obraMaisCara[1].operadoras["CLARO"] * precoClaro;
    doc.text(`Obra com Maior Custo: ${obraMaisCara[0]} (R$ ${valMaisCara.toFixed(2)})`, 14, y);
    y += 6;
    doc.text(`Custo Médio por Linha (Geral): R$ ${custoMedio.toFixed(2)}`, 14, y);
    y += 10;

    // 5. Observações
    doc.setFontSize(13);
    doc.text("5. Observações", 14, y);
    y += 7;
    doc.setFontSize(11);
    doc.text("Nenhuma observação crítica. Monitorar linhas inativas nas próximas semanas.", 14, y);
    y += 10;

    // Rodapé
    doc.text(`Responsável pela Emissão: Davi`, 14, y);
    y += 6;
    doc.text(`Contato: davi@empresa.com`, 14, y);

    doc.save("relatorio_controle_linhas.pdf");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
};

export default exportControlePDF;
