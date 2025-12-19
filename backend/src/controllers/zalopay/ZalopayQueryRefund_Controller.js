import axios from "axios";
import CryptoJS from "crypto-js";

export const ZaloPayQueryRefund = async (req, res) => {
    try {
        const { refund_id } = req.query; // refund_id (m_refund_id)
        if (!refund_id) {
            return res.status(400).json({ message: "Thiếu refund_id" });
        }

        const app_id = process.env.ZALO_APP_ID;
        const timestamp = Date.now();

        // ✅ MAC chuẩn: app_id|m_refund_id|timestamp
        const macData = `${app_id}|${refund_id}|${timestamp}`;
        const mac = CryptoJS.HmacSHA256(macData, process.env.ZALO_KEY1).toString();

        // ✅ Doc ghi Request Body required → dùng POST cho chắc
        const response = await axios.post(
            "https://sb-openapi.zalopay.vn/v2/query_refund",
            {
                app_id,
                m_refund_id: refund_id,
                timestamp,
                mac,
            }
        );

        return res.json(response.data);
    } catch (err) {
        console.log("❌ Query refund error:", err?.response?.data || err);
        return res.status(500).json({
            message: "Lỗi check refund",
            detail: err?.response?.data || err.message,
        });
    }
};
