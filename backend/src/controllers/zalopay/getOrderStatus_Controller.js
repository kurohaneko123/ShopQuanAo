
import axios from "axios";
import CryptoJS from "crypto-js";

export const ZaloPayGetOrderStatus = async (req, res) => {
    try {
        const { app_trans_id } = req.query;

        const appid = process.env.ZALO_APP_ID;
        const key1 = process.env.ZALO_KEY1;

        const data = `${appid}|${app_trans_id}|${key1}`;
        const mac = CryptoJS.HmacSHA256(data, key1).toString();

        const response = await axios.get("https://sb-openapi.zalopay.vn/v2/query", {
            params: { app_id: appid, app_trans_id, mac },
        });

        res.json(response.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi check order" });
    }
};
