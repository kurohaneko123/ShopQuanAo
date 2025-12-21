// backend/src/controllers/ghnController.js
import db from "../config/db.js";
import ghnClient from "../services/ghnClient.js";

/**
 * 1) Lấy danh sách tỉnh/thành
 * GHN: GET /master-data/province
 */
export const getProvinces = async (req, res) => {
  try {
    const { data } = await ghnClient.get("/master-data/province");
    return res.json(data.data || []);
  } catch (err) {
    console.error(
      "GHN getProvinces error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: "Không lấy được danh sách tỉnh (GHN)" });
  }
};

/**
 * 2) Lấy danh sách quận/huyện theo province_id
 * GHN: POST /master-data/district
 */
export const getDistricts = async (req, res) => {
  try {
    const province_id = Number(req.query.province_id);
    if (!province_id) {
      return res.status(400).json({ message: "Thiếu province_id" });
    }

    const { data } = await ghnClient.post("/master-data/district", {
      province_id,
    });
    return res.json(data.data || []);
  } catch (err) {
    console.error(
      "GHN getDistricts error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: "Không lấy được danh sách quận (GHN)" });
  }
};

/**
 * 3) Lấy danh sách phường/xã theo district_id
 * GHN: POST /master-data/ward
 */
export const getWards = async (req, res) => {
  try {
    const district_id = Number(req.query.district_id);
    if (!district_id) {
      return res.status(400).json({ message: "Thiếu district_id" });
    }

    const { data } = await ghnClient.post("/master-data/ward", { district_id });
    return res.json(data.data || []);
  } catch (err) {
    console.error("GHN getWards error:", err?.response?.data || err.message);
    return res
      .status(500)
      .json({ message: "Không lấy được danh sách phường (GHN)" });
  }
};

/**
 * 4) Tính phí ship
 * GHN: POST /v2/shipping-order/fee
 *
 * Inputs:
 * - to_district_id (number)
 * - to_ward_code (string)
 * - weight (gram) (optional)
 * - insurance_value (optional)
 * - service_type_id (2: thường/road, 1/?? tùy GHN cấu hình)
 */
export const calcFee = async (req, res) => {
  try {
    const {
      to_district_id,
      to_ward_code,
      weight = 500,
      insurance_value = 0,
      service_type_id = 2,
    } = req.body;

    if (!to_district_id || !to_ward_code) {
      return res
        .status(400)
        .json({ message: "Thiếu to_district_id hoặc to_ward_code" });
    }

    const from_district_id = Number(process.env.GHN_FROM_DISTRICT_ID);
    const from_ward_code = String(process.env.GHN_FROM_WARD_CODE || "");

    if (!from_district_id || !from_ward_code) {
      return res.status(500).json({
        message:
          "Chưa cấu hình GHN_FROM_DISTRICT_ID / GHN_FROM_WARD_CODE trong .env",
      });
    }

    const payload = {
      from_district_id,
      from_ward_code,
      to_district_id: Number(to_district_id),
      to_ward_code: String(to_ward_code),
      weight: Number(weight),
      insurance_value: Number(insurance_value),
      service_type_id: Number(service_type_id),
    };

    const { data } = await ghnClient.post("/v2/shipping-order/fee", payload);

    // GHN trả: data.data.total ... (tổng phí)
    return res.json(data.data);
  } catch (err) {
    console.error("GHN calcFee error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Không tính được phí ship (GHN)" });
  }
};
export const createGhnOrder = async (req, res) => {
  try {
    const {
      madonhang, // ✅ bắt buộc để lưu vào bảng donhang
      order_code, // (optional) mã đơn nội bộ dạng string nếu em thích
      to_name,
      to_phone,
      to_address,
      to_ward_code,
      to_district_id,
      weight,
      insurance_value,
      cod_amount,
      items,
    } = req.body;

    if (!madonhang) {
      return res
        .status(400)
        .json({ message: "Thiếu madonhang để lưu GHN vào DB" });
    }
    const safeItems = (items || []).map((it) => ({
      name: it?.name || "Sản phẩm",
      quantity: Number(it?.quantity || 1),
      weight: Number(it?.weight || 300),
      price: Math.max(0, Math.round(Number(it?.price || 0))), // ✅ ép price
    }));

    if (!safeItems.length) {
      return res.status(400).json({ message: "Thiếu items để tạo đơn GHN" });
    }

    // payload gửi GHN (giữ như em đang làm)
    const payload = {
      payment_type_id: 2,
      note: "KhongchoXemHang",
      required_note: "KHONGCHOXEMHANG",

      from_name: "ShopQuanAo",
      from_phone: "0911223877",
      from_address: "Kho ShopQuanAo",
      from_ward_code: process.env.GHN_FROM_WARD_CODE,
      from_district_id: Number(process.env.GHN_FROM_DISTRICT_ID),

      to_name,
      to_phone,
      to_address,
      to_ward_code,
      to_district_id,

      weight: Number(weight),
      insurance_value: Number(insurance_value || 0),
      cod_amount: Number(cod_amount || 0), // ✅ thêm

      service_type_id: 2,
      items: safeItems, // ✅ đổi

      order_code: order_code || String(madonhang),
    };

    const { data } = await ghnClient.post("/v2/shipping-order/create", payload);

    const ghnOrderCode = data?.data?.order_code; // VD: LKRYPU
    const ghnFee = data?.data?.fee?.main_service ?? 0; // phí service
    // (tuỳ em) nếu GHN trả total_fee thì ưu tiên total_fee
    // const ghnFee = data?.data?.total_fee ?? data?.data?.fee?.main_service ?? 0;

    if (!ghnOrderCode) {
      return res.status(500).json({
        message: "GHN không trả order_code, không lưu DB được",
        raw: data,
      });
    }

    // ✅ LƯU VÀO BẢNG donhang (đúng theo ảnh DB của em)
    await db.query(
      `UPDATE donhang
       SET ghn_order_code = ?, ghn_fee = ?, donvivanchuyen = 'GHN', phivanchuyen = ?
       WHERE madonhang = ?`,
      [ghnOrderCode, Number(ghnFee), Number(ghnFee), Number(madonhang)]
    );

    return res.json({
      message: "Tạo đơn GHN thành công + đã lưu DB (donhang)",
      ghn: data.data,
      saved: { madonhang, ghn_order_code: ghnOrderCode, ghn_fee: ghnFee },
    });
  } catch (err) {
    console.error(
      "GHN create order error:",
      err?.response?.data || err.message
    );
    return res.status(500).json({
      message: "Không tạo được đơn GHN",
      error: err?.response?.data || err.message,
    });
  }
};
