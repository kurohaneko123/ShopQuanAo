import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./View/Header.jsx";
import Banner from "./View/Banner.jsx";
import Footer from "./View/Footer.jsx";
import DailyProducts from "./View/Homepage.jsx";
import TatCaSanPham from "./View/Sanpham.jsx";
import LienHe from "./View/Lienhe.jsx";
import CheckoutPage from "./Chucnang/Thanhtoan.jsx";
import AoLopKyYeuPage from "./View/AoLop.jsx";
import AdminLayout from "./Admin/Admin.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ClassBanner from "./View/ClassBanner.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
export default function App() {
  const location = useLocation();

  // Ẩn Navbar và Footer khi đang ở trang Admin
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
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

        {/* Trang Admin có bảo vệ */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        {/* Trang tất cả sản phẩm (dạng /all) */}
        <Route path="/all" element={<TatCaSanPham />} />
        {/* Trang tất cả sản phẩm (có lọc theo giới tính và loại) */}
        <Route path="/all/:gender/:category" element={<TatCaSanPham />} />

        {/* Trường hợp chỉ có category */}
        <Route path="/all/:category" element={<TatCaSanPham />} />

        {/* Trường hợp chỉ có giới tính (Nam/Nữ) */}
        <Route path="/all/:gender" element={<TatCaSanPham />} />

        {/*  Trang Liên hệ  */}
        <Route path="/lienhe" element={<LienHe />} />
        {/*  Trang kiểm tra  */}
        <Route path="/checkout" element={<CheckoutPage />} />
        {/*  Trang Thiết kế áo lớp  */}
        <Route path="/aolop-kyyeu" element={<AoLopKyYeuPage />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}
