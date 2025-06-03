import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { TextField, Typography, Card } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import { apiCredencial } from "../../../../service/apiGAATI";
import MDBox from "../../../../components/MDBox";
import { Button } from "@mui/material";
import MDButton from "components/MDButton";

const Tablecredencial = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchOffice, setSearchOffice] = useState("");
  const [searchChamado, setSearchChamado] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await apiCredencial.get("/credencial");
        setRows(response.data);
      } catch (err) {
        setError("Erro ao buscar dados do credencial");
      }
    };

    fetchRows();
  }, []);

  const filteredRows = rows.filter(
    (row) =>
      (row.Nome?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
      (row.Office?.toLowerCase() || "").includes(searchOffice.toLowerCase()) && // use Office no lugar de "Base"
      (row.Chamado?.toLowerCase() || "").includes(searchChamado.toLowerCase())
  );

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRowId(id);
  };

  const handleSaveClick = (id) => async () => {
    const updatedRow = rows.find((row) => row.Code === id);
    try {
      await apiCredencial.put(`/${id}`, updatedRow);
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
      await apiCredencial.delete(`/${id}`);
      setRows(rows.filter((row) => row.Code !== id));
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.Code === newRow.Code ? updatedRow : row)));
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
    { field: "Code", headerName: "Código", width: 100, editable: false },
    { field: "Nome", headerName: "Nome", flex: 1, editable: true },
    { field: "Usu_Rede", headerName: "Usuário", flex: 1, editable: true },
    { field: "Office", headerName: "Office", flex: 0.5, editable: true },
    { field: "Chamado", headerName: "Chamado", flex: 1, editable: true },
    {
      field: "link_glpi",
      headerName: "GLPI",
      flex: 0.5,
      editable: false,
      renderCell: (params) => {
        const chamado = params.row.Chamado;
        if (!chamado) return null;

        const url = `http://sgc.aterpa.com.br/glpi/front/ticket.form.php?id=${chamado}`;

        return (
          <MDButton
            variant="contained"
            color="infog"
            size="small"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Acessar
          </MDButton>
        );
      },
    },
  ];

  return (
    <Card>
      <MDBox p={2}>
        <Typography variant="h6">Lista de credencial</Typography>
        <MDBox display="flex" gap={2} my={2}>
          <TextField
            label="Filtrar por Nome"
            size="large"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <TextField
            label="Filtrar por Obra"
            size="large"
            value={searchOffice}
            onChange={(e) => setSearchOffice(e.target.value.toUpperCase())}
          />
          <TextField
            label="Filtrar por Chamado"
            size="large"
            value={searchChamado}
            onChange={(e) => setSearchChamado(e.target.value)}
          />
        </MDBox>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.Code}
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

export default Tablecredencial;
