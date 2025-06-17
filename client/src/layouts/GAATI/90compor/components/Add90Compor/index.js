import React, { useState, useEffect } from "react";
import { apiCompor90 } from "../../../../../service/apiGAATI"; // API correta para compor90
import { api2 } from "../../../../../service/indexdivision";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";

const AddProduct = ({ onProductAdd }) => {
  const [divisions, setDivisions] = useState([]);
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await api2.get("/division");
        setDivisions(response.data);
      } catch (error) {
        console.error("Erro ao buscar divisões:", error);
      }
    };

    fetchDivisions();
  }, []);
  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!nome || !selectedDivision) {
      setSnackbarMessage("Preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await apiCompor90.post("/compor90", {
        NOME: capitalizeWords(nome),
        BASE: selectedDivision.divisionNumber, // Envia divisionNumber como BASE
      });

      onProductAdd(response.data);
      setNome("");
      setSelectedDivision(null);

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
          Adicionar Usuário ao Compor90
        </MDTypography>
        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Nome do Usuário"
                fullWidth
                value={nome}
                onChange={(e) => {
                  const apenasLetras = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
                  setNome(apenasLetras);
                }}
                required
              />
            </Grid>
            <Grid item>
              <Autocomplete
                options={divisions}
                getOptionLabel={(option) => `${option.divisionNumber} - ${option.divisionName}`}
                value={selectedDivision}
                onChange={(event, newValue) => setSelectedDivision(newValue)}
                renderInput={(params) => <TextField {...params} label="Obra (Divisão)" required />}
              />
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

AddProduct.propTypes = {
  onProductAdd: PropTypes.func.isRequired,
};

export default AddProduct;
