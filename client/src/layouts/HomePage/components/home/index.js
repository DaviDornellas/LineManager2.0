import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import { useMaterialUIController } from "context";

// Imagens
import AterpaLogo from "assets/images/logo-ct.png";
import AterpaLogoDark from "assets/images/logo-ct-dark.png";

const HomePage = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const logoToUse = darkMode ? AterpaLogo : AterpaLogoDark;

  return (
    <MDBox
      sx={{
        height: "75vh",
      }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDBox sx={{ textAlign: "center", px: 3 }}>
          <MDBox
            component="img"
            src={logoToUse}
            alt="Logo Aterpa"
            sx={{
              width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
              height: "auto",
              mb: 2,
            }}
          />
          <MDTypography
            style={{
              lineHeight: "35px",
              display: "block",
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            Plataforma desenvolvida com o objetivo de unificar e simplificar a administração das
            linhas telefônicas corporativas, bem como o gerenciamento dos usuários do sistema
            Primavera, Compor90 e da rede interna. Com essa integração, garantimos uma visão
            centralizada, maior eficiência nos processos e uma gestão mais inteligente e estratégica
            dos recursos da organização.
          </MDTypography>
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default HomePage;
