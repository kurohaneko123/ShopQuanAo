import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import db from "../../config/db.js";

export const ZaloPayRefund = async (req, res) => {
    try {
        const { madonhang } = req.body;

        /* ============================
           CONFIG (GIỐNG PHP)
        ============================ */
        const config = {
            app_id: Number(process.env.ZALO_APP_ID),
            key1: process.env.ZALO_KEY1,
            refund_url: process.env.ZALO_REFUND,
        };

        /* ============================
           0️⃣ CHẶN REFUND TRÙNG (CỰC QUAN TRỌNG)
        ============================ */
        const [exists] = await db.query(
            `SELECT 1 FROM hoantien
             WHERE madonhang = ?
             AND trangthai IN ('dang_xu_ly', 'thanh_cong')
             LIMIT 1`,
            [madonhang]
        );

        if (exists.length) {
            return res.status(400).json({
                message: "Đơn hàng đã có giao dịch hoàn tiền",
            });
        }

        /* ============================
           1️⃣ LẤY ĐƠN HÀNG
        ============================ */
        const [[order]] = await db.query(
            `SELECT * FROM donhang WHERE madonhang = ?`,
            [madonhang]
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        /* ============================
           2️⃣ CHECK GIAO DỊCH ZALOPAY
        ============================ */
        if (Number(order.dathanhtoan) !== 1 || !order.zalopay_trans_id) {
            return res.status(400).json({
                message: "Đơn hàng chưa có giao dịch ZaloPay hợp lệ",
            });
        }

        /* ============================
           3️⃣ THAM SỐ REFUND
        ============================ */
        const timestamp = Date.now();
        const zp_trans_id = Number(order.zalopay_trans_id);
        const amount = Number(order.tongtien);
        const uid = `${timestamp}${Math.floor(Math.random() * 900 + 100)}`;

        const params = {
            app_id: config.app_id,
            m_refund_id: `${moment().format("YYMMDD")}_${config.app_id}_${uid}`,
            timestamp,
            zp_trans_id,
            amount,
            description: `Hoàn tiền đơn hàng #${order.madonhang}`,
        };

        /* ============================
           4️⃣ MAC (Y HỆT PHP)
        ============================ */
        const data_mac =
            `${params.app_id}|${params.zp_trans_id}|${params.amount}` +
            `|${params.description}|${params.timestamp}`;

        params.mac = CryptoJS
            .HmacSHA256(data_mac, config.key1)
            .toString();

        console.log("ZaloPay refund request:", params);

        /* ============================
           5️⃣ CALL REFUND
        ============================ */
        const response = await axios.post(
            config.refund_url,
            new URLSearchParams(params).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("ZaloPay refund response:", response.data);

        const result = response.data;

        /* ============================
           6️⃣ XỬ LÝ KẾT QUẢ (ĐÚNG NGHIỆP VỤ)
        ============================ */

        // ✅ Thành công NGAY (hiếm)
        if (result.return_code === 1) {
            await db.query(
                `UPDATE donhang
                 SET trangthai = 'Đã hoàn tiền', dathanhtoan = 0
                 WHERE madonhang = ?`,
                [madonhang]
            );

            await db.query(
                `INSERT INTO hoantien
   (madonhang, m_refund_id, magiaodich_zalopay, sotienhoan, trangthai, phanhoi_zalopay)
   VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    madonhang,
                    params.m_refund_id,
                    zp_trans_id,
                    amount,
                    "thanh_cong",
                    JSON.stringify(result),
                ]
            );

            return res.json({
                message: "Hoàn tiền thành công qua ZaloPay",
                result,
            });
        }

        // 🟡 Đang xử lý (case CHUẨN)
        if (result.return_code === 3 || result.sub_return_code === -101) {
            await db.query(
                `UPDATE donhang
                 SET trangthai = 'Đang hoàn tiền'
                 WHERE madonhang = ?`,
                [madonhang]
            );

            await db.query(
                `INSERT INTO hoantien
   (madonhang, m_refund_id, magiaodich_zalopay, sotienhoan, trangthai, phanhoi_zalopay)
   VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    madonhang,
                    params.m_refund_id,
                    zp_trans_id,
                    amount,
                    "dang_xu_ly",
                    JSON.stringify(result),
                ]
            );


            return res.json({
                message: "Hoàn tiền đang được xử lý",
                result,
            });
        }

        // ❌ Thất bại THẬT
        await db.query(
            `INSERT INTO hoantien
   (madonhang, m_refund_id, magiaodich_zalopay, sotienhoan, trangthai, phanhoi_zalopay)
   VALUES (?, ?, ?, ?, ?, ?)`,
            [
                madonhang,
                params.m_refund_id,
                zp_trans_id,
                amount,
                "that_bai",
                JSON.stringify(result),
            ]
        );


        return res.status(400).json({
            message: "Hoàn tiền thất bại",
            result,
        });

    } catch (err) {
        console.error("Lỗi refund ZaloPay:", err.response?.data || err.message);
        return res.status(500).json({
            message: "Lỗi hệ thống khi hoàn tiền",
            detail: err.response?.data || err.message,
        });
    }
};
