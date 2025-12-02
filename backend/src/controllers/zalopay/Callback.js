
import CryptoJS from "crypto-js";
import db from "../../config/db.js";

export const ZaloPayCallback = async (req, res) => {
    try {
        const { data, mac } = req.body;

        const macCheck = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY2).toString();

        if (mac !== macCheck) {
            return res.json({ return_code: -1, return_message: "MAC không hợp lệ" });
        }
        else {
            const dataObj = JSON.parse(data);
            console.log(" ZaloPay callback hợp lệ!");
            console.log(" Mã giao dịch:", dataObj.zp_trans_id);
            console.log(" Mã đơn:", dataObj.app_trans_id);
            console.log(" Số tiền:", dataObj.amount);
            console.log(" Thời gian:", dataObj.server_time);
            res.json({ return_code: 1, return_message: "Xử lý thành công" });
        }
    } catch (err) {
        console.log(err);
        res.json({ return_code: 0, return_message: "Lỗi backend" });
    }
};
