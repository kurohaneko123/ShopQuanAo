import React from "react";
import { BarChart2, Users, Package, DollarSign } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Sản phẩm",
      value: "120",
      icon: <Package />,
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      title: "Đơn hàng",
      value: "56",
      icon: <DollarSign />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Người dùng",
      value: "340",
      icon: <Users />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Doanh thu (triệu)",
      value: "82",
      icon: <BarChart2 />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

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
  const revenues = [50, 60, 40, 80, 90, 70, 120, 100, 85, 95, 110, 130];

  return (
    <div>
      {/* ======= Tiêu đề ======= */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Dashboard Tổng Quan
      </h1>

      {/* ======= Thống kê nhanh ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 flex items-center gap-4 shadow hover:shadow-md transition"
          >
            <div className={`p-3 rounded-lg ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{s.title}</p>
              <h3 className="text-2xl font-bold">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ======= Biểu đồ doanh thu ======= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Doanh thu 12 tháng
        </h2>
        <div className="flex items-end justify-between h-64 bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 rounded-lg px-4 py-6">
          {revenues.map((value, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className="bg-cyan-400 rounded-t-lg w-6"
                style={{ height: `${(value / 150) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
