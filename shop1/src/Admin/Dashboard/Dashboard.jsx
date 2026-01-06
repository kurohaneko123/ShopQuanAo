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
  const API_TOP_PRODUCT = "http://localhost:5000/api/donhang/sanphamnoibat";
  const [chartMode, setChartMode] = useState("column");
  const [metric, setMetric] = useState("revenue");
  const [tooltip, setTooltip] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() // 0-11
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const token = localStorage.getItem("token")?.trim();
        const res = await axios.get(API_TOP_PRODUCT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopProducts(res.data.data || []);
      } catch (err) {
        console.error("Top product error:", err);
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTop();
  }, []);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const rawToken = localStorage.getItem("token");
        if (!rawToken || rawToken === "null" || rawToken === "undefined")
          return;

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
  const getDaysInMonth = (year, monthIndex) =>
    new Date(year, monthIndex + 1, 0).getDate();

  if (loading) return <p className="text-gray-400">Đang tải...</p>;

  // ===== TÍNH TOÁN =====
  const totalOrder = orders.length;
  const totalProduct = products.length;
  const totalUser = users.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.tongthanhtoan || 0),
    0
  );

  // ===== DOANH THU THEO THÁNG =====
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // tạo sẵn đủ ngày (1 → 28/29/30/31)
  const revenueByDay = Array(daysInMonth).fill(0);
  const ordersByDay = Array(daysInMonth).fill(0);

  orders.forEach((o) => {
    const d = new Date(o.ngaytao);
    if (d.getFullYear() === selectedYear && d.getMonth() === selectedMonth) {
      const dayIndex = d.getDate() - 1; // 1 → 0
      revenueByDay[dayIndex] += Number(o.tongthanhtoan || 0);
      ordersByDay[dayIndex] += 1;
    }
  });
  const labelsByDay = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

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
  // ===== CHUẨN HÓA TRẠNG THÁI ĐƠN HÀNG =====
  const getOrderStatusForDashboard = (order) => {
    // Ưu tiên trạng thái hoàn tiền
    if (order.trangthai_hoantien === "dang_xu_ly") {
      return "Đang hoàn tiền";
    }

    if (order.trangthai_hoantien === "thanh_cong") {
      return "Đã hủy";
    }

    const s = (order.trangthai || "").toLowerCase().trim();

    if (["chờ xác nhận", "cho xac nhan", "pending"].includes(s))
      return "Chờ xác nhận";

    if (["đang giao", "dang giao", "shipping"].includes(s)) return "Đang giao";

    if (["đã giao", "da giao", "completed"].includes(s)) return "Đã giao";

    if (["đã hủy", "da huy", "cancelled", "canceled"].includes(s))
      return "Đã hủy";

    return "Chờ xác nhận";
  };

  // ====== ĐẾM TRẠNG THÁI ======
  const statusCount = {
    "Chờ xác nhận": 0,
    "Đang giao": 0,
    "Đã giao": 0,
    "Đang hoàn tiền": 0,
    "Đã hủy": 0,
  };

  orders.forEach((o) => {
    const st = getOrderStatusForDashboard(o);
    statusCount[st]++;
  });

  const chartData = metric === "revenue" ? revenueByDay : ordersByDay;

  const maxValue = Math.max(...chartData, 1);

  return (
    <div className="text-gray-200 space-y-10">
      <h1 className="text-3xl font-extrabold mb-6 text-white">
        Dashboard Tổng Quan
      </h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD TEMPLATE */}
        {[
          {
            icon: <Package />,
            label: "Sản phẩm",
            value: totalProduct,
            color: "text-cyan-400",
          },
          {
            icon: <DollarSign />,
            label: "Đơn hàng",
            value: totalOrder,
            color: "text-green-400",
          },
          {
            icon: <TrendingUp />,
            label: "Doanh thu (VNĐ)",
            value: totalRevenue.toLocaleString(),
            color: "text-purple-400",
          },
          {
            icon: <BarChart2 />,
            label: "Người dùng",
            value: totalUser,
            color: "text-blue-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#111111] border border-white/10 rounded-xl p-6 flex items-center gap-4 shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:bg-white/5 transition"
          >
            <div className={`p-3 rounded-lg bg-white/5 ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <h3 className="text-2xl font-bold text-white">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Sản phẩm bán chạy</h2>

        {loadingTop ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : topProducts.length === 0 ? (
          <p className="text-gray-500">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div
                key={p.masanpham}
                className="flex items-center gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <span className="text-lg font-bold text-indigo-400 w-6">
                  {i + 1}
                </span>

                <img
                  src={p.anhdaidien}
                  alt={p.tensanpham}
                  className="w-14 h-14 object-cover rounded-lg border border-white/10"
                />

                <div className="flex-1">
                  <p className="text-white font-semibold">{p.tensanpham}</p>
                  <p className="text-sm text-gray-400">
                    Đã bán: {p.tong_daban} sản phẩm
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-emerald-400 font-bold">
                    {Number(p.doanhthu).toLocaleString()} đ
                  </p>
                  <p className="text-xs text-gray-500">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== BIỂU ĐỒ DOANH THU ===== */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-xl">
        {/* FILTER THÁNG/NĂM */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-[#111] border border-white/10 px-3 py-2 rounded-lg"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#111] border border-white/10 px-3 py-2 rounded-lg"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            Tháng này có{" "}
            <span className="mx-1 text-white font-bold">{daysInMonth}</span>{" "}
            ngày
          </div>
        </div>

        {/* Button Mode */}
        <div className="flex gap-3 mb-4">
          {["column", "line", "area"].map((m) => (
            <button
              key={m}
              onClick={() => setChartMode(m)}
              className={`px-4 py-2 rounded-lg border border-white/10 ${
                chartMode === m
                  ? "bg-indigo-600 text-white"
                  : "bg-[#1a1a1a] text-gray-300"
              }`}
            >
              {m === "column" ? "Cột" : m === "line" ? "Đường" : "Area"}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setMetric("revenue")}
            className={`px-4 py-2 rounded-lg ${
              metric === "revenue"
                ? "bg-emerald-600 text-white"
                : "bg-white/5 text-gray-300"
            }`}
          >
            Doanh thu
          </button>
          <button
            onClick={() => setMetric("order")}
            className={`px-4 py-2 rounded-lg ${
              metric === "order"
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-gray-300"
            }`}
          >
            Số đơn
          </button>
        </div>

        {/* BIỂU ĐỒ */}
        <div
          className="relative h-[360px]
bg-gradient-to-b from-[#1f1f1f] via-[#181818] to-[#111111]
rounded-2xl p-6
shadow-[inset_0_10px_25px_rgba(255,255,255,0.03)]
flex flex-col"
        >
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white">
              {metric === "revenue"
                ? `Doanh thu theo ngày – Tháng ${
                    selectedMonth + 1
                  }/${selectedYear}`
                : `Số đơn theo ngày – Tháng ${
                    selectedMonth + 1
                  }/${selectedYear}`}
            </h3>
            <p className="text-sm text-gray-400">
              Thống kê từ dữ liệu đơn hàng trong hệ thống
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <svg
              viewBox="0 0 1200 300"
              className="w-full h-full pointer-events-auto"
            >
              <defs>
                <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5ee7ff" /> {/* Cyan sáng */}
                  <stop offset="100%" stopColor="#0ea5e9" /> {/* Xanh đậm */}
                </linearGradient>
              </defs>
              {labelsByDay.map((d, i) => {
                const x = (i / daysInMonth) * 1200 + 40;
                return (
                  <text
                    key={d}
                    x={x}
                    y={295}
                    textAnchor="middle"
                    fontSize="16"
                    fill="rgba(255,255,255,0.35)"
                  >
                    {d}
                  </text>
                );
              })}

              {/* AREA */}
              {chartMode === "area" && (
                <path
                  d={`M0 300 ${chartData
                    .map((v, i) => {
                      const x = (i / (daysInMonth - 1)) * 1200;

                      const y = 300 - (v / maxValue) * 260;
                      return `L ${x} ${y}`;
                    })
                    .join(" ")} L1200 300 Z`}
                  fill="rgba(99,102,241,0.35)"
                />
              )}

              {chartMode === "line" && (
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  points={chartData
                    .map((v, i) => {
                      const x = (i / (daysInMonth - 1)) * 1200;

                      const y = 300 - (v / maxValue) * 260;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}
              {/* ===== DOT HOVER FOR LINE / AREA ===== */}
              {(chartMode === "line" || chartMode === "area") &&
                chartData.map((v, i) => {
                  const x =
                    daysInMonth > 1 ? (i / (daysInMonth - 1)) * 1200 : 0;
                  const y = 300 - (v / maxValue) * 260;

                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          label:
                            metric === "revenue"
                              ? `Ngày ${labelsByDay[i]}: ${Number(
                                  v
                                ).toLocaleString("vi-VN")} VNĐ`
                              : `Ngày ${labelsByDay[i]}: ${v} đơn`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}

              {/* COLUMN */}
              {chartMode === "column" &&
                chartData.map((v, i) => {
                  const height = (v / maxValue) * 260;
                  const barW = Math.max(8, 1000 / daysInMonth);
                  const gap = 6;
                  const x = 60 + i * (barW + gap);

                  return (
                    <g key={i}>
                      {/* CỘT DOANH THU */}
                      <rect
                        x={x}
                        y={300 - height}
                        width={barW}
                        height={height}
                        rx="10"
                        fill="url(#revBar)"
                        className="cursor-pointer"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                            label:
                              metric === "revenue"
                                ? `Ngày ${labelsByDay[i]}: ${Number(
                                    v
                                  ).toLocaleString("vi-VN")} VNĐ`
                                : `Ngày ${labelsByDay[i]}: ${v} đơn`,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />

                      {/* LABEL THÁNG */}
                      {/* <text
                        x={x + 30}
                        y={295}
                        textAnchor="middle"
                        fontSize="22"
                        fill="rgba(255,255,255,0.35)"
                      >
                        {months[i]}
                      </text> */}
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>
      </div>
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-lg
    bg-black/90 text-white text-sm
    border border-white/10 shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.label}
        </div>
      )}

      {/* ===== PIE CHART ===== */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-white">
          Trạng thái đơn hàng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-gray-300">
          {/* LEGEND */}
          <div className="space-y-5">
            <p>
              <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
              Chờ xác nhận: {statusCount["Chờ xác nhận"]} đơn
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
              Đang giao: {statusCount["Đang giao"]} đơn
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-purple-500 mr-2"></span>
              Đã giao: {statusCount["Đã giao"]} đơn
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-yellow-500 mr-2"></span>
              Đang hoàn tiền: {statusCount["Đang hoàn tiền"]} đơn
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>
              Đã hủy: {statusCount["Đã hủy"]} đơn
            </p>
          </div>

          {/* DONUT CHART */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="#0d0d0d"
                  stroke="#222"
                  strokeWidth="3"
                />

                {(() => {
                  const total = Object.values(statusCount).reduce(
                    (a, b) => a + b,
                    0
                  );
                  if (total === 0) {
                    return (
                      <text
                        x="18"
                        y="20"
                        textAnchor="middle"
                        fontSize="3"
                        fill="rgba(255,255,255,0.6)"
                      >
                        Chưa có đơn
                      </text>
                    );
                  }
                  let offset = 25;
                  const COLORS = [
                    "#22c55e", // Chờ xác nhận
                    "#0ea5e9", // Đang giao
                    "#a855f7", // Đã giao
                    "#eab308", // Đang hoàn tiền
                    "#ef4444", // Đã hủy
                  ];

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
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#111111] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
