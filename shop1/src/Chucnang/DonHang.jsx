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
} from "lucide-react";

export default function DonHang() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api/donhang";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(BASE_URL);
        setOrders(res.data.data);
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
    if (tt.includes("chờ")) return "text-yellow-700 bg-yellow-100";
    if (tt.includes("xác nhận")) return "text-blue-700 bg-blue-100";
    if (tt.includes("đang")) return "text-purple-700 bg-purple-100";
    if (tt.includes("giao")) return "text-green-700 bg-green-100";
    if (tt.includes("hủy")) return "text-red-700 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-16 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Lịch Sử Đơn Hàng
          </h2>

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-teal-600" size={32} />
            </div>
          )}

          {!loading && orders.length === 0 && (
            <p className="text-center text-gray-500 text-lg">
              Bạn chưa có đơn hàng nào.
            </p>
          )}

          <div className="space-y-6">
            {orders.map((o) => (
              <div
                key={o.madonhang}
                className="border rounded-xl p-6 shadow hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-teal-700 flex items-center gap-2">
                    <ClipboardList size={22} /> Đơn hàng #{o.madonhang}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      o.trangthai
                    )}`}
                  >
                    {o.trangthai}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <User size={18} /> Người nhận:
                    <span className="font-semibold">{o.tennguoinhan}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={18} /> {o.sodienthoai}
                  </p>

                  <p className="flex items-center gap-2 sm:col-span-2">
                    <MapPin size={18} /> {o.diachigiao}
                  </p>

                  <p className="flex items-center gap-2">
                    <Truck size={18} /> {o.donvivanchuyen}
                  </p>

                  <p className="flex items-center gap-2">
                    <Package size={18} /> Thanh toán: {o.hinhthucthanhtoan}
                  </p>
                </div>

                <div className="mt-5 flex justify-between items-center">
                  <p className="text-lg font-bold text-teal-700">
                    Tổng tiền: {Number(o.tongthanhtoan).toLocaleString()}₫
                  </p>

                  {!o.trangthai.toLowerCase().includes("hủy") && (
                    <button
                      onClick={() => cancelOrder(o.madonhang)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                    >
                      <XCircle size={18} /> Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
