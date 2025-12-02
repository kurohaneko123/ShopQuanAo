
import axios from "axios";
import CryptoJS from "crypto-js";

export const ZaloPayQueryRefund = async (req, res) => {
    try {
        const { refund_id } = req.query;

        const data = `${process.env.ZALO_APP_ID}|${refund_id}|${process.env.ZALO_KEY1}`;
        const mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY1).toString();

        const response = await axios.get(
            "https://sb-openapi.zalopay.vn/v2/query_refund",
            {
                params: {
                    app_id: process.env.ZALO_APP_ID,
                    refund_id,
                    mac,
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi check refund" });
    }
};
