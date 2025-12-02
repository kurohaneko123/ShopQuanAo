import React, { useState } from "react";
import axios from "axios";

// ================== CONFIG CHUẨN THEO ROUTE ANH ==================
const API_BASE = "http://localhost:5000/api/payment";

const CREATE_URL = `${API_BASE}/zalopay/create`;
const STATUS_URL = `${API_BASE}/zalopay/status`;
const REFUND_URL = `${API_BASE}/zalopay/refund`;
const REFUND_QUERY_URL = `${API_BASE}/zalopay/refund-status`;

export default function ZaloPayPage() {
  // ================== STATE ==================
  const [amount, setAmount] = useState(50000);
  const [createResult, setCreateResult] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [appTransId, setAppTransId] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [zpTransId, setZpTransId] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundResult, setRefundResult] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState("");

  const [refundId, setRefundId] = useState("");
  const [refundQueryResult, setRefundQueryResult] = useState(null);
  const [refundQueryLoading, setRefundQueryLoading] = useState(false);
  const [refundQueryError, setRefundQueryError] = useState("");

  // ================== 1. CREATE ORDER ==================
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    setCreateResult(null);

    try {
      const res = await axios.post(CREATE_URL, {
        amount: Number(amount),
      });

      setCreateResult(res.data);

      const orderUrl = res.data.order_url || res.data.orderurl;
      if (orderUrl) window.location.href = orderUrl;
    } catch (err) {
      setCreateError("Không tạo được đơn ZaloPay");
    } finally {
      setCreateLoading(false);
    }
  };

  // ================== 2. CHECK STATUS ==================
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!appTransId.trim()) {
      setStatusError("Nhập app_trans_id");
      return;
    }

    setStatusLoading(true);
    setStatusError("");

    try {
      const res = await axios.get(STATUS_URL, {
        params: { app_trans_id: appTransId },
      });

      setStatusResult(res.data);
    } catch (err) {
      setStatusError("Lỗi truy vấn trạng thái");
    } finally {
      setStatusLoading(false);
    }
  };

  // ================== 3. REFUND ==================
  const handleRefund = async (e) => {
    e.preventDefault();
    if (!zpTransId || refundAmount <= 0) {
      setRefundError("Thiếu thông tin");
      return;
    }

    setRefundLoading(true);
    setRefundError("");

    try {
      const res = await axios.post(REFUND_URL, {
        zp_trans_id: zpTransId,
        amount: Number(refundAmount),
      });

      setRefundResult(res.data);
    } catch (err) {
      setRefundError("Lỗi refund");
    } finally {
      setRefundLoading(false);
    }
  };

  // ================== 4. QUERY REFUND ==================
  const handleQueryRefund = async (e) => {
    e.preventDefault();
    if (!refundId.trim()) {
      setRefundQueryError("Nhập refund_id");
      return;
    }

    setRefundQueryLoading(true);
    setRefundQueryError("");

    try {
      const res = await axios.get(REFUND_QUERY_URL, {
        params: { refund_id: refundId.trim() },
      });

      setRefundQueryResult(res.data);
    } catch (err) {
      setRefundQueryError("Không thể truy vấn trạng thái refund");
    } finally {
      setRefundQueryLoading(false);
    }
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold text-center">
          ZaloPay Sandbox – Test Payment
        </h1>

        {/* CREATE ORDER */}
        <section className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            1. Tạo đơn & Thanh toán
          </h2>

          <form onSubmit={handleCreateOrder} className="space-y-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
            />

            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
              {createLoading ? "Đang tạo..." : "Tạo đơn ZaloPay"}
            </button>
          </form>

          {createError && <p className="text-red-400 mt-2">{createError}</p>}

          {createResult && (
            <pre className="bg-slate-900 p-3 rounded mt-3 text-xs">
              {JSON.stringify(createResult, null, 2)}
            </pre>
          )}
        </section>

        {/* CHECK STATUS */}
        <section className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            2. Kiểm tra trạng thái đơn
          </h2>

          <form onSubmit={handleCheckStatus} className="space-y-3">
            <input
              type="text"
              value={appTransId}
              onChange={(e) => setAppTransId(e.target.value)}
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
              placeholder="VD: 250202_123456"
            />

            <button className="bg-sky-500 px-4 py-2 rounded hover:bg-sky-600">
              {statusLoading ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </form>

          {statusError && <p className="text-red-400 mt-2">{statusError}</p>}

          {statusResult && (
            <pre className="bg-slate-900 p-3 rounded mt-3 text-xs">
              {JSON.stringify(statusResult, null, 2)}
            </pre>
          )}
        </section>

        {/* REFUND */}
        <section className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">3. Hoàn tiền (Refund)</h2>

          <form onSubmit={handleRefund} className="space-y-3">
            <input
              type="text"
              value={zpTransId}
              onChange={(e) => setZpTransId(e.target.value)}
              placeholder="zp_trans_id"
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
            />

            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Số tiền refund"
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
            />

            <button className="bg-rose-500 px-4 py-2 rounded hover:bg-rose-600">
              {refundLoading ? "Đang refund..." : "Refund"}
            </button>
          </form>

          {refundError && <p className="text-red-400 mt-2">{refundError}</p>}

          {refundResult && (
            <pre className="bg-slate-900 p-3 rounded mt-3 text-xs">
              {JSON.stringify(refundResult, null, 2)}
            </pre>
          )}
        </section>

        {/* REFUND STATUS */}
        <section className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">4. Trạng thái Refund</h2>

          <form onSubmit={handleQueryRefund} className="space-y-3">
            <input
              type="text"
              value={refundId}
              onChange={(e) => setRefundId(e.target.value)}
              placeholder="refund_id"
              className="w-full p-2 rounded bg-slate-900 border border-slate-700"
            />

            <button className="bg-amber-500 px-4 py-2 rounded hover:bg-amber-600">
              {refundQueryLoading ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </form>

          {refundQueryError && (
            <p className="text-red-400 mt-2">{refundQueryError}</p>
          )}

          {refundQueryResult && (
            <pre className="bg-slate-900 p-3 rounded mt-3 text-xs">
              {JSON.stringify(refundQueryResult, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
