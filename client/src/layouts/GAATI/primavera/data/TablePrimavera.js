import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { TextField, Typography, Card } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import { apiPrimavera } from "../../../../service/apiGAATI";
import MDBox from "../../../../components/MDBox";

const TableCompor90 = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchBase, setSearchBase] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await apiPrimavera.get("/primavera");
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
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Salvar"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancelar"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Editar"
            onClick={handleEditClick(id)}
          />,
        ];
      },
    },
    { field: "CODE", headerName: "Código", width: 100, editable: false },
    { field: "NOME", headerName: "Nome", flex: 1, editable: true },
    { field: "USUARIO", headerName: "Usuario", flex: 1, editable: true },
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
    </Card>
  );
};

export default TableCompor90;
