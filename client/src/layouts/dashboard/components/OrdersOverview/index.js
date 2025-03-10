// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { useState, useEffect } from "react";

function OrdersOverview() {
  // Estado para armazenar o histórico de linhas
  const [lineHistory, setLineHistory] = useState([
    {
      color: "success",
      icon: "arrow_upward",
      title: "Linha Adicionada #001",
      dateTime: "22 FEB 7:20 PM",
    },
    {
      color: "success",
      icon: "arrow_upward",
      title: "Linha Adicionada #002",
      dateTime: "21 FEB 9:15 AM",
    },
    {
      color: "success",
      icon: "arrow_upward",
      title: "Linha Adicionada #003",
      dateTime: "20 FEB 11:45 AM",
    },
    // Adicione mais itens conforme necessário
  ]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          histórico de Linhas
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            Esse mês
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {/* Renderizando dinamicamente os itens do histórico de linhas */}
        {lineHistory.map((line, index) => (
          <TimelineItem
            key={index}
            color={line.color}
            icon={line.icon}
            title={line.title}
            dateTime={line.dateTime}
            lastItem={index === lineHistory.length - 1} // Marcar o último item
          />
        ))}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
