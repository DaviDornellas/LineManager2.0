import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import api from "../../../service/index"; // Importando API
import LinesTableData from "layouts/tablelines/data/LinesTableData";

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
  }, []);

  const calcularPorcentagem = (atual, anterior) => {
    if (anterior === 0) return "0%";
    const diferenca = ((atual - anterior) / anterior) * 100;
    return `${diferenca.toFixed(1)}%`;
  };

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
            <MDBox pt={3}>
              <LinesTableData />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
