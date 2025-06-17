import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TransferLine from "./components/TransferLine";
import EditDivision from "./components/editDivision/index";
import LinesTableData from "layouts/division/data/LinesTableData";
import { api2 } from "../../service/indexdivision"; // Importando API

function Dashboard() {
  const [totalObras, setTotalObras] = useState(0);
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

  const handleProductAdd = (produto) => {
    console.log("Produto adicionado:", produto);
    // Você pode atualizar o estado do seu Dashboard aqui ou realizar outras ações necessárias
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                  Transferir Linha
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={12}>
                    <TransferLine />
                  </Grid>
                  {/* <Grid item xs={12} md={6} lg={12}>
                        <EditDivision />
                      </Grid> */}
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
