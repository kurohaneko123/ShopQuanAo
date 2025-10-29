
// 🎯 Controller: Hiển thị voucher cho khách hàng
import { layTatCaVoucher } from "../models/voucherModel.js";

export const hienThiVoucher = async (req, res) => {
    try {
        // 🧠 Gọi model để lấy danh sách voucher
        const vouchers = await layTatCaVoucher();

        // ✅ Trả kết quả về cho frontend
        res.status(200).json({
            message: "Lấy danh sách voucher thành công!",
            data: vouchers,
        });

    } catch (error) {
        // ❌ Xử lý lỗi nếu có
        console.error("Lỗi khi lấy voucher:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};
