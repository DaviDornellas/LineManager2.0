import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Typography } from "@mui/material";
import api from "../../../../service/index";
import PropTypes from "prop-types";

const TransferHistoryTable = ({ productId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`produtos/historico/linha/${productId}`);
        setHistory(response.data);
      } catch (err) {
        setErro("Erro ao buscar histórico de transferências.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fromWork", headerName: "Obra de Origem", flex: 1 },
    { field: "toWork", headerName: "Obra de Destino", flex: 1 },
    {
      field: "transferDate",
      headerName: "Data da Transferência",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString("pt-BR");
      },
    },
  ];

  if (loading) return <CircularProgress />;
  if (erro) return <Typography color="error">{erro}</Typography>;

  return (
    <div style={{ height: 300, width: "100%", marginTop: 20 }}>
      <Typography variant="h6" gutterBottom>
        Histórico de Transferência
      </Typography>
      <DataGrid rows={history} columns={columns} pageSize={5} disableSelectionOnClick />
    </div>
  );
};

// validação dos props
TransferHistoryTable.propTypes = {
  productId: PropTypes.number.isRequired, // ou string, se for string
};

export default TransferHistoryTable;
