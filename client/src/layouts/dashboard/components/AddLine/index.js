import React, { useState, useEffect } from "react";
import api from "../../../../service/index";
import api2 from "../../../../service/indexdivision";
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
    value: div.id,
  }));

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
  const obrasList = [
    { value: "A329", label: "A329 - Barragem Jeceaba/MG - Vale" },
    { value: "A331", label: "A331 - Túneis 1 e 4 - Litoral Sul - Arteris" },
    { value: "A342", label: "A342 - Projeto Piloto Mina de Fábrica - Vale" },
    { value: "A344", label: "A344 - Túnel 2 - Litoral Sul - Arteris" },
    { value: "A345", label: "A345 - Obra Desenv. Mina Cachoeira - Araçuaí - CBL" },
    { value: "A348", label: "A348 - Recuperação Drenagem - Mariana - Vale" },
    { value: "A350", label: "A350 - Túnel 3 - Litoral Sul - Arteris" },
    { value: "A353", label: "A353 - Dique Minervino - Vale" },
    { value: "A354", label: "A354 - Maravilhas III - Itabirito - Vale" },
    { value: "A355", label: "A355 - PPD - Túneis Litoral Sul - Arteris" },
    { value: "A356", label: "A356 - CDB - Barão de Cocais/MG - Avante" },
    { value: "A357", label: "A357 - CDA - Congonhas/MG - Avante" },
    { value: "A358", label: "A358 - Extravasores Timbobeba/Mosquito - Vale" },
    { value: "A359", label: "A359 - Contorno De Florianópolis - Arteris" },
    { value: "C331", label: "C331 - Túneis 1 e 4 - Litoral Sul - Arteris" },
    { value: "C344", label: "C344 - Túnel 2 - Litoral Sul - Arteris" },
    { value: "C350", label: "C350 - Túnel 3 - Litoral Sul - Arteris" },
    { value: "C355", label: "C355 - PPD - Túneis Litoral Sul - Arteris" },
    { value: "C359", label: "C359 - Contorno De Florianópolis - Arteris" },
    { value: "Z331", label: "Z331 - Túneis 1 e 4 - Litoral Sul - Arteris" },
    { value: "Z344", label: "Z344 - Túnel 2 - Litoral Sul - Arteris" },
    { value: "Z350", label: "Z350 - Túnel 3 - Litoral Sul - Arteris" },
    { value: "Z355", label: "Z355 - PPD - Túneis Litoral Sul - Arteris" },
    { value: "Z359", label: "Z359 - Contorno De Florianópolis - Arteris" },
    { value: "344B", label: "344B - Túnel 2 - Litoral Sul - Arteris - Filial Palhoça" },
    { value: "344C", label: "344C - Túnel 2 - Litoral Sul - Arteris - Filial São José" },
    { value: "331B", label: "331B - Túneis 1 e 4 - Litoral Sul - Arteris - Filial Palhoça" },
    { value: "331C", label: "331C - Túneis 1 e 4 - Litoral Sul - Arteris - Filial São José" },
    { value: "350B", label: "350B - Túnel 3 - Litoral Sul - Arteris - Filial Palhoça" },
    { value: "350C", label: "350C - Túnel 3 - Litoral Sul - Arteris - Filial São José" },
    { value: "359B", label: "359B - Contorno De Florianópolis - Arteris - Filial Palhoça" },
    { value: "359C", label: "359C - Contorno De Florianópolis - Arteris - Filial São José" },
    { value: "A361", label: "A361 - FICO - Lote II - Goiás - Vale" },
    { value: "A362", label: "A362 - Descaracterização - Mina Pitangui - Vale" },
    { value: "A363", label: "A363 - Perfuração Mina Cachoeira Araçuai/MG - CBL" },
    { value: "A364", label: "A364 - CONSORCIO MLC ATERPA - INOCENCIA/MS - ARAUCO" },
    { value: "A365", label: "A365 - Consórcio Construtor BR-381" },
    { value: "A367", label: "A367 - Mina Brucutu - Vale - Barão de Cocais/MG" },
    { value: "A368", label: "A368 - Desenvolvimento da Mina de Caraíba - ERO - Jaguarari/BA" },
    { value: "A369", label: "A369 - FICO - Lotes 7 e 8 - MT - Vale" },
    { value: "A370", label: "A370 - Rodoanel Norte - Consórcio Cantareira - SP" },
    { value: "A002", label: "A002 - CILAterpa" },
    { value: "J002", label: "J002 - CILJDantas" },
    { value: "A107", label: "A107 - CentraldeEquipamentosAterpa" },
    { value: "A109", label: "A109 - CentraldeEquipamentosJDantas" },
    { value: "A283", label: "A283 - LocaçãoEquipamentosAterpa" },
    { value: "A001A", label: "A001 - Administrativo" },
    { value: "A001C", label: "A001 - Compliance" },
    { value: "A001CPPP", label: "A001 - ConcessõesePPPs" },
    { value: "A001CF", label: "A001 - Contabilidade/Fiscal" },
    { value: "A001D", label: "A001 - Diretoria" },
    { value: "A001DP", label: "A001 - DP" },
    { value: "A001E", label: "A001 - ExcelenciaOperacional" },
    { value: "A001F", label: "A001 - Financeiro" },
    { value: "A001J", label: "A001 - Jurídico" },
    { value: "A001P", label: "A001 - Planejamento" },
    { value: "A001Q", label: "A001 - QSMR" },
    { value: "A001R", label: "A001 - RH" },
    { value: "A001ST", label: "A001 - SeçãoTécnica" },
    { value: "A001S", label: "A001 - Suprimentos" },
    { value: "A001TI", label: "A001 - TI" },
    { value: "J001A", label: "J001 - Administrativo" },
    { value: "J001C", label: "J001 - Compliance" },
    { value: "J001C", label: "J001 - ConcessõesePPPs" },
    { value: "J001CF", label: "J001 - Contabilidade/Fiscal" },
    { value: "J001D", label: "J001 - Diretoria" },
    { value: "J001DP", label: "J001 - DP" },
    { value: "J001E", label: "J001 - ExcelenciaOperacional" },
    { value: "J001F", label: "J001 - Financeiro" },
    { value: "J001J", label: "J001 - Jurídico" },
    { value: "J001P", label: "J001 - Planejamento" },
    { value: "J001Q", label: "J001 - QSMR" },
    { value: "J001RH", label: "J001 - RH" },
    { value: "J001ST", label: "J001 - SeçãoTécnica" },
    { value: "J001S", label: "J001 - Suprimentos" },
    { value: "J001TI", label: "J001 - TI" },
    { value: "M001A", label: "M001 - Administrativo" },
  ];

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
                  setProduct({ ...product, obraOrigem: newValue?.value || "" });
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
                  setProduct({ ...product, obraVinculada: newValue?.value || "" });
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
