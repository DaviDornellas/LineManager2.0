import React, { useState, useEffect } from "react";
import api from "../../../../service/index";
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
import { Autocomplete, TextField } from "@mui/material";

const AddProduct = ({ onProductAdd }) => {
  const [divisions, setDivisions] = useState([]);

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

  const divisionOptions = divisions.map((div) => ({
    label: `${div.divisionNumber} - ${div.divisionName}`,
    value: `${div.divisionNumber}`,
  }));

  const [responsible, setResponsible] = useState("");
  const [operator, setOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [product, setProduct] = useState({
    // outros campos...
    obraOrigem: "",
    obraVinculada: "",
  });

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
        artwork: product.obraOrigem,
        destiwork: product.obraVinculada,
        operator,
        phoneNumber: cleanPhoneNumber,
        date,
        category,
      });

      onProductAdd(response.data);
      setResponsible("");
      setOperator("");
      setPhoneNumber("");
      setDate("");
      setCategory("");
      setPhoneError("");
      setProduct({ obraOrigem: "", obraVinculada: "" });
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
              <Autocomplete
                options={divisionOptions}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                  setProduct((prev) => ({
                    ...prev,
                    obraOrigem: newValue?.value || "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Obra de Origem" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                options={divisionOptions}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                  setProduct((prev) => ({
                    ...prev,
                    obraVinculada: newValue?.value || "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Obra Vinculada" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item>
              <MDInput
                select
                label="Operadora"
                fullWidth
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                required
                SelectProps={{ sx: { height: "44px" } }}
              >
                <MenuItem value="VIVO">VIVO</MenuItem>
                <MenuItem value="TIM">TIM</MenuItem>
                <MenuItem value="CLARO">CLARO</MenuItem>
              </MDInput>
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
