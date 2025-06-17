import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AddCostCenter from "./components/AddCostCenter";
import MDTypography from "components/MDTypography";
import EditCostCenter from "./components/editCostCenter";
import LinesTableData from "layouts/division/data/LinesTableData";
import { api2 } from "../../service/indexdivision"; // Importando API

function Dashboard() {
  const [totalObras, setTotalObras] = useState(0);
  const [habilitadas, setHabilitadas] = useState(0);
  const [desabilitadas, setDesabilitadas] = useState(0);
  const [prevTotalObras, setPrevTotalObras] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api2.get("/division");
        const Obras = response.data;
        const newTotal = Obras.length;

        // Calcular habilitadas e desabilitadas corretamente
        const newHabilitadas = Obras.filter(
          (p) => p.status?.toLowerCase().trim() === "habilitada"
        ).length;
        const newDesabilitadas = newTotal - newHabilitadas; // Desabilitadas é o total menos as habilitadas

        // Atualizar os estados
        setPrevTotalObras(totalObras); // Atualizando o total anterior
        setTotalObras(newTotal); // Atualizando o total de obras
        setHabilitadas(newHabilitadas); // Habilitadas
        setDesabilitadas(newDesabilitadas); // Desabilitadas
      } catch (error) {
        console.error("Erro ao buscar os dados dos produtos", error);
      }
    };

    fetchData();
  }, [totalObras]); // Mantendo a dependência de totalObras

  const calcularPorcentagem = (parte, total) => {
    if (total === 0) return "0%";
    const porcentagem = (parte / total) * 100;
    return `${porcentagem.toFixed(1)}%`;
  };

  const handleAddCostCenter = (produto) => {
    console.log("Produto adicionado:", produto);
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
            Centro de Custo
          </MDTypography>
        </MDBox>
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <AddCostCenter onCostCenterAdd={handleAddCostCenter} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <EditCostCenter />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
