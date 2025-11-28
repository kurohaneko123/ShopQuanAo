import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, DollarSign, TrendingUp, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_ORDER = "http://localhost:5000/api/donhang";
  const API_PRODUCT = "http://localhost:5000/api/sanpham";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [o, p] = await Promise.all([
          axios.get(API_ORDER),
          axios.get(API_PRODUCT),
        ]);

        setOrders(o.data.data || []);
        setProducts(p.data || []);
      } catch (err) {
        console.error("Lỗi Dashboard:", err);
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-cyan-100 text-cyan-700">
            <Package />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sản phẩm</p>
            <h3 className="text-2xl font-bold">{totalProduct}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-lg transition">
          <div className="p-3 rounded-lg bg-green-100 text-green-700">
            <DollarSign />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đơn hàng</p>
            <h3 className="text-2xl font-bold">{totalOrder}</h3>
          </div>
        </div>

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
      </div>

      {/* ===== BIỂU ĐỒ DOANH THU ===== */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold mb-3">Doanh thu 12 tháng</h2>

        <div className="flex items-end justify-between h-64 bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 rounded-xl p-6">
          {revenueByMonth.map((value, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className="bg-cyan-500 rounded-t-lg w-6 transition"
                style={{
                  height: `${(value / Math.max(...revenueByMonth, 1)) * 100}%`,
                }}
              ></div>
              <span className="text-xs mt-1">{months[i]}</span>
            </div>
          ))}
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
