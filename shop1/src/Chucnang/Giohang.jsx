"use client";
import React, { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export default function CartSlidebar({ onClose }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  // THÊM MỚI: SUGGESTED VOUCHER
  const [suggested, setSuggested] = useState([]);
  const getCartKey = () => {
    const uid = localStorage.getItem("activeUserId");
    return uid ? `cart_${uid}` : "cart_guest";
  };
  const saveCart = (nextCart) => {
    localStorage.setItem(getCartKey(), JSON.stringify(nextCart));
    setCart(nextCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = async (variantId, delta) => {
    const item = cart.find((it) => it.mabienthe === variantId);
    if (!item) return;

    //  Nếu số lượng = 1 và bấm "-"
    if (item.soluong === 1 && delta === -1) {
      const result = await Swal.fire({
        title: "Xóa sản phẩm?",
        text: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        removeItem(variantId);
      }

      return;
    }

    //  Tăng / giảm bình thường
    const nextCart = cart.map((it) =>
      it.mabienthe === variantId ? { ...it, soluong: it.soluong + delta } : it
    );

    saveCart(nextCart);
  };

  const removeItem = (variantId) => {
    const nextCart = cart.filter((it) => it.mabienthe !== variantId);
    saveCart(nextCart);
  };

  const subtotal = cart.reduce(
    (s, it) => s + Number(it.giakhuyenmai) * Number(it.soluong),
    0
  );

  const computeDiscount = () => {
    if (!appliedCoupon) return 0;
    const c = appliedCoupon;

    if (c.type === "fixed") return Math.min(c.value, subtotal);

    if (c.type === "percent") {
      const raw = Math.round((subtotal * c.value) / 100);
      return Math.min(raw, c.maxDiscount || raw);
    }

    if (c.type === "freeship") return 0;
    return 0;
  };

  const shippingFee = () => {
    if (appliedCoupon?.type === "freeship") return 0;
    if (subtotal - computeDiscount() >= 500000) return 0;
    return subtotal === 0 ? 0 : 20000;
  };

  const discountValue = computeDiscount();
  const shipping = shippingFee();
  const total = Math.max(0, subtotal - discountValue + shipping);
  useEffect(() => {
    if (subtotal > 0) {
      loadSuggestedVouchers(subtotal);
    } else {
      setSuggested([]);
    }
  }, [subtotal]);
  // ⭐ HÀM ÁP DỤNG COUPON
  const applyCoupon = async () => {
    const code = (coupon || "").trim().toUpperCase();
    if (!code) {
      setError("Vui lòng nhập mã ưu đãi");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/voucher");
      const json = await res.json();
      const vouchers = json.data || [];

      const found = vouchers.find((v) => v.magiamgia.toUpperCase() === code);

      if (!found) {
        setError("Mã không hợp lệ");
        return;
      }

      if (subtotal < found.dontoithieu) {
        setError(
          `Đơn hàng tối thiểu ${found.dontoithieu.toLocaleString("vi-VN")} đ`
        );
        return;
      }

      let type = "fixed";
      if (found.loaikhuyenmai === "%") type = "percent";

      setAppliedCoupon({
        code: found.magiamgia,
        type,
        value: found.giatrigiam,
        maxDiscount: found.giantoida,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể áp dụng mã lúc này");
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setError("");
  };

  //  THÊM HÀM GỢI Ý
  const loadSuggestedVouchers = async (forceSubtotal) => {
    try {
      const res = await fetch("http://localhost:5000/api/voucher");
      const json = await res.json();
      const vouchers = json.data || [];

      const now = new Date();
      const currentSubtotal = forceSubtotal ?? subtotal; // ĐẢM BẢO LẤY TỔNG TIỀN MỚI NHẤT

      console.log("Subtotal dùng để lọc voucher:", currentSubtotal);

      const filtered = vouchers.filter((v) => {
        const start = new Date(v.ngaybatdau);
        const end = new Date(v.ngayketthuc);

        const status = removeVietnameseTones(v.trangthai || "");

        return (
          status.includes("hoat") && // <— FIX KHÔNG ĐỤNG BACKEND
          currentSubtotal >= v.dontoithieu &&
          now >= start &&
          now <= end
        );
      });

      console.log("Gợi ý voucher:", filtered);

      setSuggested(filtered);
    } catch (err) {
      console.error("Không thể tải voucher:", err);
    }
  };

  // GỌI KHI GIỎ HÀNG THAY ĐỔI
  useEffect(() => {
    const syncCart = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(getCartKey())) || [];

        const normalized = raw.map((it) => ({
          mabienthe: Number(it.mabienthe),
          tensanpham: it.tensanpham || "Sản phẩm",
          giagoc: Number(it.giagoc),
          giakhuyenmai: Number(it.giakhuyenmai),
          soluong: Number(it.soluong || 1),
          mausac: it.mausac || "",
          size: it.size || "",
          hinhanh: it.hinhanh || "/img/placeholder.png",
          sku: it.sku,
        }));

        setCart(normalized);

        const newSubtotal = normalized.reduce(
          (s, it) => s + it.giakhuyenmai * it.soluong,
          0
        );

        loadSuggestedVouchers(newSubtotal);
      } catch (e) {
        console.error("Lỗi sync cart:", e);
        setCart([]);
      }
    };

    syncCart(); //  CỰC QUAN TRỌNG: gọi ngay khi mở giỏ
    window.addEventListener("cartUpdated", syncCart);

    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  //HÀM CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) {
      setError("Giỏ hàng trống");
      return;
    }

    const checkoutPayload = {
      cart,
      coupon: appliedCoupon,
      totals: { subtotal, discountValue, shipping, total },
    };

    localStorage.setItem("checkoutPayload", JSON.stringify(checkoutPayload));

    onClose && onClose();
    navigate("/checkout");
  };

  // =================== UI ===================

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* LAYER MỜ */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose && onClose()}
      />

      {/* SLIDE BAR */}
      <aside
        className="
        fixed top-[20px] right-[10px]
        h-[95vh] w-full md:w-[420px]
        bg-white/90 backdrop-blur-xl
        rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]
        border border-gray-200
        animate-slideIn
        overflow-auto
        z-[1000]
      "
      >
        {/* HEADER */}
        <div className="p-4 border-b bg-white/70 backdrop-blur-xl rounded-t-2xl flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Giỏ hàng ({cart.length})
          </h3>

          <button
            onClick={() => onClose && onClose()}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          {/* ==== COUPON BOX ==== */}
          <div className="bg-gray-50/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 outline-none bg-white"
                placeholder="Nhập mã ưu đãi"
              />
              <button
                onClick={applyCoupon}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Áp dụng
              </button>
            </div>
            {/*  GỢI Ý VOUCHER – LUXURY STYLE */}
            {suggested.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Gợi ý mã ưu đãi
                </h4>

                <div className="space-y-3">
                  {suggested.map((v) => (
                    <div
                      key={v.magiamgia}
                      className="
            p-4 flex justify-between items-center
            bg-gray-50 border border-gray-200 rounded-xl
            hover:shadow-lg hover:bg-white
            transition-all cursor-pointer
          "
                      onClick={() => {
                        setCoupon(v.magiamgia);
                        applyCoupon();
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">
                          {v.magiamgia}
                        </div>

                        <p className="text-xs text-gray-500 leading-5">
                          {v.mota}
                        </p>

                        <p className="text-[11px] text-green-600 mt-1 font-medium">
                          Đơn tối thiểu: {v.dontoithieu.toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>

                      <button
                        className="
              ml-3 px-3 py-1.5 text-xs
              bg-black text-white rounded-lg
              hover:bg-gray-800 transition
            "
                      >
                        Áp dụng
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appliedCoupon && (
              <div className="mt-2 text-sm text-green-700">
                Đã áp dụng: <strong>{appliedCoupon.code}</strong>{" "}
                {appliedCoupon.type === "percent"
                  ? `- ${appliedCoupon.value}%`
                  : appliedCoupon.type === "fixed"
                  ? `- ${appliedCoupon.value.toLocaleString("vi-VN")}đ`
                  : "(Miễn phí vận chuyển)"}
                <button
                  onClick={clearCoupon}
                  className="ml-3 text-xs text-blue-600 underline"
                >
                  Xóa
                </button>
              </div>
            )}

            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          <div className="space-y-3">
            {cart.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                Giỏ hàng của bạn đang trống.
              </div>
            )}

            {cart.map((it) => (
              <div
                key={it.mabienthe}
                className="flex gap-3 items-start bg-white/80 p-3 rounded-xl border backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={it.hinhanh || "/img/placeholder.png"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold">{it.tensanpham}</h4>
                      <p className="text-xs text-gray-500">
                        {it.sku} • {it.mausac} • {it.size}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(it.mabienthe)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(it.mabienthe, -1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>

                      <div className="px-3 py-1 border rounded-md text-sm">
                        {it.soluong}
                      </div>

                      <button
                        onClick={() => updateQty(it.mabienthe, +1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-sm font-bold text-red-600">
                      {(Number(it.giakhuyenmai) * it.soluong).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT */}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Giảm giá</span>
              <span className="text-red-600">
                -{discountValue.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Phí vận chuyển</span>
              <span>{shipping.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <div>
                <div className="text-xs text-gray-500">Tổng thanh toán</div>
                <div className="text-xl font-bold text-red-600">
                  {total.toLocaleString("vi-VN")} đ
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="bg-[rgb(96,148,216)] border border-[rgb(60,110,190)] text-white px-5 py-2 rounded-lg hover:bg-[rgb(72,128,204)] transition font-semibold"
              >
                THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
