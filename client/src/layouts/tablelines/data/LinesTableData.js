import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import api from "../../../service/index";
import { api2 } from "../../../service/indexdivision";
import { TextField, Typography, Button, Autocomplete } from "@mui/material";
import AddProduct from "../components/Projects/index"; // Import the AddProduct form
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import MDToolbar from "../../../components/MDToolbar/index";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchObra, setSearchObra] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [listaDeObras, setListaDeObras] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchName = product.responsible.toLowerCase().includes(searchName.toLowerCase());
      const matchPhone = product.phoneNumber.includes(searchPhone);
      const matchObra =
        !searchObra || product.destiwork === searchObra || product.artwork === searchObra;
      return matchName && matchPhone && matchObra;
    });
    setFilteredProducts(filtered);
  }, [searchName, searchPhone, searchObra, products]);

  const handleViewClick = (product) => () => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const getObraLabel = (value) => {
    const found = listaDeObras.find((obra) => obra.value === value);
    return found ? found.label : value;
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4") // Formata para (XX) XXXXX-XXXX
      .slice(0, 16); // Limita o tamanho
  };
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setProducts(products.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const product = filteredProducts.find((p) => p.id === id);
        return [
          <GridActionsCellItem
            key={`view-${id}`}
            icon={<VisibilityIcon />}
            label="Visualizar"
            onClick={handleViewClick(product)}
            showInMenu={false}
          />,
        ];
      },
    },
    { field: "id", headerName: "ID", width: 50, editable: false },
    { field: "responsible", headerName: "Responsável", minWidth: 220, editable: false },
    { field: "artwork", headerName: "Origem", minWidth: 110, editable: false },
    { field: "destiwork", headerName: "Destino", minWidth: 110, editable: false },
    { field: "phoneNumber", headerName: "Telefone", minWidth: 140, editable: false },
    { field: "operator", headerName: "Operadora", minWidth: 120, editable: false },
    { field: "date", headerName: "Data", minWidth: 120, editable: false },
    { field: "category", headerName: "Categoria", minWidth: 150, editable: false },
    { field: "iccid", headerName: "ICCID", minWidth: 150, editable: false },
  ];

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <MDBox p={4} display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <TextField
          label="Filtrar por Responsável"
          variant="outlined"
          size="medium"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Filtrar por Telefone"
          variant="outlined"
          size="medium"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <Autocomplete
          options={listaDeObras}
          getOptionLabel={(option) => option.label}
          onChange={(event, newValue) => {
            setSearchObra(newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField {...params} size="medium" label="Filtrar por Obra" variant="outlined" />
          )}
          sx={{ width: 300 }} // opcional: ajuste de layout
        />
      </MDBox>

      <MDBox>
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          editMode="row"
          disableSelectionOnClick
          isCellEditable={(params) => {
            return editingRowId === null || editingRowId === params.id;
          }}
          slots={{
            toolbar: () => <MDToolbar data={filteredProducts} />,
          }}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: "100%", // Ajuste a altura do grid
            width: "94%", // Ajuste a largura do grid (reduzido para 90% da tela)
            margin: "0 auto", // Centraliza o grid
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
              fontSize: "14px", // Altera o tamanho da fonte das células
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ccc",
              fontSize: "14px", // Altera o tamanho da fonte das células
            },
          }}
        />
      </MDBox>
      <MDBox>.</MDBox>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Detalhes do Produto
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <DialogContentText component="div">
              <strong>ID:</strong> {selectedProduct.id} <br />
              <strong>Responsável:</strong> {selectedProduct.responsible} <br />
              <strong>Origem:</strong> {getObraLabel(selectedProduct.artwork)} <br />
              <strong>Destino:</strong> {getObraLabel(selectedProduct.destiwork)} <br />
              <strong>Telefone:</strong> {formatPhoneNumber(selectedProduct.phoneNumber)} <br />
              <strong>Operadora:</strong> {selectedProduct.operator} <br />
              <strong>Data:</strong> {selectedProduct.date} <br />
              <strong>Categoria:</strong> {selectedProduct.category} <br />
              <strong>ICCID:</strong> {selectedProduct.iccid} <br />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ListProducts;
