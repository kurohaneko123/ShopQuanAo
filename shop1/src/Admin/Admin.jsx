import React, { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { BarChart2, Users, Package, DollarSign, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  // Kiểm tra đăng nhập (GIỮ NGUYÊN LOGIC)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (!user || user.vaitro !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("userino");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-gray-200">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-[#111111] border-r border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between">
        {/* LOGO / TITLE */}
        <div>
          <div className="text-2xl font-bold text-center py-6 border-b border-white/10 text-indigo-400 tracking-wide">
            ADMIN PANEL
          </div>

          {/* DASHBOARD */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 mt-4
              ${
                isActive
                  ? "bg-white/10 text-indigo-400 shadow-inner"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
            }
          >
            <BarChart2 size={18} />
            Dashboard
          </NavLink>

          {/* MENU */}
          <nav className="mt-4 space-y-2 px-3">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-white/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
              }
            >
              <Package size={18} /> Sản phẩm
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 
              ${
                isActive
                  ? "bg-white/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
              }
            >
              <Package size={18} /> Danh mục
            </NavLink>

            <NavLink
              to="/admin/voucher"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-white/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
              }
            >
              <Package size={18} /> Khuyến mãi
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-white/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
              }
            >
              <Users size={18} /> Người dùng
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-white/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-indigo-300"
              }`
              }
            >
              <DollarSign size={18} /> Đơn hàng
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-600/80 text-white font-semibold hover:bg-red-500 transition-all duration-200 shadow-lg"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-8 bg-[#0f0f0f]">
        <Outlet />
      </main>
    </div>
  );
}
