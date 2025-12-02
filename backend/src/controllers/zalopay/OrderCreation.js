
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment/moment.js";
// APP INFO
export const ZaloPayCreateOrder = async (req, res) => {
    try {
        const config = {
            app_id: process.env.ZALO_APP_ID,
            key1: process.env.ZALO_KEY1,
            key2: process.env.ZALO_KEY2,
            endpoint: process.env.ZALO_ENDPOINT,
        };

        const embed_data = {};
        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);

        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: "user123",
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            callback_url: "https://3476648cf7d5.ngrok-free.app/api/payment/zalopay/callback",
            amount: 50000,
            description: `Lazada - Payment for the order #${transID}`,
            bank_code: "zalopayapp",
        };

        const data =
            `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const response = await axios.post(config.endpoint, null, { params: order });

        res.json(response.data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Lỗi tạo đơn ZaloPay", detail: err.message });
    }
};