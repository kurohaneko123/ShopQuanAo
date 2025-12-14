
import CryptoJS from "crypto-js";
import db from "../../config/db.js";

export const ZaloPayCallback = async (req, res) => {
    try {
        const { data, mac } = req.body;

        // 1️⃣ VERIFY MAC (GIỮ NGUYÊN)
        const macCheck = CryptoJS
            .HmacSHA256(data, process.env.ZALO_KEY2)
            .toString();

        if (mac !== macCheck) {
            return res.json({
                return_code: -1,
                return_message: "MAC không hợp lệ",
            });
        }
        else {
            // 2️⃣ PARSE DATA ZALOPAY GỬI QUA
            const dataObj = JSON.parse(data);

            /*
              dataObj mẫu:
              {
                app_trans_id: "251214_5",
                zp_trans_id: 2400012345,
                amount: 219000,
                server_time: 1734160000000,
                embed_data: "{\"madonhang\":5}"
              }
            */

            console.log("✅ ZaloPay callback hợp lệ!");
            console.log("🔹 Mã giao dịch:", dataObj.zp_trans_id);
            console.log("🔹 App trans id:", dataObj.app_trans_id);
            console.log("🔹 Số tiền:", dataObj.amount);
            console.log("🔹 Thời gian:", dataObj.server_time);

            // 3️⃣ LẤY MÃ ĐƠN HÀNG
            let madonhang = null;

            // ƯU TIÊN LẤY TỪ embed_data (CHUẨN NHẤT)
            if (dataObj.embed_data) {
                const embedData = JSON.parse(dataObj.embed_data);
                madonhang = embedData.madonhang;
            }

            // FALLBACK: cắt từ app_trans_id (YYMMDD_madonhang)
            if (!madonhang && dataObj.app_trans_id) {
                madonhang = dataObj.app_trans_id.split("_")[1];
            }

            if (!madonhang) {
                return res.json({
                    return_code: 0,
                    return_message: "Không xác định được mã đơn hàng",
                });
            }

            // 4️⃣ UPDATE TRẠNG THÁI ĐƠN HÀNG
            await db.query(
                `
        UPDATE donhang
        SET trangthai = 'da_thanh_toan',
            ngaycapnhat = NOW()
        WHERE madonhang = ?
        `,
                [madonhang]
            );

            console.log("✅ Đã cập nhật đơn hàng:", madonhang);

            // 5️⃣ TRẢ KẾT QUẢ CHO ZALOPAY
            res.json({
                return_code: 1,
                return_message: "Xử lý thành công",
            });
        }
    } catch (err) {
        console.log("❌ Lỗi callback:", err);
        res.json({
            return_code: 0,
            return_message: "Lỗi backend",
        });
    }
};
