import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Componentes do Dashboard
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Componentes personalizados
import Add90Compor from "./components/Add90Compor";
import TableCompor90 from "./data/TableCompor90 copy"; // Você deve criar esse componente
import { apiCompor90 } from "../../../service/apiGAATI"; // sua API para /compor90

function DashboardCompor90() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [baseGeral, setBaseGeral] = useState(0);
  const [baseSecundaria, setBaseSecundaria] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCompor90.get("/compor90");
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
        <MDBox
          mx={2}
          mt={-3}
          py={3}
          px={2}
          variant="gradient"
          bgColor="infog"
          borderRadius="lg"
          coloredShadow="infog"
        >
          <MDTypography variant="h6" color="white">
            Compor 90
          </MDTypography>
        </MDBox>
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
