// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userData = localStorage.getItem("user");
  let user = null;

  try {
    user = JSON.parse(userData);
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    alert("Bạn cần đăng nhập quyền admin để truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute chạy, user =", user, "isAdmin =", isAdmin);
  return children;
}
