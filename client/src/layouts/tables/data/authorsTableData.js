/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

export default function DataTableUsuarios() {
  const [rows, setRows] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleAdminLogout = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://192.168.7.65:5000/api/auth/logout/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = allUsers.map((user) =>
        user.id === userId ? { ...user, isLoggedIn: false } : user
      );
      setAllUsers(updatedUsers);
      formatAndSetRows(updatedUsers);

      window.location.reload();
    } catch (error) {
      console.error("Erro ao forçar logout:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://192.168.7.65:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const users = response.data;
        setAllUsers(users);
        formatAndSetRows(users);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenEdit = (user) => {
    setEditingUser({ ...user });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditingUser(null);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://192.168.7.65:5000/api/auth/users/${editingUser.id}`, editingUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUsers = allUsers.map((u) => (u.id === editingUser.id ? { ...editingUser } : u));
      setAllUsers(updatedUsers);
      formatAndSetRows(updatedUsers);
      handleCloseEdit();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

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
            color={user.isLoggedIn ? "success" : "secondary"}
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
        <IconButton onClick={() => handleOpenEdit(user)} title="Editar">
          <Icon>edit</Icon>
        </IconButton>
      ),
      logout: (
        <IconButton
          onClick={() => handleAdminLogout(user.id)}
          title="Forçar logout"
          disabled={!user.isLoggedIn}
        >
          <Icon color={user.isLoggedIn ? "error" : "disabled"}>logout</Icon>
        </IconButton>
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
      { Header: "Área", accessor: "area", align: "center" },
      { Header: "Grupo", accessor: "roles", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Cadastro", accessor: "employed", align: "center" },
      { Header: "Ações", accessor: "action", align: "center" },
      { Header: "Logout", accessor: "logout", align: "center" },
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
    modal: (
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <MDInput
            label="Nome"
            fullWidth
            margin="normal"
            value={editingUser?.username || ""}
            onChange={(e) => setEditingUser((prev) => ({ ...prev, username: e.target.value }))}
          />
          <MDInput
            label="Cargo"
            fullWidth
            margin="normal"
            value={editingUser?.position || ""}
            onChange={(e) => setEditingUser((prev) => ({ ...prev, position: e.target.value }))}
          />
          <MDInput
            label="Localização"
            fullWidth
            margin="normal"
            value={editingUser?.location || ""}
            onChange={(e) => setEditingUser((prev) => ({ ...prev, location: e.target.value }))}
          />
          <MDInput
            label="Email"
            fullWidth
            margin="normal"
            value={editingUser?.email || ""}
            onChange={(e) => setEditingUser((prev) => ({ ...prev, email: e.target.value }))}
          />
          <MDInput
            label="Função"
            fullWidth
            margin="normal"
            value={editingUser?.role || ""}
            onChange={(e) => setEditingUser((prev) => ({ ...prev, role: e.target.value }))}
          />
          <MDInput
            label="Nova senha (opcional)"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setEditingUser((prev) => ({ ...prev, password: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseEdit} color="error">
            Cancelar
          </MDButton>
          <MDButton onClick={handleSaveEdit} variant="contained" color="infog">
            Salvar
          </MDButton>
        </DialogActions>
      </Dialog>
    ),
  };
}
