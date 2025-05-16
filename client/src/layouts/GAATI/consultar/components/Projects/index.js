import React, { useState } from "react";
import api from "../../../../service/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";

const AddProduct = ({ onProductAdd }) => {
  const [responsible, setResponsible] = useState("");
  const [artwork, setArtwork] = useState("");
  const [destiwork, setDestiwork] = useState("");
  const [operator, setOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length <= 7) {
      return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    }
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setPhoneError(validatePhoneNumber(formatted) ? "" : "Número de telefone inválido.");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Número de telefone inválido.");
      return;
    }
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
    try {
      const response = await api.post("/produtos", {
        responsible,
        artwork,
        destiwork,
        operator,
        phoneNumber: cleanPhoneNumber,
        date,
        category,
      });
      onProductAdd(response.data);
      setResponsible("");
      setArtwork("");
      setDestiwork("");
      setOperator("");
      setPhoneNumber("");
      setDate("");
      setCategory("");
      setPhoneError("");
      setSnackbarMessage("Produto adicionado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.log(error); // Adicione isso para ver o erro no console
      setSnackbarMessage("Erro ao adicionar produto. Tente novamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Adicionar Linha
        </MDTypography>
        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Responsável"
                fullWidth
                value={responsible}
                onChange={(e) => setResponsible(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Obra de Origem"
                fullWidth
                value={artwork}
                onChange={(e) => setArtwork(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Obra Vinculada"
                fullWidth
                value={destiwork}
                onChange={(e) => setDestiwork(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Operadora"
                fullWidth
                value={operator}
                onChange={(e) => setOperator(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Número da Linha"
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={Boolean(phoneError)}
                helperText={phoneError}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                select
                label="Status"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <MenuItem value="Habilitada">Habilitada</MenuItem>
                <MenuItem value="Desabilitada">Desabilitada</MenuItem>
              </MDInput>
            </Grid>
          </Grid>
          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="info" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add new Line
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
