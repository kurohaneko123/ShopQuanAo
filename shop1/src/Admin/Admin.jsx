import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  LayoutGrid,
  TicketPercent,
  Users,
  ReceiptText,
  LogOut,
  Menu,
} from "lucide-react";

import Swal from "sweetalert2";
import axios from "axios";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(null);
  useEffect(() => {
    const checkNewOrder = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donhang/count");
        const currentTotal = res.data.total;

        if (lastOrderCount !== null && currentTotal > lastOrderCount) {
          Swal.fire({
            title: "Bạn có đơn hàng mới!",
            text: "Khách hàng vừa đặt một đơn mới",
            icon: "success",
            toast: true,
            position: "top-end",
            timer: 4000,
            showConfirmButton: false,
          });
        }

        setLastOrderCount(currentTotal);
      } catch (err) {
        console.error("Check order error:", err);
      }
    };

    checkNewOrder(); // chạy lần đầu
    const interval = setInterval(checkNewOrder, 5000); // 5 giây

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  // Kiểm tra đăng nhập (GIỮ NGUYÊN LOGIC)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (!user || user.vaitro !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-gray-200 relative">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
    fixed top-0 left-0 z-40
    w-64 h-screen
    bg-[#111111] border-r border-white/10
    shadow-[0_0_15px_rgba(0,0,0,0.5)]
    flex flex-col
    transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
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
            onClick={() => setOpen(false)}
          >
            <BarChart3 size={18} />
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
              onClick={() => setOpen(false)}
            >
              <Boxes size={18} /> Sản phẩm
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
              onClick={() => setOpen(false)}
            >
              <LayoutGrid size={18} /> Danh mục
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
              onClick={() => setOpen(false)}
            >
              <TicketPercent size={18} /> Khuyến mãi
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
              onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
            >
              <ReceiptText size={18} /> Đơn hàng
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center font-bold gap-2 py-3 rounded-xl
bg-gradient-to-r from-red-600/90 to-rose-600/90
hover:from-red-500 hover:to-rose-500 transition shadow-lg"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#0f0f0f] md:ml-64">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50
             p-2 rounded-lg bg-white/10 text-white"
        >
          <Menu size={22} />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
