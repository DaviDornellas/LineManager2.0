import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/grupoaterpa-intercessao.jpg";
import agImage from "assets/images/_grupoaterpa-ponte-anita-garibaldi-br-101-laguna-sc.jpg";
import cgImage from "assets/images/grupoaterpa-aeroporto-de-capelinha.jpg";
import lgImage from "assets/images/logo-ct.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://192.168.7.65:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Token recebido:", response.data.token); // <-- ADICIONE ISSO
      // Armazena o token no localStorage ou sessionStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      // Redireciona para o dashboard
      navigate("/");
    } catch (error) {
      setErrorMessage("Email ou Senha incorretos.");
    }
  };

  return (
    <BasicLayout image={agImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="infog"
          borderRadius="lg"
          coloredShadow="infog"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox mt={3}>
            <img src={lgImage} alt="Logo Aterpa" width="170px" />
          </MDBox>
          <MDTypography color="error" variant="body2" textAlign="center">
            Este é um ambiente de teste.
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            {errorMessage && (
              <MDTypography color="error" variant="body2" textAlign="center">
                {errorMessage}
              </MDTypography>
            )}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="infog" fullWidth>
                Entrar
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Não tem uma conta?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Login;
