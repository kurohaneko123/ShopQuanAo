import db from "../config/db.js";
import axios from "axios";
import { queryRefundStatusService } from "./zalopay/ZalopayQueryRefund_Controller.js";
import {
  layHoanTienTheoId,
  capNhatTrangThaiHoanTien,
} from "../models/hoantienModel.js";

export const adminCheckHoanTien = async (req, res) => {
  const { mahoantien } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Lấy bản ghi hoàn tiền (QUA MODEL)
    const hoantien = await layHoanTienTheoId(connection, mahoantien);

    if (!hoantien) {
      await connection.rollback();
      return res.status(404).json({ message: "Không tìm thấy hoàn tiền" });
    }

    if (hoantien.trangthai === "đã hoàn tiền") {
      await connection.rollback();
      return res.json({
        message: "Đơn đã hoàn tiền trước đó",
        hoantien,
      });
    }

    // 2️⃣ Gọi ZaloPay refund-status
    const result = await queryRefundStatusService(hoantien.m_refund_id);
    // CHƯA HOÀN TIỀN → CHỈ TRẢ KẾT QUẢ
    if (result.sub_return_code !== 1) {
      await connection.commit();
      return res.json({
        message: "Hoàn tiền đang xử lý, chưa thể hủy GHN",
        result,
      });
    }

    // 3️⃣ Nếu hoàn tiền xong
    if (result.sub_return_code === 1) {
      await capNhatTrangThaiHoanTien(connection, mahoantien, "đã hoàn tiền");

      await connection.query(
        `
        UPDATE donhang
        SET trangthai = 'đã hoàn tiền',
            ngaycapnhat = NOW()
        WHERE madonhang = ?
        `,
        [hoantien.madonhang]
      );
      // ================== HỦY GHN SAU KHI HOÀN TIỀN ==================
      const [[donhang]] = await connection.query(
        `SELECT * FROM donhang WHERE madonhang = ?`,
        [hoantien.madonhang]
      );

      //  COD thì bỏ qua
      if (
        donhang.hinhthucthanhtoan === "ZALOPAY" &&
        donhang.ghn_order_code
      ) {
        const tt = donhang.trangthai?.toLowerCase() || "";

        //  nếu GHN đang / đã giao thì KHÔNG hủy
        if (!["đang giao hàng", "đã giao hàng"].includes(tt)) {
          try {
            const ghnRes = await axios.post(
              "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel",
              { order_codes: [donhang.ghn_order_code] },
              {
                headers: {
                  ShopId: process.env.GHN_SHOP_ID,
                  Token: process.env.GHN_TOKEN,
                  "Content-Type": "application/json",
                },
              }
            );

            if (ghnRes.data?.code !== 200) {
              throw new Error("GHN không cho phép hủy");
            }
          } catch (ghnErr) {
            console.error(
              "HỦY GHN THẤT BẠI:",
              ghnErr?.response?.data || ghnErr.message
            );
            //  không rollback – tiền đã hoàn rồi
          }
        }
      }
    }
    await connection.commit();

    return res.json({
      message: "Đã kiểm tra trạng thái hoàn tiền",
      result,
    });
  } catch (err) {
    await connection.rollback();
    return res.status(500).json({
      message: "Lỗi máy chủ",
      error: err.message,
    });
  } finally {
    connection.release();
  }
};
