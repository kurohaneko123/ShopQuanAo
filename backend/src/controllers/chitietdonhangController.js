import { layChiTietDonHang } from "../models/chitietdonhangModel.js";

export const hienThiChiTietDonHang = async (req, res) => {
    try {
        const madonhang = req.params.id;

        const chitiet = await layChiTietDonHang(madonhang);

        if (!chitiet || chitiet.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy chi tiết đơn hàng!"
            });
        }

        res.status(200).json({
            message: "Lấy chi tiết đơn hàng thành công!",
            data: chitiet
        });

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
