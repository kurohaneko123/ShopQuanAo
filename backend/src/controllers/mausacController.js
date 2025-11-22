import { layTatCaMauSac } from "../models/mausacModel.js";

//  Hiển thị danh sách màu sắc
export const hienThiMauSac = async (req, res) => {
    try {
        const data = await layTatCaMauSac();

        res.status(200).json({
            message: "Lấy danh sách màu sắc thành công!",
            data,
        });

    } catch (error) {
        console.error("Lỗi khi lấy màu sắc:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};

import { taoMauSacMoi } from "../models/mausacModel.js";

//  Thêm màu sắc mới
export const themMauSac = async (req, res) => {
    try {
        const data = req.body;

        // ⚠️ Kiểm tra thiếu dữ liệu
        if (!data.tenmausac || !data.hexcode) {
            return res.status(400).json({
                message: "Thiếu tên màu sắc hoặc mã màu!"
            });
        }

        const result = await taoMauSacMoi(data);

        res.status(201).json({
            message: "Thêm màu sắc mới thành công!",
            id: result.insertId
        });

    } catch (error) {
        console.error("Lỗi khi thêm màu sắc:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
import { capNhatMauSac } from "../models/mausacModel.js";

// Sửa màu sắc
export const suaMauSac = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // ⚠️ Check dữ liệu bắt buộc
        if (!data.tenmausac || !data.hexcode) {
            return res.status(400).json({
                message: "Thiếu tên màu sắc hoặc mã màu!"
            });
        }

        const result = await capNhatMauSac(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy màu sắc để sửa!"
            });
        }

        res.status(200).json({
            message: "Cập nhật màu sắc thành công!",
            updated: result.changedRows > 0
        });

    } catch (error) {
        console.error("Lỗi khi sửa màu sắc:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
import { xoaMauSac } from "../models/mausacModel.js";

// Xoá màu sắc
export const xoaMau = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await xoaMauSac(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy màu sắc để xoá!"
            });
        }

        res.status(200).json({
            message: "Xoá màu sắc thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi xoá màu sắc:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
