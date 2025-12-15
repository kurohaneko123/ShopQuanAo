import React, { useMemo, useState } from "react";
import axios from "axios";
import { useLocation, Navigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/payment";
const CREATE_URL = `${API_BASE}/zalopay/create`;

export default function ZaloPayPage() {
  // 1️⃣ LẤY DATA TỪ CHECKOUT
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  // Nếu user truy cập thẳng → quay về
  if (!orderId || totalAmount === undefined || totalAmount === null) {
    return <Navigate to="/" />;
  }

  // ✅ UI-SAFE: Chuẩn hóa tiền để HIỂN THỊ đúng (không đụng logic create)
  const amountNumber = useMemo(() => {
    const n = Number(totalAmount);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }, [totalAmount]);

  const formatVND = useMemo(() => {
    return new Intl.NumberFormat("vi-VN");
  }, []);

  // 2️⃣ STATE
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // 3️⃣ TẠO THANH TOÁN (GIỮ NGUYÊN LOGIC)
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

  // 4️⃣ UI (Less is more, sạch & premium hơn)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs text-slate-400 tracking-wide uppercase">
              Thanh toán
            </p>
            <h1 className="text-2xl font-bold">Xác nhận thanh toán ZaloPay</h1>
            <p className="text-sm text-slate-400">
              Kiểm tra lại thông tin trước khi chuyển sang cổng thanh toán.
            </p>
          </div>

          {/* Card thông tin */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Mã đơn hàng</span>
              <span className="font-semibold">#{orderId}</span>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Tổng thanh toán</span>
              <div className="text-right">
                <p className="text-emerald-400 font-extrabold text-xl leading-none">
                  {formatVND.format(amountNumber)} ₫
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  (Đã bao gồm khuyến mãi nếu có)
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <form onSubmit={handleCreateOrder} className="space-y-3">
            <button
              disabled={createLoading}
              className="w-full rounded-2xl py-3.5 font-semibold
                         bg-emerald-500 hover:bg-emerald-600
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition shadow-sm hover:shadow-md"
            >
              {createLoading
                ? "Đang chuyển ZaloPay..."
                : "Thanh toán bằng ZaloPay"}
            </button>

            {createError && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200 text-sm">
                {createError}
              </div>
            )}
          </form>

          {/* Footer note */}
          <p className="text-xs text-slate-500">
            Lưu ý: Sau khi thanh toán thành công, hệ thống sẽ cập nhật trạng
            thái đơn hàng.
          </p>
        </div>
      </div>
    </div>
  );
}
