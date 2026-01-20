import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ghnApi from "../apighn/ghnApi"; //  tạo file ghnApi.js như chị hướng dẫn

export default function Checkout() {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [cart, setCart] = useState([]);

  // =========================
  // GHN address data
  // =========================
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // phí ship GHN trả về
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);

  /* =====================================================
   * FORM DATA
   * - Thêm các field tỉnh/quận/phường để CHẶT địa chỉ
   * ===================================================== */
  const [formData, setFormData] = useState({
    tennguoinhan: "",
    sodienthoai: "",
    // địa chỉ sẽ được GHN chuẩn hóa từ dropdown + số nhà/đường
    diachigiao: "",

    // địa chỉ chi tiết (số nhà/đường) - user nhập
    diachi_chitiet: "",

    // id ghép theo GHN
    province_id: "",
    district_id: "",
    ward_code: "",

    ghichu: "",
    hinhthucthanhtoan: "COD",
    donvivanchuyen: "GHN",
  });
  const clearAuthStorage = () => {
    const uid = localStorage.getItem("activeUserId");

    if (uid) {
      localStorage.removeItem(`cart_${uid}`);
    }

    localStorage.removeItem("cart_guest");
    localStorage.removeItem("checkoutPayload");
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("activeUserId");
  };
  // =========================
  // Load checkout payload
  // =========================
  useEffect(() => {
    const raw = localStorage.getItem("checkoutPayload");
    if (!raw) {
      navigate("/");
      return;
    }
    const data = JSON.parse(raw);
    setCart(data.cart || []);
    setCoupon(data.coupon || null);
    setDiscount(data.totals?.discountValue || 0);
  }, [navigate]);

  // =========================
  // auto fill name from user
  // =========================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        tennguoinhan: user.hoten || "",
      }));
    }
  }, []);

  // =========================
  // subtotal
  // =========================
  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + Number(item.giakhuyenmai || 0) * Number(item.soluong || 0),
      0,
    );
  }, [cart]);

  // total
  const total = Math.max(0, subtotal - discount + shippingCost);

  /* =====================================================
   * GHN: load provinces on mount
   * ===================================================== */
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await ghnApi.get("/provinces");
        setProvinces(res.data || []);
      } catch (e) {
        console.error(e);
        Swal.fire(
          "Lỗi!",
          "Không tải được danh sách tỉnh/thành (GHN).",
          "error",
        );
      }
    };
    loadProvinces();
  }, []);

  /* =====================================================
   * Khi chọn TỈNH -> load QUẬN
   * ===================================================== */
  const handleChooseProvince = async (provinceId) => {
    setFormData((prev) => ({
      ...prev,
      province_id: provinceId,
      district_id: "",
      ward_code: "",
    }));
    setDistricts([]);
    setWards([]);
    setShippingCost(0);

    if (!provinceId) return;

    try {
      const res = await ghnApi.get(`/districts?province_id=${provinceId}`);
      setDistricts(res.data || []);
    } catch (e) {
      console.error(e);
      Swal.fire("Lỗi!", "Không tải được danh sách quận/huyện (GHN).", "error");
    }
  };

  /* =====================================================
   * Khi chọn QUẬN -> load PHƯỜNG
   * ===================================================== */
  const handleChooseDistrict = async (districtId) => {
    setFormData((prev) => ({
      ...prev,
      district_id: districtId,
      ward_code: "",
    }));
    setWards([]);
    setShippingCost(0);

    if (!districtId) return;

    try {
      const res = await ghnApi.get(`/wards?district_id=${districtId}`);
      setWards(res.data || []);
    } catch (e) {
      console.error(e);
      Swal.fire("Lỗi!", "Không tải được danh sách phường/xã (GHN).", "error");
    }
  };

  /* =====================================================
   * Ghép địa chỉ chuẩn để lưu vào formData.diachigiao
   * ===================================================== */
  const buildFullAddress = (next = formData) => {
    const p = provinces.find(
      (x) => String(x.ProvinceID) === String(next.province_id),
    );
    const d = districts.find(
      (x) => String(x.DistrictID) === String(next.district_id),
    );
    const w = wards.find((x) => String(x.WardCode) === String(next.ward_code));

    // số nhà/đường là optional nhưng nên có
    const detail = (next.diachi_chitiet || "").trim();

    // format: "Số nhà..., Phường..., Quận..., Tỉnh..."
    const parts = [
      detail || null,
      w ? w.WardName : null,
      d ? d.DistrictName : null,
      p ? p.ProvinceName : null,
    ].filter(Boolean);

    return parts.join(", ");
  };

  /* =====================================================
   * Khi chọn PHƯỜNG -> gọi GHN fee
   * ===================================================== */
  const handleChooseWard = async (wardCode) => {
    const next = { ...formData, ward_code: wardCode };
    setFormData(next);
    setShippingCost(0);

    if (!next.district_id || !wardCode) return;

    // Ghép địa chỉ hiển thị
    const fullAddress = buildFullAddress(next);
    setFormData((prev) => ({ ...prev, diachigiao: fullAddress }));

    // gọi fee
    try {
      setShippingLoading(true);

      const weight = 800; //
      const insurance_value = Number(subtotal || 0);
      const res = await ghnApi.post("/fee", {
        to_district_id: Number(next.district_id),
        to_ward_code: String(wardCode),
        weight,
        insurance_value,
        service_type_id: 2,
      });

      // GHN trả về: total
      const fee = Number(res.data?.total || 0);
      setShippingCost(fee);
    } catch (e) {
      console.error(e);
      setShippingCost(20000);
    } finally {
      setShippingLoading(false);
    }
  };

  /* =====================================================
   * Validate
   * ===================================================== */
  const validateForm = () => {
    if (!formData.tennguoinhan.trim()) {
      Swal.fire("Lỗi!", "Vui lòng nhập họ tên người nhận", "error");
      return false;
    }

    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    if (!phoneRegex.test(formData.sodienthoai.trim())) {
      Swal.fire("Lỗi!", "Số điện thoại không hợp lệ ", "error");
      return false;
    }

    //  địa chỉ bắt buộc chọn đủ tỉnh/quận/phường
    if (!formData.province_id || !formData.district_id || !formData.ward_code) {
      Swal.fire(
        "Lỗi!",
        "Vui lòng chọn đầy đủ Tỉnh/Quận/Phường để giao hàng.",
        "error",
      );
      return false;
    }

    // bắt buộc có phí ship GHN tính được (tránh spam)
    if (shippingCost <= 0) {
      Swal.fire(
        "Lỗi!",
        "Chưa tính được phí vận chuyển. Vui lòng chọn lại địa chỉ.",
        "error",
      );
      return false;
    }

    if (!cart.length) {
      Swal.fire("Lỗi!", "Giỏ hàng đang trống", "error");
      return false;
    }

    return true;
  };
  // Tạo vận đơn GHN theo đơn hàng vừa tạo (orderId)
  const createGhnShipping = async ({ orderId, payloadOrder }) => {
    // payloadOrder là payload em đã gửi qua /api/donhang/them (để lấy thông tin người nhận + cart)
    // build items GHN từ cart
    const items = cart.map((it) => {
      const price = Number(it.giakhuyenmai ?? it.giagoc ?? 0); //  lấy giá bán
      return {
        name: it.tensanpham || "Sản phẩm",
        quantity: Number(it.soluong || 1),
        weight: Number(it.weight || 300),
        price: Math.max(0, Math.round(price)), //  GHN cần số nguyên VND
      };
    });

    const totalWeight = items.reduce(
      (sum, it) => sum + it.weight * it.quantity,
      0,
    );

    // payload gửi BE /api/ghn/create-order
    const ghnPayload = {
      madonhang: orderId, //  bắt buộc để BE update DB

      to_name: payloadOrder.tennguoinhan,
      to_phone: payloadOrder.sodienthoai,
      to_address: payloadOrder.diachigiao,

      //  ĐÚNG KEY GHN
      to_district_id: Number(payloadOrder.district_id),
      to_ward_code: String(payloadOrder.ward_code),

      weight: Math.max(100, totalWeight),
      insurance_value: Number(
        payloadOrder.tongthanhtoan || payloadOrder.tongtien || 0,
      ),
      cod_amount:
        payloadOrder.hinhthucthanhtoan === "COD"
          ? Number(payloadOrder.tongthanhtoan || payloadOrder.tongtien || 0)
          : 0,
      items,
    };

    const res = await axios.post(
      "http://localhost:5000/api/ghn/create-order",
      ghnPayload,
    );

    return res.data; // BE trả { saved: {ghn_order_code, ghn_fee}, ... }
  };

  /* =====================================================
   * Submit order (giữ logic của anh)
   * ===================================================== */
  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("userinfo"));
      if (!user) {
        Swal.fire("Lỗi!", "Bạn chưa đăng nhập!", "error");
        return;
      }

      if (!validateForm()) return;

      //  update diachigiao lần cuối (nếu user đổi số nhà/đường)
      const finalAddress = buildFullAddress(formData);
      const payload = {
        manguoidung: user.manguoidung,
        tennguoinhan: formData.tennguoinhan.trim(),
        sodienthoai: formData.sodienthoai.trim(),
        diachigiao: finalAddress, // lưu địa chỉ chuẩn

        // optional: lưu thêm meta GHN (nếu BE muốn)
        to_province_id: formData.province_id,
        to_district_id: formData.district_id,
        to_ward_code: formData.ward_code,

        ghichu: formData.ghichu.trim(),
        donvivanchuyen: "GHN",
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

      const res = await axios.post(
        "http://localhost:5000/api/donhang/them",
        payload,
      );

      const orderId = res.data?.madonhang;
      localStorage.setItem("lastOrderId", String(orderId));
      if (!orderId) {
        Swal.fire("Lỗi!", "Không lấy được mã đơn hàng!", "error");
        return;
      }
      // Sau khi tạo đơn nội bộ thành công -> tạo vận đơn GHN và lưu DB
      let ghnSaved = null;

      try {
        Swal.fire({
          title: "Đang tạo vận đơn GHN...",
          text: "Vui lòng chờ xíu nha ",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const ghnRes = await createGhnShipping({
          orderId,
          payloadOrder: {
            tennguoinhan: payload.tennguoinhan,
            sodienthoai: payload.sodienthoai,
            diachigiao: payload.diachigiao,
            district_id: payload.to_district_id,
            ward_code: payload.to_ward_code,
            tongtien: payload.tongtien,
            tongthanhtoan: payload.tongthanhtoan,
            hinhthucthanhtoan: payload.hinhthucthanhtoan,
          },
        });

        ghnSaved = ghnRes?.saved || null;

        Swal.fire({
          icon: "success",
          title: "Tạo vận đơn GHN thành công!",
          text: `Mã GHN: ${ghnSaved?.ghn_order_code || "—"}`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("GHN create-order FE error:", err?.response?.data || err);

        //  Quan trọng: GHN fail thì vẫn cho đặt hàng (vì đơn nội bộ đã tạo)
        Swal.fire({
          icon: "warning",
          title: "Đơn đã tạo nhưng GHN lỗi",
        });
      }

      // COD
      if (formData.hinhthucthanhtoan === "COD") {
        localStorage.removeItem("checkoutPayload");

        const uid = localStorage.getItem("activeUserId");
        const cartKey = uid ? `cart_${uid}` : "cart_guest";
        localStorage.removeItem(cartKey);
        localStorage.setItem("lastOrderId", String(orderId));

        localStorage.setItem("lastPaymentMethod", "COD");
        navigate("/ordersuccess", { state: { orderId, paymentMethod: "COD" } });
        return;
      }

      // ZALOPAY
      if (formData.hinhthucthanhtoan === "ZALOPAY") {
        try {
          const zaloRes = await axios.post(
            "http://localhost:5000/api/payment/zalopay/create",
            {
              madonhang: orderId,
              tongthanhtoan: total,
            },
          );

          const payUrl =
            zaloRes.data?.order_url ||
            zaloRes.data?.orderurl ||
            zaloRes.data?.zp_trans_url ||
            zaloRes.data?.orderUrl;

          if (!payUrl) {
            console.error("BE trả về:", zaloRes.data);
            Swal.fire(
              "Lỗi!",
              "Không lấy được link thanh toán ZaloPay!",
              "error",
            );
            return;
          }

          localStorage.setItem("lastZaloOrderId", String(orderId));
          localStorage.setItem("lastPaymentMethod", "ZALOPAY");

          window.open(payUrl, "_blank");
          navigate("/ordersuccess", {
            state: { orderId, paymentMethod: "ZALOPAY" },
          });
          return;
        } catch (error) {
          console.error("ZaloPay error:", error);
          Swal.fire("Lỗi!", "Không thể tạo thanh toán ZaloPay!", "error");
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi tạo đơn:", err?.response?.data || err);

      const message = err?.response?.data?.message || "Không thể tạo đơn hàng!";

      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: message,
      });
    }
  };

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

          {/* Địa chỉ GHN: Tỉnh */}
          <select
            className="w-full border rounded-lg p-3 mb-3 bg-white"
            value={formData.province_id}
            onChange={(e) => handleChooseProvince(e.target.value)}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>

          {/*  Quận */}
          <select
            className="w-full border rounded-lg p-3 mb-3 bg-white"
            value={formData.district_id}
            onChange={(e) => handleChooseDistrict(e.target.value)}
            disabled={!formData.province_id}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
          </select>

          {/* Phường */}
          <select
            className="w-full border rounded-lg p-3 mb-3 bg-white"
            value={formData.ward_code}
            onChange={(e) => handleChooseWard(e.target.value)}
            disabled={!formData.district_id}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </option>
            ))}
          </select>

          {/*  Số nhà/đường */}
          <input
            type="text"
            placeholder="Số nhà, tên đường"
            className="w-full border rounded-lg p-3 mb-3"
            value={formData.diachi_chitiet}
            // 1. Chỉ set state khi gõ
            onChange={(e) => {
              const value = e.target.value.normalize("NFC");
              setFormData({ ...formData, diachi_chitiet: value });
            }}
            // 2. Validate khi user gõ XONG (blur)
            onBlur={() => {
              const value = formData.diachi_chitiet;

              const ADDRESS_REGEX = /^[\p{L}\p{M}0-9\s,./\-()#:+'’–]+$/u;

              if (value && !ADDRESS_REGEX.test(value)) {
                Swal.fire({
                  icon: "warning",
                  title: "Địa chỉ không hợp lệ",
                  text: "Chỉ được nhập chữ (kể cả tiếng Việt), số và các ký tự , . / - ( )",
                });
              }
            }}
          />

          {/* Hiển thị địa chỉ ghép */}
          <div className="text-sm text-slate-600 mb-3">
            <span className="font-semibold">Địa chỉ:</span>{" "}
            {formData.diachigiao ? formData.diachigiao : "Chưa hoàn tất"}
          </div>

          {/* Shipping info */}
          <div className="border p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">Vận chuyển (GHN)</h3>
            <div className="text-sm flex items-center justify-between">
              <span>Phí vận chuyển:</span>
              <span>
                {shippingLoading
                  ? "Đang tính..."
                  : `${shippingCost.toLocaleString()}đ`}
              </span>
            </div>
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
            maxLength={150}
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
            disabled={shippingLoading}
          >
            {shippingLoading ? "Đang tính phí ship..." : "Đặt hàng"}
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
            <span>Phí vận chuyển (GHN):</span>
            <span>
              {shippingLoading
                ? "Đang tính..."
                : `${shippingCost.toLocaleString()}đ`}
            </span>
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
