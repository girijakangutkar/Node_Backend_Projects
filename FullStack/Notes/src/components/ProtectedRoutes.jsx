import React from "react";
import { Navigate } from "react-router";

const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
