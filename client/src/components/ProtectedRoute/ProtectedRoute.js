import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem("role");

  if (!roles.includes(userRole)) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
