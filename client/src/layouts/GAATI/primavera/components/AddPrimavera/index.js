import React, { useState, useEffect } from "react";
import { apiPrimavera } from "../../../../../service/apiGAATI"; // API correta para compor90
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";

const AddPrimavera = ({ onPrimaveraAdd }) => {
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [base, setBase] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await apiPrimavera.get("/primavera");
        const uniqueBases = [...new Set(response.data.map((item) => item.BASE))];
        setBases(uniqueBases);
      } catch (error) {
        console.error("Erro ao buscar bases:", error);
      }
    };

    fetchBases();
  }, []);
  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddPrimavera = async (e) => {
    e.preventDefault();

    if (!nome || !base) {
      setSnackbarMessage("Preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await apiPrimavera.post("/primavera", {
        NOME: capitalizeWords(nome),
        BASE: base.toUpperCase(),
      });

      onPrimaveraAdd(response.data);
      setNome("");
      setBase("");
      setSnackbarMessage("Usuário adicionado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      setSnackbarMessage("Erro ao adicionar usuário. Tente novamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Adicionar Usuário ao Primavera
        </MDTypography>
        <form onSubmit={handleAddPrimavera}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Nome do Usuário"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Base"
                fullWidth
                value={base}
                onChange={(e) => setBase(e.target.value)}
                required
                list="base-options"
              />
              <datalist id="base-options">
                {bases.map((b, idx) => (
                  <option key={idx} value={b} />
                ))}
              </datalist>
            </Grid>
          </Grid>
          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="infog" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Adicionar Usuário
            </MDButton>
          </MDBox>
        </form>
      </MDBox>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

AddPrimavera.propTypes = {
  onPrimaveraAdd: PropTypes.func.isRequired,
};

export default AddPrimavera;
