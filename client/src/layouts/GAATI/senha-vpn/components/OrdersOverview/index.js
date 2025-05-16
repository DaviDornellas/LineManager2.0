// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { useState, useEffect } from "react";
import api from "../../../../service/index"; // Importando API

function OrdersOverview() {
  // Estado para armazenar o histórico de linhas e contagem
  const [lineHistory, setLineHistory] = useState([]);
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Função para pegar os dados da API
  const fetchLineHistory = async () => {
    try {
      const response = await api.get("/produtos"); // Altere a URL para a da sua API
      const produtos = response.data;

      // Mapear os dados da API para o formato necessário
      const mappedHistory = produtos.map((produto) => ({
        color: "success", // ou outro valor dependendo da lógica
        icon: "arrow_upward", // ou outro valor dependendo da lógica
        title: `Linha Adicionada #${produto.id}`, // Adicionando o id do produto
        dateTime: new Date(produto.createdAt).toLocaleString(), // Convertendo a data para um formato legível
        createdAt: new Date(produto.createdAt), // Armazenando o objeto Date para facilitar a ordenação
      }));

      // Ordenar os dados pela data de criação, do mais recente para o mais antigo
      const sortedHistory = mappedHistory.sort((a, b) => b.createdAt - a.createdAt);

      // Atualizar o estado com o histórico de linhas ordenado
      setLineHistory(sortedHistory);

      // Limitar a exibição a no máximo 5 itens
      const limitedHistory = sortedHistory.slice(0, 5);

      // Atualizar o estado com o histórico de linhas ordenado e limitado
      setLineHistory(limitedHistory);

      // Contagem total e contagem do mês atual
      const total = produtos.length;
      setTotalCount(total);

      // Contagem do mês atual
      const currentMonth = new Date().getMonth(); // 0 = Janeiro, 1 = Fevereiro, ...
      const currentMonthLines = produtos.filter(
        (produto) => new Date(produto.createdAt).getMonth() === currentMonth
      );
      setCurrentMonthCount(currentMonthLines.length);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  // Usar o useEffect para pegar os dados da API ao montar o componente
  useEffect(() => {
    fetchLineHistory();
  }, []); // A dependência vazia significa que isso vai rodar apenas uma vez, quando o componente for montado

  // Calcular a porcentagem
  const percentage = totalCount > 0 ? ((currentMonthCount / totalCount) * 100).toFixed(2) : 0;

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Histórico de Linhas
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              {percentage}% {/* Exibindo a porcentagem calculada */}
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
