import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Componentes do Dashboard
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Componentes personalizados
import Add90Compor from "./components/Add90Compor";
import TableCompor90 from "./data/TableCompor90"; // Você deve criar esse componente
import { apiCompor90 } from "../../../service/apiGAATI"; // sua API para /compor90

function DashboardCompor90() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [baseGeral, setBaseGeral] = useState(0);
  const [baseSecundaria, setBaseSecundaria] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCompor90.get("/");
        const data = response.data;

        setTotalRegistros(data.length);
        setBaseGeral(data.filter((item) => item.BASE === "GERAL").length);
        setBaseSecundaria(data.filter((item) => item.BASE === "SECUNDARIA").length);
      } catch (error) {
        console.error("Erro ao buscar dados do Compor90:", error);
      }
    };

    fetchData();
  }, []);

  const calcularPorcentagem = (parte, total) => {
    if (total === 0) return "0%";
    return `${((parte / total) * 100).toFixed(1)}%`;
  };

  const handleAdd = (novo) => {
    console.log("Novo Compor90 adicionado:", novo);
    // Aqui você pode atualizar a tabela se quiser
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <ComplexStatisticsCard
              color="info"
              icon="storage"
              title="Total de Registros"
              count={totalRegistros}
              percentage={{
                color: "success",
                amount: "",
                label: "linhas no Compor90",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ComplexStatisticsCard
              color="success"
              icon="storage"
              title="Base: GERAL"
              count={baseGeral}
              percentage={{
                color: "success",
                amount: calcularPorcentagem(baseGeral, totalRegistros),
                label: "do total",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ComplexStatisticsCard
              color="warning"
              icon="storage"
              title="Base: SECUNDARIA"
              count={baseSecundaria}
              percentage={{
                color: "success",
                amount: calcularPorcentagem(baseSecundaria, totalRegistros),
                label: "do total",
              }}
            />
          </Grid>
        </Grid>

        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Add90Compor onProductAdd={handleAdd} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <TableCompor90 /> {/* Exibe a tabela com os dados de compor90 */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DashboardCompor90;
