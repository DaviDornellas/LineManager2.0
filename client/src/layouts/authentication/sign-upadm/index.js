import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import {
  Autocomplete,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Checkbox,
  Card,
  Grid,
  TextField,
} from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Função de cadastro
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bloqueia o botão enquanto carrega
    setErrorMessage(""); // Limpa mensagens de erro anteriores

    try {
      await axios.post("http://192.168.7.65:5000/api/auth/register", {
        username,
        position,
        location,
        email,
        password,
        role,
      });

      console.log("Cadastro realizado com sucesso!");
      navigate("/tables"); // Redireciona para a tabela de usuarios
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErrorMessage(error.response?.data?.error || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="infog"
            borderRadius="lg"
            coloredShadow="cdcdcd"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Adicionar Usuário
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Insira os dados para registrar um novo usuário
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleRegister}>
              {errorMessage && (
                <MDTypography color="error" variant="body2" textAlign="center" mb={2}>
                  {errorMessage}
                </MDTypography>
              )}
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Nome Completo"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Cargo"
                  fullWidth
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Origem: Ex A381"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Senha"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDBox mb={2}>
                  <Autocomplete
                    options={["admin", "reader", "editor", "admingati"]}
                    value={role}
                    onChange={(event, newValue) => setRole(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Tipo" variant="outlined" fullWidth />
                    )}
                  />
                </MDBox>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="infog"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
