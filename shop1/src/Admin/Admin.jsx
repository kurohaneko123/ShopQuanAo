import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Users, Package, DollarSign, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/"); // chưa đăng nhập thì quay về trang chủ
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-2xl font-bold text-center py-6 border-b text-cyan-600">
            ADMIN PANEL
          </div>

          {/* Menu */}
          <nav className="mt-6 space-y-2 px-4">
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition"
            >
              <BarChart2 size={18} /> Dashboard
            </a>
            <a
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition"
            >
              <Package size={18} /> Sản phẩm
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition"
            >
              <Users size={18} /> Người dùng
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition"
            >
              <DollarSign size={18} /> Đơn hàng
            </a>
          </nav>
        </div>

        {/* Đăng xuất */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Dashboard Tổng Quan
          </h1>
          <div className="text-sm text-gray-600">
            Xin chào, <span className="font-semibold text-cyan-700">Admin</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Sản phẩm", value: "120", icon: <Package /> },
            { title: "Đơn hàng", value: "56", icon: <DollarSign /> },
            { title: "Người dùng", value: "340", icon: <Users /> },
            { title: "Doanh thu (triệu)", value: "82", icon: <BarChart2 /> },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-md transition"
            >
              <div className="p-3 rounded-lg bg-cyan-100 text-cyan-700">
                {kpi.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <h3 className="text-2xl font-bold">{kpi.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Biểu đồ mô phỏng */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Doanh thu tháng này
          </h2>
          <div className="h-64 bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 rounded-lg flex items-end gap-1 p-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-400 rounded-t-lg"
                  style={{ height: `${30 + Math.random() * 70}%` }}
                ></div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
