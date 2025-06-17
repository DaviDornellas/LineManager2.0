import React, { useState, useEffect } from "react";
import { TextField, Button, Autocomplete, Snackbar, Alert, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { api2 } from "../../../../service/indexdivision";
import Card from "@mui/material/Card";
import MDBox from "../../../../components/MDBox";
import InputMask from "react-input-mask";

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api2.get("/division");
        setProducts(response.data);
      } catch (err) {
        setError("Erro ao buscar division");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectChange = (event, value) => {
    setSelectedProduct(value);
    setEditedProduct({ ...value }); // Cria uma cópia do division selecionado
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await api2.put(`/division/${editedProduct.id}`, editedProduct);
      const updatedProducts = products.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      );
      setProducts(updatedProducts);
      setSelectedProduct(editedProduct); // Atualiza o division selecionado

      // Show success Snackbar
      setSnackbarMessage("division atualizado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao salvar division", error);

      // Show error Snackbar
      setSnackbarMessage("Erro ao atualizar division. Tente novamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    setEditedProduct({ ...selectedProduct }); // Restaura os valores originais
  };

  if (loading) return <p>Carregando division...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const listaDeObras = [
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
      <MDBox p={4}>
        <Autocomplete
          value={selectedProduct}
          onChange={handleSelectChange}
          options={products}
          getOptionLabel={(option) =>
            `${option.id} - ${option.divisionNumber} - ${option.divisionName}`
          }
          renderInput={(params) => (
            <TextField {...params} label="Pesquisar division" variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disableClearable
          fullWidth
        />

        {selectedProduct && (
          <MDBox mt={2}>
            <TextField
              label="Nome da divisão"
              variant="outlined"
              fullWidth
              value={editedProduct.divisionName || ""}
              name="divisionName"
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              label="Número da divisão"
              variant="outlined"
              fullWidth
              value={editedProduct.divisionNumber || ""}
              name="divisionNumber"
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              select
              label="Status"
              variant="outlined"
              fullWidth
              value={editedProduct.status || ""}
              name="status"
              onChange={handleInputChange}
              margin="normal"
              SelectProps={{ sx: { height: "44px" } }}
            >
              <MenuItem value="Habilitada">Habilitada</MenuItem>
              <MenuItem value="Desabilitada">Desabilitada</MenuItem>
            </TextField>
            <Autocomplete
              options={listaDeObras}
              value={listaDeObras.find((obra) => obra.value === editedProduct.destiwork) || null}
              onChange={(event, newValue) =>
                setEditedProduct((prev) => ({ ...prev, destiwork: newValue?.value || "" }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Obra Vinculada"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
              )}
            />
            <MDBox mt={2}>
              <Button variant="gradient" color="dark" startIcon={<SaveIcon />} onClick={handleSave}>
                Salvar
              </Button>
              <Button
                variant="gradient"
                color="dark"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ marginLeft: 2 }}
              >
                Cancelar
              </Button>
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

export default ListProducts;
