import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import api2 from "../../../service/indexdivision";
import { TextField, Button } from "@mui/material";
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

const ListDivision = () => {
  const [division, setDivision] = useState([]);
  const [filteredDivision, setFilteredDivision] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchDivisionName, setSearchDivisionName] = useState("");
  const [searchDivisionNumber, setSearchDivisionNumber] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDivision = async () => {
      try {
        const response = await api2.get("/division");
        setDivision(response.data);
        setFilteredDivision(response.data);
      } catch (err) {
        setError("Erro ao buscar divisões");
      } finally {
        setLoading(false);
      }
    };

    fetchDivision();
  }, []);

  useEffect(() => {
    const filtered = division.filter(
      (item) =>
        item.divisionName.toLowerCase().includes(searchDivisionName.toLowerCase()) &&
        item.divisionNumber.toLowerCase().includes(searchDivisionNumber.toLowerCase())
    );
    setFilteredDivision(filtered);
  }, [searchDivisionName, searchDivisionNumber, division]);

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setDivision(division.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
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
  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 80,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const product = filteredDivision.find((p) => p.id === id);
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
    { field: "id", headerName: "ID", flex: 0.2, editable: false },
    { field: "divisionNumber", headerName: "Numero da Obra ", flex: 0.8, editable: true },
    { field: "divisionName", headerName: "Nome da Divisão", flex: 1.9, editable: true },
    { field: "status", headerName: "Status", flex: 0.7, editable: true },
  ];

  if (loading) return <p>Carregando divisões...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <MDBox p={4} display="flex" gap={2}>
        <TextField
          label="Filtrar por Nome da Divisão"
          variant="outlined"
          size="small"
          value={searchDivisionName}
          onChange={(e) => setSearchDivisionName(e.target.value)}
        />
        <TextField
          label="Filtrar por Número da Divisão"
          variant="outlined"
          size="small"
          value={searchDivisionNumber}
          onChange={(e) => setSearchDivisionNumber(e.target.value)}
        />
      </MDBox>

      <MDBox>
        <DataGrid
          rows={filteredDivision}
          columns={columns}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          editMode="row"
          disableSelectionOnClick
          isCellEditable={(params) => editingRowId === null || editingRowId === params.id}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: "365px", // Ajuste a altura do grid
            width: "94%",
            margin: "0 auto",
            marginBottom: "15px",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
              fontSize: "14px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ccc",
              fontSize: "14px",
            },
          }}
        />
      </MDBox>
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
              <strong>Nome da Divisão:</strong> {selectedProduct.divisionName} <br />
              <strong>Centro de Custo:</strong> {selectedProduct.costCenter} <br />
              <strong>Empresa:</strong> {selectedProduct.responsibleCompany} <br />
              <strong>Status:</strong> {selectedProduct.status} <br />
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

export default ListDivision;
