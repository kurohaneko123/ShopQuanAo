import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Admin/Admin.jsx";
import ProductManagement from "../Admin/Sanpham/Quanlysp.jsx";
import OrderManagement from "../Admin/Donhang/Quanlydh.jsx";
import UserManagement from "../Admin/Users/Quanlyngdung.jsx";
import Dashboard from "../Admin/Dashboard/Dashboard.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Route cha */}
      <Route path="/" element={<AdminLayout />}>
        {/* Khi chỉ ở /admin thì hiện rỗng hoặc gợi ý */}
        <Route index element={<Dashboard />} />

        {/* Khi click menu */}
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}
