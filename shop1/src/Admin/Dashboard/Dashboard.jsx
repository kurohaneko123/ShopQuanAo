import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, DollarSign, TrendingUp, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const API_USER = "http://localhost:5000/api/nguoidung/danhsach";

  const API_ORDER = "http://localhost:5000/api/donhang";
  const API_PRODUCT = "http://localhost:5000/api/sanpham";
  const [chartMode, setChartMode] = useState("column");
  // "column" | "line" | "area"

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const rawToken = localStorage.getItem("token");

        if (!rawToken || rawToken === "null" || rawToken === "undefined") {
          console.log("❌ Không có token — dừng dashboard");
          return;
        }

        const token = rawToken.trim();

        const [o, p, u] = await Promise.all([
          axios.get(API_ORDER, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_PRODUCT, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_USER, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrders(o.data.data || []);
        setProducts(Array.isArray(p.data.data) ? p.data.data : []);

        setUsers(u.data.nguoidung || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  // ==== TÍNH TOÁN ====
  const totalOrder = orders.length;
  const totalProduct = products.length;
  const totalUser = users.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.tongthanhtoan || 0),
    0
  );

  // ==== BIỂU ĐỒ DOANH THU THEO THÁNG ====
  const revenueByMonth = Array(12).fill(0);

  orders.forEach((o) => {
    const m = new Date(o.ngaytao).getMonth();
    revenueByMonth[m] += Number(o.tongthanhtoan || 0);
  });
  const ordersByMonth = Array(12).fill(0);

  orders.forEach((o) => {
    const m = new Date(o.ngaytao).getMonth();
    ordersByMonth[m]++;
  });

  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];
  // === ĐẾM SỐ ĐƠN THEO TRẠNG THÁI ===
  const statusCount = {
    "Chờ xác nhận": 0,
    "Đang giao": 0,
    "Đã giao": 0,
    "Đã hủy": 0,
  };

  orders.forEach((order) => {
    const st = order.trangthai?.trim() || "Chờ xác nhận";
    if (statusCount[st] !== undefined) {
      statusCount[st]++;
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Dashboard Tổng Quan</h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Sản phẩm */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-cyan-100 text-cyan-700">
            <Package />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sản phẩm</p>
            <h3 className="text-2xl font-bold">{totalProduct}</h3>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-green-100 text-green-700">
            <DollarSign />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đơn hàng</p>
            <h3 className="text-2xl font-bold">{totalOrder}</h3>
          </div>
        </div>

        {/* Doanh thu */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
            <TrendingUp />
          </div>
          <div>
            <p className="text-sm text-gray-500">Doanh thu (VNĐ)</p>
            <h3 className="text-2xl font-bold">
              {totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* 🟦 Người dùng */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
            <BarChart2 />
          </div>
          <div>
            <p className="text-sm text-gray-500">Người dùng</p>
            <h3 className="text-2xl font-bold">{totalUser}</h3>
          </div>
        </div>
      </div>

      {/* ===== BIỂU ĐỒ DOANH THU ===== */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Doanh thu 12 tháng</h2>

        {/* Nút chuyển mode */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setChartMode("column")}
            className={`px-4 py-2 rounded-lg border ${
              chartMode === "column" ? "bg-cyan-500 text-white" : "bg-white"
            }`}
          >
            Cột
          </button>

          <button
            onClick={() => setChartMode("line")}
            className={`px-4 py-2 rounded-lg border ${
              chartMode === "line" ? "bg-cyan-500 text-white" : "bg-white"
            }`}
          >
            Đường
          </button>

          <button
            onClick={() => setChartMode("area")}
            className={`px-4 py-2 rounded-lg border ${
              chartMode === "area" ? "bg-cyan-500 text-white" : "bg-white"
            }`}
          >
            Area
          </button>
        </div>

        {/* BIỂU ĐỒ */}
        <div className="relative h-72 bg-gradient-to-b from-cyan-50 to-white rounded-xl p-6">
          <svg viewBox="0 0 1200 300" className="w-full h-full">
            {/* VẼ AREA MODE */}
            {chartMode === "area" && (
              <path
                d={`
            M 0 300 
            ${revenueByMonth
              .map((v, i) => {
                const x = (i / 11) * 1200;
                const y = 300 - (v / Math.max(...revenueByMonth, 1)) * 260;
                return `L ${x} ${y}`;
              })
              .join(" ")}
            L 1200 300 Z
          `}
                fill="rgba(34,211,238,0.4)"
                className="transition-all duration-500"
              />
            )}

            {/* VẼ LINE MODE */}
            {chartMode === "line" && (
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                points={revenueByMonth
                  .map((v, i) => {
                    const x = (i / 11) * 1200;
                    const y = 300 - (v / Math.max(...revenueByMonth, 1)) * 260;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                className="transition-all duration-500"
              />
            )}

            {/* VẼ CỘT MODE */}
            {chartMode === "column" &&
              revenueByMonth.map((v, i) => {
                const height = (v / Math.max(...revenueByMonth, 1)) * 260;
                const x = (i / 12) * 1200 + 20;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={300 - height}
                    width="60"
                    height={height}
                    fill="#06b6d4"
                    className="transition-all duration-500 hover:opacity-70 cursor-pointer"
                  />
                );
              })}

            {/* TOOLTIP DOT + giá trị */}
            {/* TOOLTIP DOT + FULL INFO */}
            {revenueByMonth.map((v, i) => {
              const x = (i / 11) * 1200;
              const y = 300 - (v / Math.max(...revenueByMonth, 1)) * 260;

              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="6" fill="#06b6d4" />

                  {/* Tooltip */}
                  <g className="opacity-0 hover:opacity-100 transition">
                    <rect
                      x={x - 70}
                      y={y - 80}
                      width="140"
                      height="65"
                      rx="8"
                      fill="white"
                      stroke="#06b6d4"
                      className="shadow-lg"
                    />

                    <text
                      x={x}
                      y={y - 60}
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-semibold"
                    >
                      {`Tháng ${i + 1}`}
                    </text>

                    <text
                      x={x}
                      y={y - 40}
                      textAnchor="middle"
                      className="text-xs fill-cyan-600 font-bold"
                    >
                      {`Doanh thu: ${v.toLocaleString()}đ`}
                    </text>

                    <text
                      x={x}
                      y={y - 22}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {`Số đơn: ${ordersByMonth[i]} đơn`}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ====== PIE CHART ====== */}
        {/* ===== BIỂU ĐỒ TRÒN ĐẸP ===== */}
        <div className="bg-white rounded-2xl shadow p-8 mt-10">
          <h2 className="text-xl font-bold mb-6">Tỉ lệ trạng thái đơn hàng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEGEND */}
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span>
                  Chờ xác nhận: <b>{statusCount["Chờ xác nhận"]}</b> đơn
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <span>
                  Đang giao: <b>{statusCount["Đang giao"]}</b> đơn
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                <span>
                  Đã giao: <b>{statusCount["Đã giao"]}</b> đơn
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                <span>
                  Đã hủy: <b>{statusCount["Đã hủy"]}</b> đơn
                </span>
              </div>
            </div>

            {/* DONUT CHART */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  {/* Vòng trắng ở giữa */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="white"
                    stroke="#f1f5f9"
                    strokeWidth="3"
                  />

                  {/* Các vòng màu */}
                  {(() => {
                    const total =
                      Object.values(statusCount).reduce((a, b) => a + b, 0) ||
                      1;
                    let offset = 25;

                    const COLORS = ["#22c55e", "#0ea5e9", "#a855f7", "#ef4444"];

                    return Object.values(statusCount).map((value, i) => {
                      const pct = (value / total) * 100;
                      const dash = (pct / 100) * 100;

                      const circle = (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="transparent"
                          stroke={COLORS[i]}
                          strokeWidth="3.2"
                          strokeDasharray={`${dash} ${100 - dash}`}
                          strokeDashoffset={offset}
                          className="transition-all duration-700"
                        />
                      );

                      offset -= dash;
                      return circle;
                    });
                  })()}
                </svg>

                {/* LÕI TRẮNG Ở GIỮA */}
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
