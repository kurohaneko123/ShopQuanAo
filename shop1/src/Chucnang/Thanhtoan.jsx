import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* =====================================================
 * 1. HÀM LẤY MÃ BIẾN THỂ TỪ SKU (FE ONLY)
 *    - TẠM THỜI: nếu sku dạng "SP-21" → trả về 21
 *    - Nếu format khác thì anh chỉnh lại trong hàm này
 * ===================================================== */
// Lấy biến thể đúng size + màu từ backend
const fetchVariantId = async (productId, size, color) => {
  try {
    const res = await axios.get(`${API_SANPHAM}/${productId}`);
    const variants = res.data.bienthe.find((v) => v.mabienthe === variantId);

    const match = variants.find(
      (v) =>
        String(v.kichthuoc).toLowerCase() === String(size).toLowerCase() &&
        String(v.mausac).toLowerCase() === String(color).toLowerCase()
    );

    return match ? match.mabienthe : null;
  } catch (err) {
    console.error("Lỗi fetch biến thể:", err);
    return null;
  }
};

const fetchVariantBySku = async (sku) => {
  if (!sku) return null;

  // 👉 Trường hợp SKU dạng "SP-21" → lấy số 21
  const id = Number(String(sku).replace(/\D/g, ""));
  if (!id) return null;

  // Ở đây chị cho FE dùng luôn số đó làm mabienthe
  // (giả sử bảng bienthesanpham.mabienthe trùng với số trong SKU)
  return id;
};

export default function Checkout() {
  const navigate = useNavigate();

  /* =====================================================
   * 2. STATE FORM – KHỞI TẠO KHÔNG BỊ NULL
   * ===================================================== */
  const [formData, setFormData] = useState({
    tennguoinhan: "",
    sodienthoai: "",
    diachigiao: "",
    ghichu: "",
    hinhthucthanhtoan: "COD",
    donvivanchuyen: "Tiêu chuẩn",
  });

  const [cart, setCart] = useState([]);

  /* =====================================================
   * 3. LOAD CART TỪ LOCALSTORAGE – CHUẨN HÓA DỮ LIỆU
   * ===================================================== */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (!stored) return;

      const parsed = JSON.parse(stored);

      const normalized = parsed.map((it) => ({
        // giữ lại sku để convert sang mabienthe
        sku: it.sku,
        mabienthe: it.mabienthe || it.id || null,
        tensanpham: it.tensanpham || it.name || "Sản phẩm",
        giakhuyenmai: Number(it.giakhuyenmai || it.price || 0),
        soluong: Number(it.soluong || it.qty || 1),
        mausac: it.mausac || it.color || "",
        size: it.size || "",
        hinhanh: it.hinhanh || it.img || "/img/placeholder.png",
        giagoc: Number(it.giagoc || it.price || 0),
      }));

      setCart(normalized);
    } catch (error) {
      console.error("Lỗi load giỏ hàng:", error);
      setCart([]);
    }
  }, []);

  /* =====================================================
   * 4. TÍNH TIỀN – CHỐNG NaN
   * ===================================================== */
  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.giakhuyenmai || 0) * Number(item.soluong || 0);
  }, 0);

  const shippingCost = formData.donvivanchuyen === "Giao nhanh" ? 40000 : 20000;
  const total = subtotal + shippingCost;

  /* =====================================================
   * 5. VALIDATE FORM – KHÔNG ĐỂ GIÁ TRỊ RỖNG / NULL
   * ===================================================== */
  const validateForm = () => {
    if (!formData.tennguoinhan.trim()) {
      alert("Vui lòng nhập họ tên người nhận");
      return false;
    }
    if (!formData.sodienthoai.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.diachigiao.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    if (!cart.length) {
      alert("Giỏ hàng đang trống");
      return false;
    }
    return true;
  };

  /* =====================================================
   * 6. GỬI ĐƠN HÀNG
   *    - Có await Promise.all map cart
   *    - Chắc chắn không gửi null cho mabienthe, tennguoinhan, v.v.
   * ===================================================== */
  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      if (!validateForm()) return;

      const payload = {
        manguoidung: user.manguoidung,
        tennguoinhan: formData.tennguoinhan.trim(),
        sodienthoai: formData.sodienthoai.trim(),
        diachigiao: formData.diachigiao.trim(),
        ghichu: formData.ghichu.trim(),
        donvivanchuyen: formData.donvivanchuyen,
        hinhthucthanhtoan: formData.hinhthucthanhtoan,
        tongtien: subtotal,
        phivanchuyen: shippingCost,
        tongthanhtoan: total,

        danhsach: await Promise.all(
          cart.map(async (item) => ({
            mabienthe: await fetchVariantId(item.id, item.size, item.color),
            soluong: item.qty,
            giagoc: item.price,
            giakhuyenmai: item.price,
          }))
        ),
      };

      // Lưu thử payload để debug nếu cần
      localStorage.setItem("checkoutPayload", JSON.stringify(payload));

      await axios.post("http://localhost:5000/api/donhang/them", payload);

      alert("Đặt hàng thành công!");
      localStorage.removeItem("cart");
      navigate("/donhang");
    } catch (err) {
      console.error("Lỗi tạo đơn:", err);
      alert("Không thể tạo đơn hàng!");
    }
  };

  /* =====================================================
   * 7. JSX RENDER
   * ===================================================== */
  return (
    <div className="min-h-screen bg-white text-black mt-32 px-8">
      <div className="flex items-center justify-end mb-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          ← TIẾP TỤC MUA SẮM
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form trái */}
        <form
          onSubmit={handleOrder}
          className="border rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>

          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.tennguoinhan}
            onChange={(e) =>
              setFormData({ ...formData, tennguoinhan: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.sodienthoai}
            onChange={(e) =>
              setFormData({ ...formData, sodienthoai: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Địa chỉ giao hàng"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.diachigiao}
            onChange={(e) =>
              setFormData({ ...formData, diachigiao: e.target.value })
            }
            required
          />

          {/* Shipping */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">Phương thức giao hàng</h3>

            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="shipping"
                value="Tiêu chuẩn"
                checked={formData.donvivanchuyen === "Tiêu chuẩn"}
                onChange={(e) =>
                  setFormData({ ...formData, donvivanchuyen: e.target.value })
                }
              />
              <span className="ml-2">Giao hàng tiêu chuẩn - 20.000đ</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="Giao nhanh"
                checked={formData.donvivanchuyen === "Giao nhanh"}
                onChange={(e) =>
                  setFormData({ ...formData, donvivanchuyen: e.target.value })
                }
              />
              <span className="ml-2">Giao nhanh - 40.000đ</span>
            </label>
          </div>

          {/* Payment */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>

            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={formData.hinhthucthanhtoan === "COD"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hinhthucthanhtoan: e.target.value,
                  })
                }
              />
              <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
            </label>

            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="ZALOPAY"
                checked={formData.hinhthucthanhtoan === "ZALOPAY"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hinhthucthanhtoan: e.target.value,
                  })
                }
              />
              <span className="ml-2">ZaloPay</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="MOMO"
                checked={formData.hinhthucthanhtoan === "MOMO"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hinhthucthanhtoan: e.target.value,
                  })
                }
              />
              <span className="ml-2">Momo</span>
            </label>
          </div>

          <textarea
            placeholder="Ghi chú đơn hàng..."
            className="w-full border rounded-lg p-3"
            value={formData.ghichu}
            onChange={(e) =>
              setFormData({ ...formData, ghichu: e.target.value })
            }
          />

          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold mt-4">
            Đặt hàng
          </button>
        </form>

        {/* Bên phải */}
        <div className="border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>

          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-4">
              <div className="flex gap-3">
                <img
                  src={item.hinhanh}
                  className="w-14 h-14 rounded border object-cover"
                />
                <div className="text-sm">
                  <p className="font-semibold">{item.tensanpham}</p>
                  <p className="text-gray-500 text-xs">
                    {item.mausac} • {item.size}
                  </p>
                </div>
              </div>

              <div>
                {item.soluong} × {item.giakhuyenmai.toLocaleString()}đ
              </div>
            </div>
          ))}

          <div className="flex justify-between text-sm mb-2">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()}đ</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Phí vận chuyển:</span>
            <span>{shippingCost.toLocaleString()}đ</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span className="text-red-600">{total.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
