import React, { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { BarChart2, Users, Package, DollarSign, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.vaitro !== "admin") {
      navigate("/"); // chưa đăng nhập thì quay về trang chủ
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold text-center py-6 border-b text-cyan-600">
            ADMIN PANEL
          </div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-cyan-100 text-cyan-700"
                  : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
              }`
            }
          >
            <BarChart2 size={18} /> Dashboard
          </NavLink>

          {/* MENU */}
          <nav className="mt-6 space-y-2 px-4">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
                }`
              }
            >
              <Package size={18} /> Sản phẩm
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
                }`
              }
            >
              <Package size={18} /> Danh mục
            </NavLink>

            <NavLink
              to="/admin/voucher"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
                }`
              }
            >
              <Package size={18} /> Khuyến mãi
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
                }`
              }
            >
              <Users size={18} /> Người dùng
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-cyan-100 hover:text-cyan-700"
                }`
              }
            >
              <DollarSign size={18} /> Đơn hàng
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-8">
        <Outlet /> {/* 👈 Chỉ hiển thị nội dung khi click menu */}
      </main>
    </div>
  );
}
