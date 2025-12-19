import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import db from "../../config/db.js";

export const ZaloPayRefund = async (req, res) => {
    try {
        const { madonhang, sotienhoan } = req.body;

        if (!madonhang || !sotienhoan) {
            return res.status(400).json({ message: "Thiếu mã đơn hàng hoặc số tiền hoàn" });
        }

        /* =====================
           1️⃣ LẤY GIAO DỊCH ZALOPAY
        ===================== */
        const [donhang] = await db.query(
            `
            SELECT zalopay_trans_id, dathanhtoan
            FROM donhang
            WHERE madonhang = ?
            `,
            [madonhang]
        );

        if (donhang.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (donhang[0].dathanhtoan !== 1) {
            return res.status(400).json({ message: "Đơn hàng chưa thanh toán" });
        }

        const magiaodich_zalopay = donhang[0].zalopay_trans_id;

        console.log("Lấy đơn hàng từ DB:", donhang); // log đơn hàng

        /* =====================
           2️⃣ TẠO MÃ HOÀN TIỀN
        ===================== */
        const mahoantien =
            `${moment().format("YYMMDD")}_${process.env.ZALO_APP_ID}_${Date.now()}`;

        const dulieu = {
            app_id: process.env.ZALO_APP_ID,
            zp_trans_id: magiaodich_zalopay,
            amount: sotienhoan,
            refund_fee_amount: 1, // Phí hoàn tiền hợp lệ
            description: `Hoàn tiền cho đơn hàng #${madonhang}`,
            timestamp: Date.now(),
        };

        console.log("Dữ liệu gửi lên ZaloPay:", dulieu); // log dữ liệu gửi lên

        /* =====================
           🔐 MAC – SỬA ĐÚNG FORMAT ZALOPAY
        ===================== */
        const macData =
            `${dulieu.app_id}|${dulieu.zp_trans_id}|${dulieu.amount}|${dulieu.refund_fee_amount}|${dulieu.timestamp}`; // Đảm bảo thứ tự đúng


        dulieu.mac = CryptoJS
            .HmacSHA256(macData, process.env.ZALO_KEY1)
            .toString();

        console.log("MAC đã tạo:", dulieu.mac); // log MAC

        /* =====================
           3️⃣ GỌI ZALOPAY
        ===================== */
        const response = await axios.post(
            process.env.ZALO_REFUND,
            dulieu
        );

        console.log("Phản hồi từ ZaloPay:", response.data); // log phản hồi từ ZaloPay

        /* =====================
           4️⃣ LƯU DB
        ===================== */
        await db.query(
            `
            INSERT INTO hoantien
              (mahoantien, madonhang, magiaodich_zalopay, sotienhoan, trangthai, phanhoi_zalopay)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                mahoantien,
                madonhang,
                magiaodich_zalopay,
                sotienhoan,
                response.data.return_code === 1 ? "thanh_cong" : "that_bai",
                JSON.stringify(response.data),
            ]
        );

        res.json({
            mahoantien,
            ...response.data,
        });
    } catch (err) {
        console.log("Lỗi hoàn tiền từ ZaloPay:", err.response?.data || err.message); // log lỗi
        res.status(500).json({
            message: "Lỗi hoàn tiền ZaloPay",
            detail: err.response?.data || err.message,
        });
    }
};
