"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  Loader2,
  ClipboardList,
  XCircle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DonHang() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5; // anh muốn 2-3-4 tuỳ, để 3 nhìn đẹp

  const BASE_URL = "http://localhost:5000/api/donhang";
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pagedOrders = orders.slice(start, start + pageSize);

  useEffect(() => {
    // nếu số trang giảm (vd huỷ đơn, lọc user) đảm bảo không văng
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line
  }, [orders.length]);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" }); // UX: đổi trang kéo lên
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setOrders([]);
          return;
        }

        const user = JSON.parse(storedUser);

        const res = await axios.get(BASE_URL);
        const allOrders = res.data.data || [];

        // ✅ LỌC ĐƠN HÀNG THEO USER ĐANG ĐĂNG NHẬP
        const userOrders = allOrders.filter(
          (o) => o.manguoidung === user.manguoidung || o.email === user.email
        );

        setOrders(userOrders);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    await axios.put(`${BASE_URL}/huy/${id}`);
    setOrders((prev) =>
      prev.map((o) => (o.madonhang === id ? { ...o, trangthai: "Đã hủy" } : o))
    );
  };

  const getStatusColor = (tt) => {
    tt = tt.toLowerCase();
    if (tt.includes("chờ"))
      return "text-amber-700 bg-amber-100 border border-amber-200";
    if (tt.includes("xác nhận"))
      return "text-blue-700 bg-blue-100 border border-blue-200";
    if (tt.includes("đang"))
      return "text-purple-700 bg-purple-100 border border-purple-200";
    if (tt.includes("giao"))
      return "text-emerald-700 bg-emerald-100 border border-emerald-200";
    if (tt.includes("hủy"))
      return "text-red-700 bg-red-100 border border-red-200";
    return "text-gray-600 bg-gray-100 border border-gray-200";
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-32 pb-16 px-4 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* HEADER KHỐI ĐƠN HÀNG */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
              <ClipboardList size={22} />
            </span>
            Lịch sử đơn hàng
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            Theo dõi trạng thái vận chuyển, thông tin nhận hàng và tổng tiền của
            tất cả đơn mà bạn đã đặt tại Horizon.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] border border-white/60 rounded-2xl p-6 md:p-8">
          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-slate-700 mb-4" size={32} />
              <p className="text-slate-600 text-sm">
                Đang tải đơn hàng của bạn, vui lòng chờ trong giây lát…
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
                <Package size={28} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Bạn chưa có đơn hàng nào
              </h2>
              <p className="text-sm text-slate-600 mb-6 max-w-md">
                Khi bạn đặt mua sản phẩm, mọi đơn hàng sẽ xuất hiện tại đây để
                tiện theo dõi trạng thái và lịch sử mua sắm.
              </p>
              <Link
                to="/all"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                Bắt đầu mua sắm
              </Link>
            </div>
          )}

          {/* DANH SÁCH ĐƠN HÀNG */}
          {!loading && orders.length > 0 && (
            <div className="space-y-6">
              {pagedOrders.map((o) => (
                <div
                  key={o.madonhang}
                  className="group border border-slate-100 rounded-2xl p-5 md:p-6 bg-white/90 hover:bg-slate-50 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* HÀNG TITLE + TRẠNG THÁI */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Mã đơn hàng
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          #{o.madonhang}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {o.ngaytao && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
                          <CalendarClock size={16} />
                          <span>{formatDateTime(o.ngaytao)}</span>
                        </div>
                      )}

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold inline-flex items-center gap-2 ${getStatusColor(
                          o.trangthai
                        )}`}
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-current" />
                        {o.trangthai}
                      </span>
                    </div>
                  </div>

                  {/* INFO CHIA 2 CỘT */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <User size={18} className="mt-0.5 text-slate-500" />
                        <span>
                          <span className="text-slate-500">Người nhận: </span>
                          <span className="font-semibold text-slate-900">
                            {o.tennguoinhan}
                          </span>
                        </span>
                      </p>

                      <p className="flex items-start gap-2">
                        <Phone size={18} className="mt-0.5 text-slate-500" />
                        <span>{o.sodienthoai}</span>
                      </p>

                      <p className="flex items-start gap-2">
                        <MapPin size={18} className="mt-0.5 text-slate-500" />
                        <span className="leading-snug">{o.diachigiao}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <Truck size={18} className="mt-0.5 text-slate-500" />
                        <span>
                          <span className="text-slate-500">
                            Đơn vị vận chuyển:{" "}
                          </span>
                          <span className="font-medium">
                            {o.donvivanchuyen}
                          </span>
                        </span>
                      </p>

                      <p className="flex items-start gap-2">
                        <Package size={18} className="mt-0.5 text-slate-500" />
                        <span>
                          <span className="text-slate-500">
                            Hình thức thanh toán:{" "}
                          </span>
                          <span className="font-medium">
                            {o.hinhthucthanhtoan}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* TỔNG TIỀN + ACTION */}
                  <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                        Tổng thanh toán
                      </p>
                      <p className="text-xl font-extrabold text-slate-900">
                        {Number(o.tongthanhtoan).toLocaleString("vi-VN")}₫
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                      {!o.trangthai.toLowerCase().includes("hủy") && (
                        <button
                          onClick={() => cancelOrder(o.madonhang)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                          bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow transition"
                        >
                          <XCircle size={18} />
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* PAGINATION */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className={`h-10 w-10 rounded-full border flex items-center justify-center transition
      ${safePage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50"}
    `}
            aria-label="Trang trước"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages })
            .slice(0, 10)
            .map((_, idx) => {
              const p = idx + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition
          ${
            active
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50 border"
          }
        `}
                  aria-label={`Trang ${p}`}
                >
                  {p}
                </button>
              );
            })}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className={`h-10 w-10 rounded-full border flex items-center justify-center transition
      ${
        safePage === totalPages
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-slate-50"
      }
    `}
            aria-label="Trang sau"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
