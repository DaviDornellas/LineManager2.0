import React, { useState, useEffect } from "react";
import { apiCompor90 } from "../../../../../service/apiGAATI"; // API correta para compor90
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

const AddProduct = ({ onProductAdd }) => {
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [base, setBase] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await apiCompor90.get("/compor90");
        const uniqueBases = [...new Set(response.data.map((item) => item.BASE))];
        setBases(uniqueBases);
      } catch (error) {
        console.error("Erro ao buscar bases:", error);
      }
    };

    fetchBases();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!nome || !base) {
      setSnackbarMessage("Preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await apiCompor90.post("/compor90", {
        NOME: nome.toUpperCase(),
        BASE: base.toUpperCase(),
      });

      onProductAdd(response.data);
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
          Adicionar Usuário ao Compor90
        </MDTypography>
        <form onSubmit={handleAddProduct}>
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
            <MDButton variant="gradient" color="info" type="submit">
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
