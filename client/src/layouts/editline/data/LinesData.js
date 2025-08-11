import React, { useState, useEffect } from "react";
import { TextField, Button, Autocomplete, Snackbar, Alert, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import api from "../../../service/index";
import { api2 } from "../../../service/indexdivision";
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import InputMask from "react-input-mask";

const ListProducts = () => {
  const [listaDeObras, setListaDeObras] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, obrasResponse] = await Promise.all([
          api.get("/produtos"),
          api2.get("/division"),
        ]);

        setProducts(productsResponse.data);

        // Transformar as obras para formato compatível com o Autocomplete
        const obrasFormatadas = obrasResponse.data.map((div) => ({
          label: `${div.divisionNumber} - ${div.divisionName}`,
          value: `${div.divisionNumber}`, // ou o identificador se preferir
        }));
        setListaDeObras(obrasFormatadas);
      } catch (err) {
        setError("Erro ao buscar produtos ou obras");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (event, value) => {
    setSelectedProduct(value);
    setEditedProduct({ ...value }); // Cria uma cópia do produto selecionado
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
      const payload = {
        ...editedProduct,
        artwork: editedProduct.artwork || "",
        destiwork: editedProduct.destiwork || "",
      };

      await api.put(`/produtos/${editedProduct.id}`, payload);

      const updatedProducts = products.map((product) =>
        product.id === editedProduct.id ? payload : product
      );
      setProducts(updatedProducts);
      setSelectedProduct(payload);

      setSnackbarMessage("Produto atualizado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao salvar produto", error);
      setSnackbarMessage("Erro ao atualizar produto. Tente novamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4") // Formata para (XX) XXXXX-XXXX
      .slice(0, 16); // Limita o tamanho
  };

  const handleCancel = () => {
    setEditedProduct({ ...selectedProduct }); // Restaura os valores originais
  };

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <MDBox p={4}>
        <Autocomplete
          value={selectedProduct}
          onChange={handleSelectChange}
          options={products}
          getOptionLabel={(option) => `${option.id} - ${formatPhoneNumber(option.phoneNumber)}`}
          renderInput={(params) => (
            <TextField {...params} label="Pesquisar Produto" variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disableClearable
          fullWidth
        />

        {selectedProduct && (
          <MDBox mt={2}>
            <TextField
              label="Responsável"
              variant="outlined"
              fullWidth
              value={editedProduct.responsible || ""}
              name="responsible"
              onChange={handleInputChange}
              margin="normal"
            />
            <Autocomplete
              options={listaDeObras}
              value={listaDeObras.find((obra) => obra.value === editedProduct.artwork) || null}
              onChange={(event, newValue) =>
                setEditedProduct((prev) => ({ ...prev, artwork: newValue?.value || "" }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Obra de Origem"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
              )}
            />

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

            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              value={formatPhoneNumber(editedProduct.phoneNumber)} // Apenas visualmente formatado
              name="phoneNumber"
              onChange={handleInputChange} // Mantém o valor original sem formatação no estado
              margin="normal"
            />
            <TextField
              label="ICCID"
              variant="outlined"
              fullWidth
              value={editedProduct.iccid || ""}
              name="iccid"
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              select
              label="Operadora"
              variant="outlined"
              fullWidth
              value={editedProduct.operator || ""}
              name="operator"
              onChange={handleInputChange}
              margin="normal"
              SelectProps={{ sx: { height: "44px" } }}
            >
              <MenuItem value="VIVO">VIVO</MenuItem>
              <MenuItem value="TIM">TIM</MenuItem>
              <MenuItem value="CLARO">CLARO</MenuItem>
            </TextField>
            <TextField
              label="Data"
              variant="outlined"
              fullWidth
              value={editedProduct.date || ""}
              name="date"
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              select
              label="Categoria"
              variant="outlined"
              fullWidth
              value={editedProduct.category || ""}
              name="category"
              onChange={handleInputChange}
              margin="normal"
              SelectProps={{ sx: { height: "44px" } }}
            >
              <MenuItem value="Habilitada">Habilitada</MenuItem>
              <MenuItem value="Desabilitada">Desabilitada</MenuItem>
            </TextField>

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
