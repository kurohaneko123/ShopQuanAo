"use client";
import React, { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * CartSlidebar.jsx
 * - Lấy giỏ hàng từ localStorage key "cart" (mảng item)
 * - Nếu không có thì dùng sampleData
 * - Hỗ trợ: tăng/giảm/slash remove, nhập mã giảm giá, tính tổng, chuyển checkout
 *
 * Item shape:
 * {
 *   id, name, price (number), qty, color?, size?, img?
 * }
 */

const SAMPLE_CART = [
  {
    id: "p1",
    name: "Combo 2 áo mặc nhà bé gái",
    sku: "1LA25W001-FP074-110",
    price: 179000,
    qty: 1,
    size: "110",
    color: "Tím",
    img: "/img/sp1.jpg", // nếu không có ảnh, component sẽ fallback
  },
  {
    id: "p2",
    name: "Áo thun promox flexline",
    sku: "TPX-002",
    price: 239000,
    qty: 1,
    size: "M",
    color: "Đen",
    img: "/img/sp2.jpg",
  },
];

const AVAILABLE_COUPONS = {
  // mã: { type: 'fixed' | 'percent', value: number }
  SALE20K: { type: "fixed", value: 20000 },
  DISCOUNT10: { type: "percent", value: 10 }, // 10%
  FREESHIP: { type: "freeship", value: 0 },
};

export default function CartSlidebar({ onClose }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  // load cart from localStorage or sample
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);

        // ✅ Chuẩn hóa dữ liệu nếu thiếu field
        const normalized = parsed.map((it) => ({
          id: it.id || it.masanpham || `sp-${Date.now()}`, // fallback ID
          name: it.name || it.tensanpham || "Sản phẩm không tên",
          price: Number(it.price) || 0,
          qty: it.qty || 1,
          color: it.color || "Trắng",
          size: it.size || "M",
          sku: it.sku || `SP-${it.id || it.masanpham || "001"}`,
          img:
            it.img ||
            it.image ||
            it.hinhanh ||
            "/img/placeholder.png",
        }));

        setCart(normalized);
      } else {
        setCart(SAMPLE_CART);
      }
    } catch (err) {
      console.error("Lỗi khi đọc localStorage cart:", err);
      setCart(SAMPLE_CART);
    }
  }, []);


  // persist cart
  // 🧠 Chỉ cập nhật localStorage khi giỏ hàng KHÔNG rỗng
  useEffect(() => {
    if (cart && cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);


  // quantity handlers
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  // price calculations
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const computeDiscount = () => {
    if (!appliedCoupon) return 0;
    const c = appliedCoupon;
    if (c.type === "fixed") return Math.min(c.value, subtotal);
    if (c.type === "percent") return Math.round((subtotal * c.value) / 100);
    if (c.type === "freeship") return 0;
    return 0;
  };

  const shippingFee = () => {
    // freeship coupon or subtotal threshold free shipping
    if (appliedCoupon?.type === "freeship") return 0;
    if (subtotal - computeDiscount() >= 500000) return 0;
    // default shipping
    return subtotal === 0 ? 0 : 30000;
  };

  const discountValue = computeDiscount();
  const shipping = shippingFee();
  const total = Math.max(0, subtotal - discountValue + shipping);

  // coupon apply / clear
  const applyCoupon = () => {
    const code = (coupon || "").trim().toUpperCase();
    if (!code) {
      setError("Vui lòng nhập mã ưu đãi");
      return;
    }
    const found = AVAILABLE_COUPONS[code];
    if (!found) {
      setError("Mã không hợp lệ");
      return;
    }
    setAppliedCoupon({ code, ...found });
    setError("");
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setError("");
  };

  // checkout
  const handleCheckout = () => {
    // nếu ko có sản phẩm -> không cho checkout
    if (cart.length === 0) {
      setError("Giỏ hàng trống");
      return;
    }

    // lưu tạm thông tin thanh toán (ví dụ)
    const checkoutPayload = {
      cart,
      coupon: appliedCoupon,
      totals: { subtotal, discountValue, shipping, total },
    };
    localStorage.setItem("checkoutPayload", JSON.stringify(checkoutPayload));

    // đóng sidebar và chuyển tới trang thanh toán
    onClose && onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => onClose && onClose()}
      />

      {/* panel */}
      <aside className="absolute right-0 top-0 h-full w-full md:w-[420px] bg-white shadow-2xl overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Giỏ hàng ({cart.length})</h3>
          <button
            onClick={() => onClose && onClose()}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* content */}
        <div className="p-4 space-y-4">
          {/* coupon */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 outline-none"
                placeholder="Nhập mã ưu đãi (VD: SALE20K, DISCOUNT10, FREESHIP)"
              />
              <button
                onClick={applyCoupon}
                className="bg-black text-white px-3 py-2 rounded-md"
              >
                Áp dụng
              </button>
            </div>
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

          {/* items */}
          <div className="space-y-3">
            {cart.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                Giỏ hàng của bạn đang trống.
              </div>
            )}

            {cart.map((it) => (
              <div key={it.id} className="flex gap-3 items-start">
                <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border">
                  <img
                    src={it.img || "/img/placeholder.png"}
                    alt={it.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/placeholder.png";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{it.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {it.sku} • {it.color} • {it.size}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(it.id, -1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="px-3 py-1 border rounded text-sm">{it.qty}</div>
                      <button
                        onClick={() => updateQty(it.id, +1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-sm font-semibold text-red-600">
                      {(it.price * it.qty).toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Giảm giá</span>
              <span className="text-red-600">-{discountValue.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Phí vận chuyển</span>
              <span>{shipping.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t mt-2">
              <div>
                <div className="text-sm text-gray-500">Tổng thanh toán</div>
                <div className="text-lg font-bold text-red-600">
                  {total.toLocaleString("vi-VN")} đ
                </div>
              </div>

              <div className="w-36">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition"
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            * Miễn phí vận chuyển cho đơn hàng từ 500.000 đ hoặc sử dụng mã FREESHIP
          </div>
        </div>
      </aside>
    </div>
  );
}
