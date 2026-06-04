import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    toast("You must be logged in to view that page", { icon: "🔒" });
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default AdminRoute;