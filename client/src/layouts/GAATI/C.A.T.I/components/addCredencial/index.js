import React, { useState, useEffect } from "react";
import { apiCredencial } from "../../../../../service/apiGAATI";
import { apiCostCenter } from "../../../../../service/indexdivision";
import { api2 } from "../../../../../service/indexdivision";
import { TextField, Grid, Autocomplete, Snackbar, Alert, Card } from "@mui/material";
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
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [costCenters, setCostCenters] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
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
    const fetchCostCenter = async () => {
      try {
        const response = await apiCostCenter.get("/costcenter");
        setCostCenters(response.data);
      } catch (error) {
        console.error("Erro ao carregar divisões:", error);
      }
    };
    fetchCostCenter();
  }, []);
  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddCredencial = async (e) => {
    e.preventDefault();

    if (!nome || !selectedDivision || !selectedCostCenter || !chamado) {
      setSnackbarMessage("Preencha todos os campos obrigatórios.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const officeCode =
        selectedDivision.toUpperCase() + (selectedCostCenter?.costCenter || "").toUpperCase();
      console.log({
        Nome: capitalizeWords(nome),
        Office: officeCode,
        Chamado: chamado.toUpperCase(),
      });
      const response = await apiCredencial.post("/credencial", {
        Nome: capitalizeWords(nome),
        Office: officeCode,
        Chamado: chamado.toUpperCase(),
      });

      onCredencialAdd(response.data);
      setNome("");
      setChamado("");
      setSelectedDivision("");
      setSelectedCostCenter(null);
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

  const handleDivisionSelect = async (event, value) => {
    const divisionNumber = value ? value.divisionNumber : "";
    setSelectedDivision(divisionNumber);

    if (divisionNumber > "A100") {
      // Se for maior que A100, define o centro de custo fixo como A005
      setCostCenters([]);
      setSelectedCostCenter({ id: "A005", costCenter: "A005" });
    } else if (divisionNumber) {
      // Caso contrário, carrega os centros de custo disponíveis
      try {
        const response = await apiCostCenter.get("/costcenter");
        const filtered = response.data.filter((cc) => cc.divisionNumber === divisionNumber);
        setCostCenters(filtered);
        setSelectedCostCenter(null);
      } catch (error) {
        console.error("Erro ao buscar centros de custo:", error);
      }
    } else {
      setCostCenters([]);
      setSelectedCostCenter(null);
    }
  };
  const handleCostCenterSelect = (event, value) => {
    setSelectedCostCenter(value);
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
                value={divisions.find((d) => d.divisionNumber === selectedDivision) || null}
                onChange={handleDivisionSelect}
                options={divisions}
                getOptionLabel={(option) => `${option.divisionNumber} - ${option.divisionName}`}
                renderInput={(params) => (
                  <TextField {...params} label="Selecionar Obra (Divisão)" variant="outlined" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.divisionNumber === value.divisionNumber
                }
                fullWidth
              />
            </Grid>
            {selectedDivision && selectedDivision <= "A100" && (
              <Grid item>
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
              </Grid>
            )}
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
