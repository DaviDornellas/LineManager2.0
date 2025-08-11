import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { TextField, Typography, Button, Card } from "@mui/material";
import MDBox from "../../../../components/MDBox";

import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//API PRIMAVERA
import { apiCompor90 } from "../../../../service/apiGAATI";

const TableCompor90 = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchBase, setSearchBase] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await apiCompor90.get("/compor90");
        setRows(response.data);
      } catch (err) {
        setError("Erro ao buscar dados do Compor90");
      }
    };

    fetchRows();
  }, []);

  const filteredRows = rows.filter(
    (row) =>
      row.NOME.toLowerCase().includes(searchName.toLowerCase()) &&
      row.BASE.toLowerCase().includes(searchBase.toLowerCase())
  );

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRowId(id);
  };

  const handleSaveClick = (id) => async () => {
    const updatedRow = rows.find((row) => row.CODE === id);
    try {
      await apiCompor90.put(`/${id}`, updatedRow);
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      setEditingRowId(null);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    setEditingRowId(null);
  };

  const handleDeleteClick = (id) => async () => {
    try {
      await apiCompor90.delete(`/${id}`);
      setRows(rows.filter((row) => row.CODE !== id));
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
    }
  };

  const handleViewClick = (product) => () => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.CODE === newRow.CODE ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            key={`view-${row.CODE}`}
            icon={<VisibilityIcon />}
            label="Visualizar"
            onClick={handleViewClick(row)}
            showInMenu={false}
          />,
        ];
      },
    },
    { field: "CODE", headerName: "Código", width: 100, editable: false },
    { field: "NOME", headerName: "Nome", flex: 1, editable: true },
    { field: "SENHA", headerName: "Senha", flex: 1, editable: true },
    { field: "BASE", headerName: "Base", flex: 1, editable: true },
  ];

  return (
    <Card>
      <MDBox p={2}>
        <Typography variant="h6">Lista de Compor90</Typography>
        <MDBox display="flex" gap={2} my={2}>
          <TextField
            label="Filtrar por Nome"
            size="small"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <TextField
            label="Filtrar por Base"
            size="small"
            value={searchBase}
            onChange={(e) => setSearchBase(e.target.value)}
          />
        </MDBox>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.CODE}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            height: 400,
            "& .MuiDataGrid-cell": { fontSize: 14 },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f0f0f0" },
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
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
              <strong>Id:</strong> {selectedProduct.CODE} <br />
              <strong>Nome:</strong> {selectedProduct.NOME} <br />
              <strong>Senha:</strong> {selectedProduct.SENHA} <br />
              <strong>Base:</strong> {selectedProduct.BASE} <br />
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

export default TableCompor90;
