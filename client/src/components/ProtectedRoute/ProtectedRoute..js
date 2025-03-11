// src/components/ProtectedRoute.js
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom"; // Usando Navigate para redirecionamento

const ProtectedRoute = ({ children }) => {
  // Verificação de autenticação, por exemplo, verificando o token no localStorage
  const isAuthenticated = localStorage.getItem("token"); // Aqui, você pode usar o contexto ou outra lógica de autenticação.

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/authentication/sign-in" />;
  }

  // Se estiver autenticado, renderiza o componente
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Agora estamos usando 'children' no lugar de 'component'
};

export default ProtectedRoute;
