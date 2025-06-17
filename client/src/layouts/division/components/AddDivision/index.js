import React, { useState } from "react";
import { api2 } from "../../../../service/indexdivision";
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
  const [divisionName, setDivisionName] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [divisionNumber, setDivisionNumber] = useState("");
  const [responsibleCompany, setResponsibleCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api2.post("/division", {
        divisionName,
        costCenter,
        divisionNumber,
        responsibleCompany,
        startDate,
        status,
      });
      onProductAdd(response.data);

      // Reset fields
      setDivisionName("");
      setCostCenter("");
      setDivisionNumber("");
      setResponsibleCompany("");
      setStartDate("");
      setStatus("");

      setSnackbarMessage("Divisão adicionada com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Erro ao adicionar divisão. Tente novamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Adicionar Divisão
        </MDTypography>
        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <MDInput
                label="Número da divisão"
                fullWidth
                value={divisionNumber}
                onChange={(e) => setDivisionNumber(e.target.value.toUpperCase())}
                required
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Nome da divisão"
                fullWidth
                value={divisionName}
                onChange={(e) => setDivisionName(e.target.value.toUpperCase())}
                required
              />
            </Grid>
            <Grid item>
              <MDInput
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                SelectProps={{ sx: { height: "44px" } }}
              >
                <MenuItem value="Habilitada">Habilitada</MenuItem>
                <MenuItem value="Desabilitada">Desabilitada</MenuItem>
              </MDInput>
            </Grid>
          </Grid>
          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="infog" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Adicionar Divisão
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
