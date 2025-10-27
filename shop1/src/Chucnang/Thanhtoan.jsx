import React, { useState } from "react";

export default function Checkout() {
  // State lưu form người dùng nhập
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    payment: "cod",
    shipping: "standard",
  });

  // Tính toán đơn hàng mẫu (bạn có thể thay bằng dữ liệu thật)
  const [subtotal, setSubtotal] = useState(179000);
  const shippingCost = formData.shipping === "express" ? 40000 : 20000;
  const discount = 10000;
  const total = subtotal + shippingCost - discount;

  // Hàm xử lý đặt hàng
  const handleOrder = (e) => {
    e.preventDefault();
    alert(
      `Đặt hàng thành công!\n\nKhách hàng: ${formData.name}\nSĐT: ${formData.phone}\nĐịa chỉ: ${formData.address}\nPhương thức: ${formData.payment.toUpperCase()}`
    );
  };

  return (
    <div className="min-h-screen bg-white text-black mt-30 px-8">
      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bên trái: Thông tin giao hàng */}
        <form
          onSubmit={handleOrder}
          className="border rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>

          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Địa chỉ chi tiết"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          {/* Phương thức giao hàng */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">Phương thức giao hàng</h3>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={formData.shipping === "standard"}
                onChange={(e) =>
                  setFormData({ ...formData, shipping: e.target.value })
                }
              />
              <span className="ml-2">
                Giao hàng tiêu chuẩn (2–4 ngày) - 20.000đ
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={formData.shipping === "express"}
                onChange={(e) =>
                  setFormData({ ...formData, shipping: e.target.value })
                }
              />
              <span className="ml-2">
                Giao hàng nhanh (1–2 ngày) - 40.000đ
              </span>
            </label>
          </div>

          {/* Phương thức thanh toán */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={formData.payment === "cod"}
                onChange={(e) =>
                  setFormData({ ...formData, payment: e.target.value })
                }
              />
              <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="zalopay"
                checked={formData.payment === "zalopay"}
                onChange={(e) =>
                  setFormData({ ...formData, payment: e.target.value })
                }
              />
              <span className="ml-2">ZaloPay</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="momo"
                checked={formData.payment === "momo"}
                onChange={(e) =>
                  setFormData({ ...formData, payment: e.target.value })
                }
              />
              <span className="ml-2">Momo</span>
            </label>
          </div>

          {/* Ghi chú */}
          <div className="mb-4">
            <label className="font-semibold block mb-2">Ghi chú đơn hàng</label>
            <textarea
              className="w-full border rounded-lg p-3"
              placeholder="Ví dụ: Giao giờ hành chính, không gọi sau 21h..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>
        </form>

        {/* Bên phải: Chi tiết đơn hàng */}
        <div className="border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>

          <div className="text-sm mb-2 flex justify-between">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()}đ</span>
          </div>

          <div className="text-sm mb-2 flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{shippingCost.toLocaleString()}đ</span>
          </div>

          <div className="text-sm mb-2 flex justify-between">
            <span>Giảm giá:</span>
            <span>-{discount.toLocaleString()}đ</span>
          </div>

          <div className="font-bold text-lg flex justify-between mb-4">
            <span>Tổng cộng:</span>
            <span className="text-red-600">{total.toLocaleString()}đ</span>
          </div>

          <button
            onClick={handleOrder}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
{/*mẫu chưa sử dụng nha đợi backend xong cái rồi làm gì làm */ }