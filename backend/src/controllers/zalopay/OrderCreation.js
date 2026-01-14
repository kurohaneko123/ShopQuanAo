import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment/moment.js";
// APP INFO
// APP INFO
export const ZaloPayCreateOrder = async (req, res) => {
  try {
    const { madonhang, tongthanhtoan } = req.body;

    const config = {
      app_id: process.env.ZALO_APP_ID,
      key1: process.env.ZALO_KEY1,
      key2: process.env.ZALO_KEY2,
      endpoint: process.env.ZALO_ENDPOINT,
    };

    // 👉 CHỈ SỬA embed_data (KHÔNG ĐỔI KIỂU)
    const embed_data = {
      madonhang,
    };

    const items = [{}];

    // 👉 CHỈ SỬA transID (KHÔNG random nữa)
    const transID = madonhang || Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      callback_url:
        "https://d9eaa5de5c34.ngrok-free.app/api/payment/zalopay/callback",

      redirect_url: "http://localhost:5000/ordersuccess?method=zalopay",

      // CHỈ SỬA TIỀN
      amount: tongthanhtoan || 50000,

      // CHỈ SỬA MÔ TẢ
      description: `Thanh toán đơn hàng #${transID}`,
      bank_code: "zalopayapp",
    };

    //
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Lỗi tạo đơn ZaloPay",
      detail: err.message,
    });
  }
};
