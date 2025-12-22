import CryptoJS from "crypto-js";
import db from "../../config/db.js";

export const ZaloPayCallback = async (req, res) => {
    try {
        const { data, mac } = req.body;

        // 0) Log để biết callback có vô hay không
        console.log(">>> ZALO CALLBACK RAW BODY:", req.body);

        // 1) Verify MAC
        const macCheck = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY2).toString();
        if (mac !== macCheck) {
            console.log(">>> MAC INVALID", { mac, macCheck });
            return res.json({ return_code: -1, return_message: "MAC không hợp lệ" });
        }

        // 2) Parse data
        const dataObj = JSON.parse(data);
        console.log(">>> ZALO CALLBACK DATA OBJ:", dataObj);

        // 3) Lấy madonhang
        let madonhang = null;

        if (dataObj.embed_data) {
            try {
                const embedData =
                    typeof dataObj.embed_data === "string"
                        ? JSON.parse(dataObj.embed_data)
                        : dataObj.embed_data;
                madonhang = embedData?.madonhang ?? null;
            } catch (e) {
                console.log(">>> PARSE embed_data FAILED:", e.message);
            }
        }

        if (!madonhang && dataObj.app_trans_id) {
            // app_trans_id = "YYMMDD_<transID>"
            madonhang = String(dataObj.app_trans_id).split("_")[1];
        }

        if (!madonhang) {
            console.log(">>> Cannot detect madonhang");
            return res.json({ return_code: 0, return_message: "Không xác định được mã đơn hàng" });
        }

        // 4) Callback THÀNH CÔNG: phải có zp_trans_id
        const zpTransId = dataObj.zp_trans_id;
        if (!zpTransId) {
            console.log(">>> Missing zp_trans_id => không update đơn", dataObj);
            // vẫn trả 1 để ZaloPay không retry spam
            return res.json({ return_code: 1, return_message: "No zp_trans_id" });
        }

        // 5) Update đơn hàng
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
            [zpTransId, madonhang]
        );

        console.log(">>> UPDATE RESULT:", result);

        return res.json({ return_code: 1, return_message: "Xử lý thành công" });
    } catch (err) {
        console.log(">>> CALLBACK ERROR:", err);
        return res.json({ return_code: 0, return_message: "Lỗi backend" });
    }
};
