// App.jsx

import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./View/Header.jsx";
import Banner from "./View/Banner.jsx";
import Footer from "./View/Footer.jsx";
import DailyProducts from "./View/Homepage.jsx";
import TatCaSanPham from "./View/Sanpham.jsx";
import LienHe from "./View/Lienhe.jsx";
import CheckoutPage from "./Chucnang/Thanhtoan.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ChiTietSanPham from "./View/Chitietsp.jsx";
//User
import ThongTinKhachHang from "./Chucnang/Thongtinkh.jsx";
import DonHang from "./Chucnang/DonHang.jsx";
import ZaloPayPage from "./Chucnang/Zalopay.jsx";
import OrderSuccess from "./View/OrderSuccess.jsx";
//Admin
import AdminLayout from "./Admin/Admin.jsx";
import ProductManagement from "./Admin/Sanpham/index.jsx";
import OrderManagement from "./Admin/Donhang/Quanlydh.jsx";
import UserManagement from "./Admin/Users/Quanlyngdung.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
import Voucher from "./Admin/Voucher/index.jsx";
import ChiTietSanPhamAdmin from "./Admin/Sanpham/Quanlychitietsp.jsx";
import Danhmuc from "./Admin/Danhmuc/index.jsx";
export default function App() {
  function RequireAuth({ children }) {
    const token = localStorage.getItem("token");

    //  chưa đăng nhập → đá về trang chủ (hoặc /login)
    if (!token) {
      return <Navigate to="/" replace />;
    }

    // đã đăng nhập → cho vào
    return children;
  }

  const location = useLocation();

  // Ẩn Navbar và Footer khi ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ====== TRANG NGƯỜI DÙNG ====== */}
        <Route
          path="/thongtincanhan"
          element={
            <RequireAuth>
              <ThongTinKhachHang />
            </RequireAuth>
          }
        />
        <Route
          path="/donhang"
          element={
            <RequireAuth>
              <DonHang />
            </RequireAuth>
          }
        />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route
          path="/"
          element={
            <>
              <Banner />
              <DailyProducts />
            </>
          }
        />

        {/* ====== TRANG Sản Phẩm  ====== */}
        <Route path="/all" element={<TatCaSanPham />} />
        <Route path="/all/:gender/:category" element={<TatCaSanPham />} />
        <Route path="/all/:category" element={<TatCaSanPham />} />
        <Route path="/all/:gender" element={<TatCaSanPham />} />
        <Route path="/product/:id" element={<ChiTietSanPham />} />
        <Route path="/lienhe" element={<LienHe />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route path="/zalopay" element={<ZaloPayPage />} />

        {/* ====== TRANG ADMIN ====== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id" element={<ChiTietSanPhamAdmin />} />
          <Route path="categories" element={<Danhmuc />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}
