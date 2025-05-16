import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { apiCompor90 } from "../../../../service/apiGAATI";
import { TextField, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AddProduct from "../components/AddLine/index"; // Import the AddProduct form
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";

const ListProducts = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchBase, setSearchBase] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCompor90.get("/");
        setRows(response.data);
      } catch (err) {
        setError("Erro ao buscar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredRows = rows.filter((row) => {
      return (
        row.NOME.toLowerCase().includes(searchName.toLowerCase()) &&
        row.BASE.toLowerCase().includes(searchBase.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [searchName, searchPhone, products]);

  const handleAddClick = () => {
    setShowAddProductForm(true); // Show the AddProduct form when "Add" is clicked
  };

  const handleProductAdd = (newProduct) => {
    setProducts([newProduct, ...products]); // Add new product to the list
    setShowAddProductForm(false); // Hide the form after adding
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRowId(id);
  };

  const handleSaveClick = (id) => async () => {
    const updatedProduct = products.find((product) => product.id === id);
    try {
      await api.put(`/produtos/${id}`, updatedProduct);
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
      await api.delete(`/produtos/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto", error);
    }
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
      width: 90,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`} // Adiciona a key aqui
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "#009B77",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`} // Adiciona a key aqui
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key={`edit-${id}`} // Adiciona a key aqui
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            disabled={editingRowId !== null}
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
      <MDBox p={4}>
        <TextField
          label="Filtrar por Responsável"
          variant="outlined"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Filtrar por Telefone"
          variant="outlined"
          size="small"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
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
            height: "400px", // Ajuste a altura do grid
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
    </Card>
  );
};

export default ListProducts;
