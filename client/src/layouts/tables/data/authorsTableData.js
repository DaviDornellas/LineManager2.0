/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput"; // input do MD2

export default function DataTableUsuarios() {
  const [rows, setRows] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        setAllUsers(users); // guarda todos os usuários
        formatAndSetRows(users);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const formatAndSetRows = (users) => {
    const formattedRows = users.map((user) => ({
      author: <Author name={user.username} email={user.email} />,
      function: <Job title={user.position} />,
      area: <Job title={user.location} />,
      roles: <Job title={user.role} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={user.isLoggedIn ? "Online" : "Offline"}
            color={user.isLoggedIn ? "info" : "secondary"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      employed: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.last_login
            ? new Date(user.last_login.replace(" ", "T")).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Nunca"}
        </MDTypography>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Editar
        </MDTypography>
      ),
    }));

    setRows(formattedRows);
  };

  useEffect(() => {
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    formatAndSetRows(filtered);
  }, [searchTerm]);

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
      { Header: "Grupo", accessor: "roles", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Cadastro", accessor: "employed", align: "center" },
      { Header: "Ações", accessor: "action", align: "center" },
    ],
    rows,
    searchInput: (
      <MDBox mb={2}>
        <MDInput
          label="Buscar por nome"
          variant="standard"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </MDBox>
    ),
  };
}
