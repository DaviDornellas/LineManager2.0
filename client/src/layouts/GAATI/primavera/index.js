import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import AddPrimavera from "./components/AddPrimavera/index";
import TablePrimavera from "./data/TablePrimavera"; // Você deve criar esse componente
import { apiPrimavera } from "../../../service/apiGAATI"; // sua API para /compor90

function DashboardPrimavera() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [baseGeral, setBaseGeral] = useState(0);
  const [baseSecundaria, setBaseSecundaria] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiPrimavera.get("/primavera");
        const data = response.data;

        setTotalRegistros(data.length);
        setBaseGeral(data.filter((item) => item.BASE === "GERAL").length);
        setBaseSecundaria(data.filter((item) => item.BASE === "SECUNDARIA").length);
      } catch (error) {
        console.error("Erro ao buscar dados do Primavera:", error);
      }
    };

    fetchData();
  }, []);

  const calcularPorcentagem = (parte, total) => {
    if (total === 0) return "0%";
    return `${((parte / total) * 100).toFixed(1)}%`;
  };

  const handleAddPrimavera = (novoo) => {
    console.log("Usuario adicionado:", novoo);
    // Você pode atualizar o estado do seu Dashboard aqui ou realizar outras ações necessárias
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
            Primavera
          </MDTypography>
        </MDBox>
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <AddPrimavera onPrimaveraAdd={handleAddPrimavera} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <TablePrimavera /> {/* Exibe a tabela com os dados de Primavera */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DashboardPrimavera;
