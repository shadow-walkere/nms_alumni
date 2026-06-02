import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  console.log("adminToken:", token); // Check if token is retrieved

  if (!token) {
    console.log("Redirecting to admin login");
    return <Navigate to="/admin" />;
  }

  console.log("Access granted");
  return children;
};

export default ProtectedRoute;
