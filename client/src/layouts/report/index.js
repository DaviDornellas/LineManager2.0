import React, { useState, useEffect } from "react";
import moment from "moment";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import DefaultInfoCardButton from "examples/Cards/InfoCards/DefaultInfoCardButton";
import ExportLinhasExcel from "./data/exportLinhasExcel";
import ExportLinhasPDF from "./data/exportLinhaspdf";
import exportLinhasWord from "./data/exportLinhasWord";
import MDButton from "components/MDButton";
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import api from "../../service/index";

function Billing() {
  const [totalLinhas, setTotalLinhas] = useState(0);
  const [habilitadas, setHabilitadas] = useState(0);
  const [desabilitadas, setDesabilitadas] = useState(0);
  const [vivo, setVivo] = useState(0);
  const [tim, setTim] = useState(0);
  const [claro, setClaro] = useState(0);
  const [linhasPorMes, setLinhasPorMes] = useState({ labels: [], datasets: [] });
  const [valoresTotais, setValoresTotais] = useState({
    vivo: 0,
    tim: 0,
    claro: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/produtos");
        const produtos = response.data;

        const newTotal = produtos.length;
        const newHabilitadas = produtos.filter((p) => p.category === "Habilitada").length;
        const newDesabilitadas = newTotal - newHabilitadas;

        const newVivo = produtos.filter((p) => p.operator === "VIVO").length;
        const newTim = produtos.filter((p) => p.operator === "TIM").length;
        const newClaro = produtos.filter((p) => p.operator === "CLARO").length;

        const precoVivo = 69.21;
        const precoTim = 60.0;
        const precoClaro = 62.96;

        const totalVivoValor = newVivo * precoVivo;
        const totalTimValor = newTim * precoTim;
        const totalClaroValor = newClaro * precoClaro;
        const totalGeral = totalVivoValor + totalTimValor + totalClaroValor;

        setTotalLinhas(newTotal.toString());
        setHabilitadas(newHabilitadas);
        setDesabilitadas(newDesabilitadas);
        setVivo(newVivo.toString());
        setTim(newTim.toString());
        setClaro(newClaro.toString());
        setValoresTotais({
          vivo: totalVivoValor,
          tim: totalTimValor,
          claro: totalClaroValor,
          total: totalGeral,
        });

        // Agrupamento por mês/ano
        const contagemPorMes = {};
        produtos.forEach((produto) => {
          const data = moment(produto.date);
          const mesAno = data.format("MMM/YYYY");
          contagemPorMes[mesAno] = (contagemPorMes[mesAno] || 0) + 1;
        });

        const labels = Object.keys(contagemPorMes).sort((a, b) =>
          moment(a, "MMM/YYYY").diff(moment(b, "MMM/YYYY"))
        );
        const data = labels.map((label) => contagemPorMes[label]);

        setLinhasPorMes({
          labels,
          datasets: {
            label: "Linhas cadastradas",
            data,
          },
        });
      } catch (error) {
        console.error("Erro ao buscar os dados dos produtos", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar absolute isMini /> */}
      <DashboardNavbar />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} xl={4}>
                  <DefaultInfoCardButton
                    icon="payments"
                    title="PDF"
                    color="error"
                    description="Gerar Arquivo PDF"
                    action={
                      <MDButton onClick={ExportLinhasPDF} color="error">
                        Baixar PDF
                      </MDButton>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                  <DefaultInfoCardButton
                    icon="payments"
                    title="EXCEL"
                    color="success"
                    description="Gerar Planilha Excel"
                    action={
                      <MDButton onClick={ExportLinhasExcel} color="success">
                        Baixar EXCEL
                      </MDButton>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                  <DefaultInfoCardButton
                    icon="payments"
                    title="WORD"
                    description="Gerar Documento Word"
                    action={
                      <MDButton onClick={exportLinhasWord} color="info">
                        Baixar WORD
                      </MDButton>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Billing;
