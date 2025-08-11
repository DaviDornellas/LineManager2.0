import React from "react";
import * as XLSX from "xlsx";
import { DataGrid, Toolbar, ExportCsv, ExportPrint, ToolbarButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Mapeia os campos para cabeçalhos legíveis
const columnMapping = {
  id: "ID",
  responsible: "Responsável",
  artwork: "Origem",
  destiwork: "Destino",
  phoneNumber: "Telefone",
  operator: "Operadora",
  date: "Data",
  category: "Categoria",
};

const ExportExcel = ({ data, fileNamePrefix = "produtos" }) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Gera uma nova lista de objetos com campos e cabeçalhos personalizados
    const formattedData = data.map((item) => {
      const newItem = {};
      Object.keys(columnMapping).forEach((key) => {
        newItem[columnMapping[key]] = item[key];
      });
      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

    // Data atual para o nome do arquivo
    const now = new Date();
    const timestamp = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const fileName = `${fileNamePrefix}_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <IconButton size="small" disableRipple color="inherit" onClick={handleExport}>
      <Icon>download</Icon>
    </IconButton>
  );
};
ExportExcel.propTypes = {
  data: PropTypes.array.isRequired,
  fileNamePrefix: PropTypes.string,
};

export default ExportExcel;
