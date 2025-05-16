import React, { useState, useEffect } from "react";
import api from "../../../../../service/index";
import api2 from "../../../../../service/indexdivision";
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
import { Autocomplete, TextField } from "@mui/material";

const AddProduct = ({ onProductAdd }) => {
  const [responsible, setResponsible] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const special = "@";
    const digits = "0123456789";
    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

    const part1 =
      getRandomChar(upper) + getRandomChar(lower) + getRandomChar(lower) + getRandomChar(lower);
    const part2 = getRandomChar(special);
    const part3 =
      getRandomChar(digits) + getRandomChar(digits) + getRandomChar(digits) + getRandomChar(digits);

    return part1 + part2 + part3;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const password = generatePassword();
    setGeneratedPassword(password);

    try {
      await navigator.clipboard.writeText(password);
      setSnackbarMessage("Senha gerada e copiada para a área de transferência!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Erro ao copiar senha:", err);
      setSnackbarMessage("Senha gerada, mas não foi possível copiar.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Gerar Senha VPN
        </MDTypography>
        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Usuário"
                fullWidth
                value={responsible}
                onChange={(e) => setResponsible(e.target.value.toUpperCase())}
                required
              />
            </Grid>
          </Grid>

          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="info" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>vpn_key</Icon>
              &nbsp;Gerar Senha
            </MDButton>
          </MDBox>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Senha Gerada"
                fullWidth
                value={generatedPassword}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
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
