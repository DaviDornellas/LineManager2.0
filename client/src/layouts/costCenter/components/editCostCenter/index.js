import React, { useState, useEffect } from "react";
import { TextField, Button, Autocomplete, Snackbar, Alert, MenuItem, Card } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { api2 } from "../../../../service/indexdivision";
import { apiCostCenter } from "../../../../service/indexdivision";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const EditCostCenter = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [costCenters, setCostCenters] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [editedCostCenter, setEditedCostCenter] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await api2.get("/division");
        setDivisions(response.data);
      } catch (error) {
        console.error("Erro ao carregar divisões:", error);
      }
    };
    fetchDivisions();
  }, []);

  const handleDivisionSelect = async (event, value) => {
    setSelectedDivision(value);
    setSelectedCostCenter(null);
    setEditedCostCenter(null);

    if (value) {
      try {
        const response = await apiCostCenter.get("/costcenter");
        const filtered = response.data.filter((cc) => cc.divisionNumber === value.divisionNumber);
        setCostCenters(filtered);
      } catch (error) {
        console.error("Erro ao buscar centros de custo:", error);
      }
    } else {
      setCostCenters([]);
    }
  };

  const handleCostCenterSelect = (event, value) => {
    setSelectedCostCenter(value);
    setEditedCostCenter({ ...value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCostCenter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await apiCostCenter.put(`/costcenter/${editedCostCenter.id}`, editedCostCenter);
      const updatedList = costCenters.map((cc) =>
        cc.id === editedCostCenter.id ? editedCostCenter : cc
      );
      setCostCenters(updatedList);
      setSelectedCostCenter(editedCostCenter);

      setSnackbarMessage("Centro de Custo atualizado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao atualizar Centro de Custo:", error);
      setSnackbarMessage("Erro ao atualizar Centro de Custo.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    setEditedCostCenter({ ...selectedCostCenter });
  };

  return (
    <Card>
      <MDBox p={4}>
        <Autocomplete
          value={selectedDivision}
          onChange={handleDivisionSelect}
          options={divisions}
          getOptionLabel={(option) => `${option.divisionNumber} - ${option.divisionName}`}
          renderInput={(params) => (
            <TextField {...params} label="Selecionar Obra (Divisão)" variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          fullWidth
        />

        {selectedDivision && (
          <MDBox mt={3}>
            <Autocomplete
              value={selectedCostCenter}
              onChange={handleCostCenterSelect}
              options={costCenters}
              getOptionLabel={(option) => `${option.costCenter}`}
              renderInput={(params) => (
                <TextField {...params} label="Selecionar Centro de Custo" variant="outlined" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              fullWidth
            />
          </MDBox>
        )}

        {editedCostCenter && (
          <MDBox mt={3}>
            <TextField
              label="Centro de Custo"
              variant="outlined"
              fullWidth
              name="costCenter"
              value={editedCostCenter.costCenter || ""}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              select
              label="Divisão"
              variant="outlined"
              fullWidth
              name="divisionNumber"
              value={editedCostCenter.divisionNumber || ""}
              onChange={handleInputChange}
              margin="normal"
              SelectProps={{ sx: { height: "44px" } }}
              disabled
            >
              <MenuItem value={selectedDivision.divisionNumber}>
                {selectedDivision.divisionName} ({selectedDivision.divisionNumber})
              </MenuItem>
            </TextField>

            <MDBox mt={2}>
              <MDButton
                variant="contained"
                color="infog"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Salvar
              </MDButton>
              <MDButton
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ ml: 2 }}
              >
                Cancelar
              </MDButton>
            </MDBox>
          </MDBox>
        )}
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

export default EditCostCenter;
