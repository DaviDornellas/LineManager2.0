import React, { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

// Importando o PieChart
import PieChart from "examples/Charts/PieChart";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import exportLinhasExcel from "../../data/exportLinhasExcel";
import api from "../../../../service/index";

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [listaProdutos, setListaProdutos] = useState([]);
  const [totalLinhas, setTotalLinhas] = useState(0);
  const [vivo, setVivo] = useState(0);
  const [tim, setTim] = useState(0);
  const [claro, setClaro] = useState(0);
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

        const newVivo = produtos.filter((p) => p.operator === "VIVO").length;
        const newTim = produtos.filter((p) => p.operator === "TIM").length;
        const newClaro = produtos.filter((p) => p.operator === "CLARO").length;

        // Valores unitários
        const precoVivo = 69.21;
        const precoTim = 60.0;
        const precoClaro = 62.96;

        // Totais em reais
        const totalVivoValor = newVivo * precoVivo;
        const totalTimValor = newTim * precoTim;
        const totalClaroValor = newClaro * precoClaro;
        const totalGeral = totalVivoValor + totalTimValor + totalClaroValor;

        setTotalLinhas(newTotal.toString());
        setVivo(newVivo);
        setTim(newTim);
        setClaro(newClaro);
        setValoresTotais({
          vivo: totalVivoValor,
          tim: totalTimValor,
          claro: totalClaroValor,
          total: totalGeral,
        });
      } catch (error) {
        console.error("Erro ao buscar os dados dos produtos", error);
      }
    };

    fetchData();
  }, []);

  // Configuração do PieChart
  const pieChartData = {
    labels: ["VIVO", "TIM", "CLARO"],
    datasets: {
      label: "Quantidade de Linhas",
      backgroundColors: ["#1E88E5", "info", "error"], // Azul, Verde e Vermelho
      data: [vivo, tim, claro],
    },
  };

  return (
    <Card id="delete-account">
      <MDBox pt={3} px={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h5" fontWeight="bold">
          Quantidade de Linhas por Operadora
        </MDTypography>
        <MDBox display="flex" justifyContent="flex-end" mb={2}>
          <MDButton onClick={() => exportLinhasExcel(listaProdutos)} color="success">
            Exportar Excel
          </MDButton>
        </MDBox>
      </MDBox>
      <MDBox p={3}>
        <Grid container spacing={4} alignItems="center">
          {/* Gráfico de Pizza */}
          <Grid item xs={12} md={6}>
            <PieChart
              chart={pieChartData}
              options={{
                animation: {
                  duration: 0, // desativa animação
                },
              }}
            />
          </Grid>

          {/* Legenda estilizada */}
          <Grid item xs={12} md={6}>
            <MDBox
              p={3}
              borderRadius="lg"
              sx={{
                backgroundColor: darkMode ? "#222b36" : "#f5f5f5",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Legenda
              </MDTypography>
              {[
                { label: "VIVO", value: vivo, color: "#1E88E5" },
                { label: "TIM", value: tim, color: "#43A047" },
                { label: "CLARO", value: claro, color: "#E53935" },
              ].map((item) => (
                <MDBox
                  key={item.label}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                  p={1}
                  borderRadius="md"
                  sx={{
                    backgroundColor: darkMode ? "#2c3e50" : "#ffffff",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <MDBox display="flex" alignItems="center">
                    <MDBox
                      width="16px"
                      height="16px"
                      borderRadius="50%"
                      bgcolor={item.color}
                      mr={1.5}
                    />
                    <MDTypography variant="body2" fontWeight="medium">
                      {item.label}
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" fontWeight="bold" color="textPrimary">
                    {item.value} linhas
                  </MDTypography>
                </MDBox>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default PaymentMethod;
