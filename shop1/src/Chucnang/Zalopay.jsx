import React, { useState } from "react";
import axios from "axios";
import { useLocation, Navigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/payment";
const CREATE_URL = `${API_BASE}/zalopay/create`;

export default function ZaloPayPage() {
  // 1️⃣ LẤY DATA TỪ CHECKOUT
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  // Nếu user truy cập thẳng → quay về
  if (!orderId || !totalAmount) {
    return <Navigate to="/" />;
  }

  // 2️⃣ STATE
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // 3️⃣ TẠO THANH TOÁN
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    try {
      const payload = {
        madonhang: Number(orderId),
      };

      const res = await axios.post(CREATE_URL, payload);
      const data = res.data;

      const orderUrl =
        data?.order_url || data?.orderurl || data?.data?.order_url;

      if (orderUrl) {
        window.location.href = orderUrl;
      } else {
        setCreateError("Không nhận được link thanh toán");
      }
    } catch (err) {
      setCreateError(
        err?.response?.data?.message || "Không tạo được thanh toán"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // 4️⃣ UI
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl shadow space-y-6">
        <h1 className="text-xl font-bold text-center">
          Xác nhận thanh toán ZaloPay
        </h1>

        {/* THÔNG TIN ĐƠN HÀNG */}
        <div className="bg-slate-900 p-4 rounded space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Mã đơn hàng</span>
            <span className="font-semibold">#{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Tổng thanh toán</span>
            <span className="text-emerald-400 font-bold">
              {totalAmount.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>

        {/* NÚT THANH TOÁN */}
        <form onSubmit={handleCreateOrder}>
          <button
            disabled={createLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold"
          >
            {createLoading
              ? "Đang chuyển ZaloPay..."
              : "Thanh toán bằng ZaloPay"}
          </button>
        </form>

        {createError && (
          <p className="text-red-400 text-center">{createError}</p>
        )}
      </div>
    </div>
  );
}
