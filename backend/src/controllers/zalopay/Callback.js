import CryptoJS from "crypto-js";
import db from "../../config/db.js";

export const ZaloPayCallback = async (req, res) => {
    try {
        const { data, mac } = req.body;

        /* =======================
           1️⃣ VERIFY MAC
        ======================= */
        const macCheck = CryptoJS
            .HmacSHA256(data, process.env.ZALO_KEY2)
            .toString();

        if (mac !== macCheck) {
            return res.json({
                return_code: -1,
                return_message: "MAC không hợp lệ",
            });
        }

        /* =======================
           2️⃣ PARSE DATA
        ======================= */
        const dataObj = JSON.parse(data);

        console.log("✅ ZaloPay callback hợp lệ:", dataObj);

        /* =======================
           3️⃣ LẤY MÃ ĐƠN HÀNG
        ======================= */
        let madonhang = null;

        // Ưu tiên embed_data
        if (dataObj.embed_data) {
            const embedData = JSON.parse(dataObj.embed_data);
            madonhang = embedData.madonhang;
        }

        // Fallback từ app_trans_id
        if (!madonhang && dataObj.app_trans_id) {
            madonhang = dataObj.app_trans_id.split("_")[1];
        }

        if (!madonhang) {
            return res.json({
                return_code: 0,
                return_message: "Không xác định được mã đơn hàng",
            });
        }

        /* =======================
           🚫 CASE KHÁCH HỦY / THANH TOÁN THẤT BẠI
        ======================= */
        if (dataObj.status !== 1) {
            console.log("⚠️ Giao dịch bị hủy / thất bại:", dataObj.status);

            // 1️ HOÀN KHO
            const [items] = await db.query(
                `
        SELECT mabienthe, soluong
        FROM chitietdonhang
        WHERE madonhang = ?
        `,
                [madonhang]
            );

            for (const item of items) {
                await db.query(
                    `
            UPDATE bienthesanpham
            SET soluongton = soluongton + ?
            WHERE mabienthe = ?
            `,
                    [item.soluong, item.mabienthe]
                );
            }

            // 2️ UPDATE ĐƠN HÀNG
            await db.query(
                `
        UPDATE donhang
        SET trangthai = 'đã hủy',
            ngaycapnhat = NOW()
        WHERE madonhang = ?
          AND dathanhtoan = 0
        `,
                [madonhang]
            );

            return res.json({
                return_code: 1,
                return_message: "Đã xử lý hủy giao dịch",
            });
        }

        /* =======================
           4️ UPDATE ĐƠN HÀNG
           (THANH TOÁN THÀNH CÔNG)
        ======================= */
        const [result] = await db.query(
            `
            UPDATE donhang
            SET dathanhtoan = 1,
                trangthai = 'đã xác nhận',
                zalopay_trans_id = ?,
                ngaythanhtoan = NOW(),
                ngaycapnhat = NOW()
            WHERE madonhang = ?
              AND dathanhtoan = 0
            `,
            [dataObj.zp_trans_id, madonhang]
        );

        if (result.affectedRows === 0) {
            console.log("Callback trùng hoặc đơn đã thanh toán:", madonhang);
        } else {
            console.log("Đã cập nhật đơn hàng:", madonhang);
        }

        /* =======================
           5️⃣ TRẢ KẾT QUẢ CHO ZALOPAY
        ======================= */
        return res.json({
            return_code: 1,
            return_message: "Xử lý thành công",
        });

    } catch (err) {
        console.log("Lỗi callback:", err);
        return res.json({
            return_code: 0,
            return_message: "Lỗi backend",
        });
    }
};
