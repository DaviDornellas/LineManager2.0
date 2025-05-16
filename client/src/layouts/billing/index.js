import React, { useState, useEffect } from "react";
import moment from "moment";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import api from "../../service/index";

function Billing() {
  const { sales } = reportsLineChartData;
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
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="obras por Mês"
                  description="Desempenho da última campanha"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Valores por Mês"
                  description={
                    <>
                      (<strong>+15%</strong>) aumento nas linhas hoje.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="info"
                  title="Linhas cadastradas"
                  description="Total de linhas por mês"
                  date="Atualizado agora"
                  chart={linhasPorMes}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="call"
                    title="Números"
                    color="infog"
                    description="Número total de linhas"
                    value={totalLinhas}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="call"
                    title="VIVO"
                    description="Linhas da VIVO"
                    value={vivo}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="call"
                    title="TIM"
                    description="Linhas da TIM"
                    value={tim}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="call"
                    title="CLARO"
                    color="error"
                    description="Linhas da CLARO"
                    value={claro}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="payments"
                    title="Números"
                    color="infog"
                    description="Valor total das linhas"
                    value={`R$ ${valoresTotais.total.toFixed(2).replace(".", ",")}`}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="payments"
                    title="VIVO"
                    description="Valor das Linhas VIVO"
                    value={`R$ ${valoresTotais.vivo.toFixed(2).replace(".", ",")}`}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="payments"
                    title="TIM"
                    description="Valor das Linhas TIM"
                    value={`R$ ${valoresTotais.tim.toFixed(2).replace(".", ",")}`}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="payments"
                    title="CLARO"
                    description="Valor das Linhas CLARO"
                    color="error"
                    value={`R$ ${valoresTotais.claro.toFixed(2).replace(".", ",")}`}
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
