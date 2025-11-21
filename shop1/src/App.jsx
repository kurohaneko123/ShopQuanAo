// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./View/Header.jsx";
import Banner from "./View/Banner.jsx";
import Footer from "./View/Footer.jsx";
import DailyProducts from "./View/Homepage.jsx";
import TatCaSanPham from "./View/Sanpham.jsx";
import LienHe from "./View/Lienhe.jsx";
import CheckoutPage from "./Chucnang/Thanhtoan.jsx";
import AoLopKyYeuPage from "./View/AoLop.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ClassBanner from "./View/ClassBanner.jsx";
import ChiTietSanPham from "./View/Chitietsp.jsx";
//User
import ThongTinKhachHang from "./Chucnang/Thongtinkh.jsx";
//Admin
import AdminLayout from "./Admin/Admin.jsx";
import ProductManagement from "./Admin/Sanpham/Quanlysp.jsx";
import OrderManagement from "./Admin/Donhang/Quanlydh.jsx";
import UserManagement from "./Admin/Users/Quanlyngdung.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
import Voucher from "./Admin/Voucher/Quanlyvoucher.jsx";
import ChiTietSanPhamAdmin from "./Admin/Sanpham/Quanlychitietsp.jsx";
export default function App() {
  const location = useLocation();

  // Ẩn Navbar và Footer khi ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* ====== TRANG NGƯỜI DÙNG ====== */}
        <Route path="/thongtincanhan" element={<ThongTinKhachHang />} />
        <Route
          path="/"
          element={
            <>
              <Banner />
              <DailyProducts />
              <ClassBanner />
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
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/aolop-kyyeu" element={<AoLopKyYeuPage />} />

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
          <Route path="voucher" element={<Voucher />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}
