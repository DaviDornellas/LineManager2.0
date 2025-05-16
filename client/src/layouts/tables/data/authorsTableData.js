/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

export default function DataTableUsuarios() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const users = response.data;

        const formattedRows = users.map((user) => ({
          author: <Author name={user.username} email={user.email} />,
          function: <Job title={user.position} />,
          area: <Job title={user.location} />,
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={user.active ? "ativo" : "inativo"}
                color={user.active ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          employed: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </MDTypography>
          ),
          action: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              Editar
            </MDTypography>
          ),
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Usuário", accessor: "author", width: "45%", align: "left" },
      { Header: "Função", accessor: "function", align: "left" },
      { Header: "Area", accessor: "area", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Cadastro", accessor: "employed", align: "center" },
      { Header: "Ações", accessor: "action", align: "center" },
    ],
    rows,
  };
}
