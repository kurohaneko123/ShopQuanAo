import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ Lấy orderId từ nhiều nguồn
  const params = new URLSearchParams(location.search);
  const orderIdFromQuery = params.get("orderId");

  const orderId = useMemo(() => {
    return (
      orderIdFromQuery ||
      location.state?.orderId ||
      localStorage.getItem("lastZaloOrderId") ||
      localStorage.getItem("lastOrderId") ||
      null
    );
  }, [orderIdFromQuery, location.state]);

  const paymentMethod = useMemo(() => {
    const methodFromQuery = params.get("method");
    if (methodFromQuery === "zalopay") return "ZALOPAY";
    if (methodFromQuery === "cod") return "COD";

    return (
      location.state?.paymentMethod ||
      localStorage.getItem("lastPaymentMethod") ||
      "COD"
    );
  }, [location.state, location.search]);

  const [checking, setChecking] = useState(true);

  // null | "dang_xu_ly" | "thanh_cong" | "that_bai"
  const [refundStatus, setRefundStatus] = useState(null);
  // ✅ AUTO SUCCESS CHO COD
  useEffect(() => {
    if (!orderId) return;

    if (paymentMethod === "COD") {
      // COD không cần xác nhận thanh toán
      setChecking(false);

      // Xóa giỏ hàng
      const uid = localStorage.getItem("activeUserId");
      const cartKey = uid ? `cart_${uid}` : "cart_guest";
      localStorage.removeItem(cartKey);
      localStorage.removeItem("checkoutPayload");
    }
  }, [orderId, paymentMethod]);

  // 2️⃣ Polling khi là ZaloPay
  useEffect(() => {
    if (!orderId || paymentMethod !== "ZALOPAY") return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donhang/${orderId}`);
        const data = await res.json();

        // 🔥 CASE 1: ĐÃ HOÀN TIỀN → KHÔNG CHECKING
        if (
          data?.trangthai === "đã hoàn tiền" ||
          data?.trangthai === "Hoàn Trả"
        ) {
          setChecking(false);

          // nếu có mã hoàn tiền → check trạng thái refund
          if (data.mahoantien) {
            const refundRes = await fetch(
              `http://localhost:5000/api/payment/zalopay/refund-status?refund_id=${data.mahoantien}`
            );
            const refundData = await refundRes.json();

            if (refundData.return_code === 1) {
              setRefundStatus("thanh_cong");
              clearInterval(timer);
            } else if (refundData.return_code === 3) {
              setRefundStatus("dang_xu_ly");
            } else {
              setRefundStatus("that_bai");
              clearInterval(timer);
            }
          } else {
            clearInterval(timer);
          }

          return;
        }

        // 🔥 CASE 2: THANH TOÁN THÀNH CÔNG (chưa hoàn tiền)
        if (Number(data?.dathanhtoan) === 1) {
          setChecking(false);
          clearInterval(timer);

          // ✅ XÓA GIỎ SAU KHI THANH TOÁN
          const uid = localStorage.getItem("activeUserId");
          const cartKey = uid ? `cart_${uid}` : "cart_guest";
          localStorage.removeItem(cartKey);
          localStorage.removeItem("checkoutPayload");

          return;
        }

        // 🔥 CASE 3: CHƯA CÓ KẾT QUẢ CUỐI → vẫn checking
        setChecking(true);
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [orderId, paymentMethod]);

  // 3️⃣ Nếu không có orderId → về home
  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[rgb(220,235,250)] flex items-center justify-center">
              <span className="text-4xl text-[rgb(60,110,190)] font-bold">
                {checking && "⏳"}
                {!checking && !refundStatus && "✓"}
                {refundStatus === "dang_xu_ly" && "🔄"}
                {refundStatus === "thanh_cong" && "💸"}
              </span>
            </div>
          </div>

          <h1 className="text-center text-2xl font-extrabold text-slate-900">
            {checking && "Đang xác nhận thanh toán..."}
            {!checking && !refundStatus && "Đặt hàng thành công"}
            {refundStatus === "dang_xu_ly" && "Đơn hàng đang hoàn tiền"}
            {refundStatus === "thanh_cong" && "Hoàn tiền thành công"}
          </h1>

          <p className="mt-2 text-center text-slate-600">
            {checking && "Vui lòng chờ trong giây lát"}
            {!checking && !refundStatus && "Cảm ơn bạn đã mua sắm tại Horizon"}
            {refundStatus === "dang_xu_ly" &&
              "ZaloPay đang xử lý hoàn tiền, vui lòng đợi trong giây lát"}
            {refundStatus === "thanh_cong" &&
              "Số tiền đã được hoàn lại vào ví ZaloPay của bạn"}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Mã đơn hàng</p>
              <p className="font-bold text-lg">#{orderId}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-500">Thanh toán</p>
              <p className="font-semibold">
                {paymentMethod === "ZALOPAY" ? "ZaloPay" : "COD"}
              </p>
            </div>
          </div>

          {/* Nút chỉ hiện khi KHÔNG đang refund */}
          {!checking && refundStatus !== "dang_xu_ly" && (
            <div className="mt-8 flex justify-center gap-3">
              <Link
                to="/"
                className="px-5 py-3 rounded-xl border text-sm font-semibold
                border-[rgb(190,215,245)]
                text-[rgb(60,110,190)]
                hover:bg-[rgb(220,235,250)]"
              >
                Tiếp tục mua sắm
              </Link>

              <Link
                to="/donhang"
                className="px-5 py-3 rounded-xl
                bg-[rgb(96,148,216)] text-white
                text-sm font-semibold
                hover:bg-[rgb(72,128,204)] transition"
              >
                Xem đơn hàng
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
