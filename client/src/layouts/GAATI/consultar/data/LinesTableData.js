import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import api from "../../../service/index";
import { TextField, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddProduct from "../components/Projects/index"; // Import the AddProduct form
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
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
  const [editingRowId, setEditingRowId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State for showing the form
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/produtos");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError("Erro ao buscar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      return (
        product.responsible.toLowerCase().includes(searchName.toLowerCase()) &&
        product.phoneNumber.includes(searchPhone)
      );
    });
    setFilteredProducts(filtered);
  }, [searchName, searchPhone, products]);

  const handleViewClick = (product) => () => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

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
  ];

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <MDBox p={4}>
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
          sx={{ marginLeft: 2 }} // Adiciona o espaço à esquerda
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
