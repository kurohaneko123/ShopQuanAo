
//  Controller: Xử lý logic và phản hồi API
// Import hàm từ model
import { layTatCaDanhMuc } from "../models/danhmucModel.js";

//  Hiển thị toàn bộ danh mục
export const hienThiDanhMuc = async (req, res) => {
    try {
        const danhmucs = await layTatCaDanhMuc();
        res.status(200).json({
            message: "Lấy danh sách danh mục thành công!",
            data: danhmucs,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};
