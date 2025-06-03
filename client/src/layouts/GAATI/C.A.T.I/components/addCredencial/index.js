import React, { useState, useEffect } from "react";
import { apiCredencial } from "../../../../../service/apiGAATI"; // API correta para compor90

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";

const AddCredencial = ({ onCredencialAdd }) => {
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [centrocusto, setCentroCusto] = useState("");
  const [obra, setObra] = useState("");
  const [chamado, setChamado] = useState("");
  const [ativo, setAtivo] = useState(false); // false = 0, true = 1
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await apiCredencial.get("/credencial");
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

  const handleAddCredencial = async (e) => {
    e.preventDefault();

    if (!nome || !centrocusto || !obra || !chamado) {
      setSnackbarMessage("Preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await apiCredencial.post("/credencial", {
        Nome: capitalizeWords(nome),
        Office: `${obra.toUpperCase()}${centrocusto.toUpperCase()}`,
        Chamado: chamado.toUpperCase(),
      });

      onCredencialAdd(response.data);
      setNome("");
      setCentroCusto("");
      setObra("");
      setChamado("");
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
          Cadastrar Credencial
        </MDTypography>
        <form onSubmit={handleAddCredencial}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Nome"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Obra"
                fullWidth
                value={obra}
                onChange={(e) => setObra(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Central de custo"
                fullWidth
                value={centrocusto}
                onChange={(e) => setCentroCusto(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Chamado"
                fullWidth
                value={chamado}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setChamado(onlyNumbers);
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 5 }}
                required
              />
            </Grid>
          </Grid>
          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="infog" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Cadastrar
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

AddCredencial.propTypes = {
  onCredencialAdd: PropTypes.func.isRequired,
};

export default AddCredencial;
