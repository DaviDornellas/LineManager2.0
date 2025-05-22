import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AddCredencial from "./components/addCredencial/index";
import TableCredencial from "./data/TableCredencial";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { apiCredencial } from "../../../service/apiGAATI"; // sua API para /compor90

function Dashboard() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [baseGeral, setBaseGeral] = useState(0);
  const [baseSecundaria, setBaseSecundaria] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCredencial.get("/credencial");
        const data = response.data;

        setTotalRegistros(data.length);
        setBaseGeral(data.filter((item) => item.BASE === "GERAL").length);
        setBaseSecundaria(data.filter((item) => item.BASE === "SECUNDARIA").length);
      } catch (error) {
        console.error("Erro ao buscar dados do credencial:", error);
      }
    };

    fetchData();
  }, []);

  const calcularPorcentagem = (parte, total) => {
    if (total === 0) return "0%";
    const porcentagem = (parte / total) * 100;
    return `${porcentagem.toFixed(1)}%`;
  };

  const handleAddCredencial = (novo) => {
    console.log("Produto adicionado:", novo);
    // Você pode atualizar o estado do seu Dashboard aqui ou realizar outras ações necessárias
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
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
              C.A.T.I
            </MDTypography>
          </MDBox>
          <Grid item xs={12} md={6} lg={12}>
            <AddCredencial onCredencialAdd={handleAddCredencial} />
          </Grid>
        </Card>
        <Grid item xs={12}>
          <MDBox pt={3}>
            <TableCredencial />
          </MDBox>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
