import { xoaBienThe, capNhatBienThe } from "../models/bientheModel.js";
// Xóa biến thể 
export const xoaBienTheController = async (req, res) => {
    try {
        const mabienthe = req.params.id;

        if (!mabienthe) {
            return res.status(400).json({ message: "Thiếu mã biến thể!" });
        }

        const result = await xoaBienThe(mabienthe);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy biến thể để xoá!" });
        }

        res.status(200).json({
            message: "Xoá biến thể thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi xoá biến thể:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
//Sửa biến thể
export const suaBienThe = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // VALIDATE
        if (!data.makichthuoc || !data.mamausac || !data.soluongton || !data.giaban) {
            return res.status(400).json({
                message: "Thiếu dữ liệu bắt buộc để sửa biến thể!"
            });
        }

        const result = await capNhatBienThe(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy biến thể để sửa!"
            });
        }

        res.status(200).json({
            message: "Sửa biến thể thành công!",
            updated: true
        });

    } catch (error) {
        console.error("Lỗi khi sửa biến thể:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
