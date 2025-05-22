import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { apiCompor90 } from "../../../../service/apiGAATI";
import { TextField, Typography, Button, Card } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddProduct from "../components/Add90Compor/index"; // Import the AddProduct form
import MDBox from "../../../../components/MDBox";

const ListProducts = () => {
  const [rows, setRows] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchBase, setSearchBase] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCompor90.get("/compor90");
        setRows(response.data);
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
    const filtered = rows.filter((row) => {
      return (
        row.NOME?.toLowerCase().includes(searchName.toLowerCase()) &&
        row.BASE?.toLowerCase().includes(searchBase.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [searchName, searchBase, rows]);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRowId(id);
  };

  const handleSaveClick = (id) => async () => {
    const updatedProduct = rows.find((product) => product.id === id);
    try {
      await apiCompor90.put(`/${id}`, updatedProduct);
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      setEditingRowId(null);
    } catch (error) {
      console.error("Erro ao salvar produto", error);
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
      setRows(rows.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto", error);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 90,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "#009B77" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            disabled={editingRowId !== null}
          />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: "id", headerName: "ID", flex: 0.5, editable: false },
    { field: "responsible", headerName: "Responsável", width: 220, editable: true },
    { field: "artwork", headerName: "Origem", flex: 1, editable: true },
    { field: "destiwork", headerName: "Destino", flex: 1, editable: true },
    { field: "phoneNumber", headerName: "Linha", width: 120, editable: true },
    { field: "operator", headerName: "Operadora", flex: 1, editable: true },
    { field: "date", headerName: "Data", flex: 1, editable: true },
    { field: "category", headerName: "Categoria", flex: 1, editable: true },
  ];

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <MDBox p={4} display="flex" gap={2}>
        <TextField
          label="Filtrar por Responsável"
          variant="outlined"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Filtrar por Base"
          variant="outlined"
          size="small"
          value={searchBase}
          onChange={(e) => setSearchBase(e.target.value)}
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
          isCellEditable={(params) => editingRowId === null || editingRowId === params.id}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: "400px",
            width: "94%",
            margin: "0 auto",
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
    </Card>
  );
};

export default ListProducts;
