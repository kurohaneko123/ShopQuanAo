import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
/* =====================================================
 * 1. HÀM LẤY MÃ BIẾN THỂ TỪ SKU (FE ONLY)
 *    - TẠM THỜI: nếu sku dạng "SP-21" → trả về 21
 *    - Nếu format khác thì anh chỉnh lại trong hàm này
 * ===================================================== */
// Lấy biến thể đúng size + màu từ backend

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
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("checkoutPayload");

    if (!raw) {
      // Không có payload → không cho vào checkout
      navigate("/");
      return;
    }

    const data = JSON.parse(raw);

    setCart(data.cart || []);
    setCoupon(data.coupon || null);
    setDiscount(data.totals?.discountValue || 0);
  }, [navigate]);

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

  /* =====================================================
   * 4. TÍNH TIỀN – CHỐNG NaN
   * ===================================================== */
  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.giakhuyenmai || 0) * Number(item.soluong || 0);
  }, 0);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        tennguoinhan: user.hoten || "", // Tự điền tên người nhận từ thông tin khách hàng
      }));
    }
  }, []);

  const shippingCost = formData.donvivanchuyen === "Giao nhanh" ? 40000 : 20000;
  const total = Math.max(0, subtotal - discount + shippingCost);

  /* =====================================================
   * 5. VALIDATE FORM – KHÔNG ĐỂ GIÁ TRỊ RỖNG / NULL
   * ===================================================== */
  const validateForm = () => {
    // Kiểm tra tên người nhận
    if (!formData.tennguoinhan.trim()) {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập họ tên người nhận",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Kiểm tra số điện thoại (chỉ cho phép nhập số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.sodienthoai.trim()) {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập số điện thoại",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    } else if (!phoneRegex.test(formData.sodienthoai)) {
      Swal.fire({
        title: "Lỗi!",
        text: "Số điện thoại không hợp lệ, vui lòng nhập lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Kiểm tra địa chỉ giao hàng
    // const addressRegex = /^\d+\s[\w\s]+,\s*Phường\s[\w\s]+,\s*Quận\s[\w\s]+$/;

    // if (
    //   !formData.diachigiao.trim() ||
    //   !addressRegex.test(formData.diachigiao)
    // ) {
    //   Swal.fire({
    //     title: "Lỗi!",
    //     text: "Vui lòng nhập địa chỉ giao hàng đúng",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return false;
    // }

    // Kiểm tra giỏ hàng có sản phẩm không
    if (!cart.length) {
      Swal.fire({
        title: "Lỗi!",
        text: "Giỏ hàng đang trống",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  /* =====================================================
   * 6. GỬI ĐƠN HÀNG + ZALOPAY
   * ===================================================== */
  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        Swal.fire({
          title: "Lỗi!",
          text: "Bạn chưa đăng nhập!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!validateForm()) return; // Kiểm tra form trước khi tiếp tục

      // ===== CHUẨN BỊ DỮ LIỆU ĐƠN HÀNG =====
      const payload = {
        manguoidung: user.manguoidung,
        tennguoinhan: formData.tennguoinhan.trim(),
        sodienthoai: formData.sodienthoai.trim(),
        diachigiao: formData.diachigiao.trim(),
        ghichu: formData.ghichu.trim(),
        donvivanchuyen: formData.donvivanchuyen,
        hinhthucthanhtoan: formData.hinhthucthanhtoan,

        magiamgia: coupon?.code || null,
        giamgia: discount,

        tongtien: subtotal,
        phivanchuyen: shippingCost,
        tongthanhtoan: total,

        danhsach: cart.map((item) => ({
          mabienthe: item.mabienthe,
          soluong: item.soluong,
          giagoc: item.giagoc,
          giakhuyenmai: item.giakhuyenmai,
        })),
      };

      // ===== 1) GỬI ĐƠN LÊN BACKEND =====
      const res = await axios.post(
        "http://localhost:5000/api/donhang/them",
        payload
      );

      const orderId = res.data?.madonhang;
      if (!orderId) {
        Swal.fire({
          title: "Lỗi!",
          text: "Không lấy được mã đơn hàng!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // ============================
      // ======= 2) COD ============
      // ============================
      if (formData.hinhthucthanhtoan === "COD") {
        // ✅ clear đúng dữ liệu
        localStorage.removeItem("checkoutPayload");

        const uid = localStorage.getItem("activeUserId");
        const cartKey = uid ? `cart_${uid}` : "cart_guest";
        localStorage.removeItem(cartKey);

        // ✅ lưu lại để refresh vẫn thấy
        localStorage.setItem("lastOrderId", String(orderId));
        localStorage.setItem("lastPaymentMethod", "COD");

        // ✅ chuyển sang trang success
        navigate("/ordersuccess", {
          state: { orderId, paymentMethod: "COD" },
        });
        return;
      }

      // ============================
      // ====== 3) ZALOPAY =========
      // ============================
      if (formData.hinhthucthanhtoan === "ZALOPAY") {
        try {
          const zaloRes = await axios.post(
            "http://localhost:5000/api/payment/zalopay/create",
            {
              madonhang: orderId,
              tongthanhtoan: total,
            }
          );

          const payUrl =
            zaloRes.data?.order_url ||
            zaloRes.data?.orderurl ||
            zaloRes.data?.zp_trans_url ||
            zaloRes.data?.orderUrl;

          if (!payUrl) {
            console.error("BE trả về:", zaloRes.data);
            Swal.fire({
              title: "Lỗi!",
              text: "Không lấy được link thanh toán ZaloPay!",
              icon: "error",
              confirmButtonText: "OK",
            });
            return;
          }

          // ✅ LƯU TRẠNG THÁI ĐỂ ORDER SUCCESS DÙNG
          localStorage.setItem("lastZaloOrderId", String(orderId));
          localStorage.setItem("lastPaymentMethod", "ZALOPAY");

          // ✅ MỞ ZALOPAY Ở TAB MỚI
          window.open(payUrl, "_blank");

          // ✅ Ở TAB HIỆN TẠI → ĐI TỚI ORDER SUCCESS
          navigate("/ordersuccess", {
            state: { orderId, paymentMethod: "ZALOPAY" },
          });

          return;
        } catch (error) {
          console.error("ZaloPay error:", error);
          Swal.fire({
            title: "Lỗi!",
            text: "Không thể tạo thanh toán ZaloPay!",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi tạo đơn:", err);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tạo đơn hàng!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
                className="accent-[rgb(96,148,216)]"
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
                className="accent-[rgb(96,148,216)]"
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
                className="accent-[rgb(96,148,216)]"
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
                className="accent-[rgb(96,148,216)]"
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
                className="accent-[rgb(96,148,216)]"
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

          <button
            className="
  w-full bg-[rgb(96,148,216)] text-white
  py-3 rounded-xl font-semibold mt-4
  hover:bg-[rgb(72,128,204)]
  transition shadow
"
          >
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
                {item.soluong} ×{" "}
                {Number(item.giakhuyenmai || 0).toLocaleString()}đ
              </div>
            </div>
          ))}

          <div className="flex justify-between text-sm mb-2">
            <span>Giảm giá:</span>
            <span className="text-red-600">-{discount.toLocaleString()}đ</span>
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
