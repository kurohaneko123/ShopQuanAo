import axios from "axios";
import CryptoJS from "crypto-js";
import db from "../../config/db.js";

/* =========================================================
   API: ADMIN CHECK REFUND (DÙNG CHO POSTMAN / FE GỌI TRỰC TIẾP)
   POST /api/hoantien/admin/check?refund_id=xxx
========================================================= */
export const ZaloPayQueryRefund = async (req, res) => {
  try {
    const { refund_id } = req.query; // = m_refund_id

    if (!refund_id) {
      return res.status(400).json({ message: "Thiếu refund_id" });
    }

    /* ================= CONFIG ================= */
    const app_id = Number(process.env.ZALO_APP_ID);
    const key1 = process.env.ZALO_KEY1;
    const timestamp = Date.now();

    const params = {
      app_id,
      m_refund_id: refund_id,
      timestamp,
    };

    const macData = `${params.app_id}|${params.m_refund_id}|${params.timestamp}`;
    params.mac = CryptoJS.HmacSHA256(macData, key1).toString();

    /* ================= GỌI ZALOPAY ================= */
    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/query_refund",
      new URLSearchParams(params).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const result = response.data;

    /* ================= LẤY BẢN GHI HOÀN TIỀN ================= */
    const [[refund]] = await db.query(
      `SELECT * FROM hoantien WHERE m_refund_id = ?`,
      [refund_id]
    );

    if (!refund) {
      return res.status(404).json({
        message: "Không tìm thấy bản ghi hoàn tiền",
        refund_id,
        result,
      });
    }

    /* ================= XỬ LÝ TRẠNG THÁI (FIX CHÍ MẠNG) ================= */

    // ✅ HOÀN TIỀN THÀNH CÔNG
    if (result.sub_return_code === 1) {
      await db.query(
        `UPDATE hoantien
                 SET trangthai = 'thanh_cong',
                     phanhoi_zalopay = ?,
                     ngaycapnhat = NOW()
                 WHERE m_refund_id = ?`,
        [JSON.stringify(result), refund_id]
      );

      await db.query(
        `UPDATE donhang
                 SET trangthai = 'đã hoàn tiền',
                     dathanhtoan = 0
                 WHERE madonhang = ?`,
        [refund.madonhang]
      );

      // 🔁 HOÀN KHO
      const [items] = await db.query(
        `SELECT mabienthe, soluong
                 FROM chitietdonhang
                 WHERE madonhang = ?`,
        [refund.madonhang]
      );

      for (const item of items) {
        await db.query(
          `UPDATE bienthesanpham
                     SET soluongton = soluongton + ?
                     WHERE mabienthe = ?`,
          [item.soluong, item.mabienthe]
        );
      }
    }

    // 🟡 ĐANG XỬ LÝ
    else if (result.sub_return_code === 3) {
      await db.query(
        `UPDATE hoantien
                 SET trangthai = 'dang_xu_ly',
                     phanhoi_zalopay = ?,
                     ngaycapnhat = NOW()
                 WHERE m_refund_id = ?`,
        [JSON.stringify(result), refund_id]
      );

      await db.query(
        `UPDATE donhang
                 SET trangthai = 'đang hoàn tiền'
                 WHERE madonhang = ?`,
        [refund.madonhang]
      );
    }

    // ❌ THẤT BẠI
    else {
      await db.query(
        `UPDATE hoantien
                 SET trangthai = 'that_bai',
                     phanhoi_zalopay = ?,
                     ngaycapnhat = NOW()
                 WHERE m_refund_id = ?`,
        [JSON.stringify(result), refund_id]
      );
    }

    return res.json({
      message: "Đã kiểm tra trạng thái hoàn tiền",
      result,
    });
  } catch (err) {
    console.error("Query refund error:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Lỗi check refund",
      detail: err?.response?.data || err.message,
    });
  }
};

/* =========================================================
   SERVICE: DÙNG CHO CONTROLLER KHÁC GỌI
========================================================= */
export const queryRefundStatusService = async (refund_id) => {
  if (!refund_id) {
    throw new Error("Thiếu refund_id");
  }

  const app_id = Number(process.env.ZALO_APP_ID);
  const key1 = process.env.ZALO_KEY1;
  const timestamp = Date.now();

  const params = {
    app_id,
    m_refund_id: refund_id,
    timestamp,
  };

  const macData = `${app_id}|${refund_id}|${timestamp}`;
  params.mac = CryptoJS.HmacSHA256(macData, key1).toString();

  const response = await axios.post(
    "https://sb-openapi.zalopay.vn/v2/query_refund",
    new URLSearchParams(params).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};
