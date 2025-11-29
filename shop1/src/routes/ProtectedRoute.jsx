import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isAdmin = payload.vaitro === "admin";

    console.log(
      "ProtectedRoute chạy, payload =",
      payload,
      "isAdmin =",
      isAdmin
    );

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  return children;
}
