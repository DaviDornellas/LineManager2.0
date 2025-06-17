import React, { useState, useEffect } from "react";
import { api2 } from "../../../../service/indexdivision";
import { apiCostCenter } from "../../../../service/indexdivision";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";

const AddCostCenter = ({ onCostCenterAdd }) => {
  const [costCenter, setCostCenter] = useState("");
  const [divisionNumber, setDivisionNumber] = useState("");
  const [divisions, setDivisions] = useState([]);

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

  const handleAddCostCenter = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCostCenter.post("/costcenter", {
        costCenter: costCenter.toUpperCase(),
        divisionNumber,
      });

      onCostCenterAdd(response.data);

      setCostCenter("");
      setDivisionNumber("");

      setSnackbarMessage("Centro de Custo adicionado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao adicionar centro de custo:", error);
      setSnackbarMessage("Erro ao adicionar Centro de Custo.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Adicionar Centro de Custo
        </MDTypography>
        <form onSubmit={handleAddCostCenter}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Autocomplete
                options={divisions}
                getOptionLabel={(option) => `${option.divisionNumber} - ${option.divisionName}`}
                value={divisions.find((d) => d.divisionNumber === divisionNumber) || null}
                onChange={(event, newValue) => {
                  setDivisionNumber(newValue ? newValue.divisionNumber : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Obra (Divisão)"
                    variant="outlined"
                    required
                    sx={{ height: "44px" }}
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.divisionNumber === value.divisionNumber
                }
              />
            </Grid>
            <Grid item>
              <MDInput
                label="Centro de Custo"
                fullWidth
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <MDBox mt={2} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="infog" type="submit">
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Adicionar Centro de Custo
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

AddCostCenter.propTypes = {
  onCostCenterAdd: PropTypes.func.isRequired,
};

export default AddCostCenter;
