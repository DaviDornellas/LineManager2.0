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
import Addsenha from "./components/Addsenha/index";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import api from "../../../service/index"; // Importando API

function Dashboard() {
  const [totalLinhas, setTotalLinhas] = useState(0);
  const [habilitadas, setHabilitadas] = useState(0);
  const [desabilitadas, setDesabilitadas] = useState(0);
  const [prevTotalLinhas, setPrevTotalLinhas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/produtos");
        const produtos = response.data;
        const newTotal = produtos.length;
        const newHabilitadas = produtos.filter((p) => p.category === "Habilitada").length;
        const newDesabilitadas = newTotal - newHabilitadas;

        setPrevTotalLinhas(totalLinhas);
        setTotalLinhas(newTotal);
        setHabilitadas(newHabilitadas);
        setDesabilitadas(newDesabilitadas);
      } catch (error) {
        console.error("Erro ao buscar os dados dos produtos", error);
      }
    };

    fetchData();
  }, [totalLinhas]); // Apenas totalLinhas como dependência

  const calcularPorcentagem = (parte, total) => {
    if (total === 0) return "0%";
    const porcentagem = (parte / total) * 100;
    return `${porcentagem.toFixed(1)}%`;
  };

  const handleProductAdd = (produto) => {
    console.log("Produto adicionado:", produto);
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
              Senha
            </MDTypography>
          </MDBox>
          <Grid item xs={12} md={6} lg={8}>
            <Addsenha onProductAdd={handleProductAdd} />
          </Grid>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
