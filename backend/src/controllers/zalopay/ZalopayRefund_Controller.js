// controllers/zalopay/ZalopayRefund_Controller.js
import axios from "axios";
import CryptoJS from "crypto-js";

export const ZaloPayRefund = async (req, res) => {
    try {
        const { zp_trans_id, amount } = req.body;

        const data = {
            app_id: process.env.ZALO_APP_ID,
            zp_trans_id,
            amount,
            timestamp: Date.now(),
        };

        const macData =
            `${data.app_id}|${data.zp_trans_id}|${data.amount}|${data.timestamp}`;
        data.mac = CryptoJS.HmacSHA256(macData, process.env.ZALO_KEY1).toString();

        const response = await axios.post(
            "https://sb-openapi.zalopay.vn/v2/refund",
            data
        );

        res.json(response.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi refund ZaloPay" });
    }
};
