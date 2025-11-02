// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isAdmin = user?.vaitro === "admin";
  console.log("ProtectedRoute chạy, user =", user, "isAdmin =", isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
