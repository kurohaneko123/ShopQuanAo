
// 🎯 Controller: Hiển thị voucher cho khách hàng
import { layTatCaVoucher } from "../models/voucherModel.js";

export const hienThiVoucher = async (req, res) => {
    try {
        //  Gọi model để lấy danh sách voucher
        const vouchers = await layTatCaVoucher();

        // ✅ Trả kết quả về cho frontend
        res.status(200).json({
            message: "Lấy danh sách voucher thành công!",
            data: vouchers,
        });

    } catch (error) {
        //  Xử lý lỗi nếu có
        console.error("Lỗi khi lấy voucher:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};

//Controller: Thêm mới 1 voucher 
import { taoVoucherMoi } from "../models/voucherModel.js";

export const themVoucher = async (req, res) => {
    try {
        const data = req.body;

        // ⚠️ Check các field bắt buộc
        if (!data.mavoucher || !data.magiamgia || !data.loaikhuyenmai || !data.giatrigiam) {
            return res.status(400).json({
                message: "Thiếu dữ liệu bắt buộc!",
            });
        }

        const result = await taoVoucherMoi(data);

        res.status(201).json({
            message: "Tạo voucher mới thành công!",
            voucherId: result.insertId,
        });

    } catch (error) {
        console.error("Lỗi khi thêm voucher:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};

//Controller: Cập nhật voucher
import { capNhatVoucher } from "../models/voucherModel.js";

export const suaVoucher = async (req, res) => {
    try {
        const id = req.params.id;  // mã voucher cũ
        const data = req.body;     // dữ liệu mới

        // ⚠️ Kiểm tra dữ liệu bắt buộc
        if (!data.mavoucher || !data.loaikhuyenmai || !data.giatrigiam) {
            return res.status(400).json({
                message: "Thiếu dữ liệu bắt buộc!"
            });
        }

        // 🧠 Gọi model cập nhật
        const result = await capNhatVoucher(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy voucher để sửa!"
            });
        }

        res.status(200).json({
            message: "Cập nhật voucher thành công!",
            updated: result.changedRows > 0
        });

    } catch (error) {
        console.error("Lỗi khi sửa voucher:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
//Controller: Xóa voucher
import { xoaVoucher } from "../models/voucherModel.js";

export const xoaMotVoucher = async (req, res) => {
    try {
        const id = req.params.id;  // THUN15 hoặc SALE20

        const result = await xoaVoucher(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy voucher để xoá!"
            });
        }

        res.status(200).json({
            message: "Xoá voucher thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi xoá voucher:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

