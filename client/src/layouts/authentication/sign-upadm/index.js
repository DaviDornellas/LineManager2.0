// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import BasicLayout from "layouts/authentication/components/BasicLayout";

function Cover() {
  const navigate = useNavigate();

  // Estados do formulário
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função de cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bloqueia o botão enquanto carrega
    setErrorMessage(""); // Limpa mensagens de erro anteriores

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        position,
        location,
        email,
        password,
        role,
      });

      console.log("Cadastro realizado com sucesso!");
      navigate("/authentication/sign-in"); // Redireciona para login
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErrorMessage(error.response?.data?.error || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasicLayout>
      <Card>
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
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Tipo</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={role}
                  label="Tipo"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
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
    </BasicLayout>
  );
}

export default Cover;
