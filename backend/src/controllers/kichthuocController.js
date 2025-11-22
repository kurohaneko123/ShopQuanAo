//Show all kích thước
import { layTatCaKichThuoc } from "../models/kichthuocModel.js";

export const hienThiKichThuoc = async (req, res) => {
    try {
        const sizes = await layTatCaKichThuoc();

        res.status(200).json({
            message: "Lấy danh sách kích thước thành công!",
            data: sizes
        });

    } catch (error) {
        console.error("Lỗi khi lấy kích thước:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
//Thêm 1 kích thước
import { themKichThuoc } from "../models/kichthuocModel.js";

export const taoKichThuoc = async (req, res) => {
    try {
        const { tenkichthuoc, mota } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!tenkichthuoc || !mota) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        const result = await themKichThuoc(tenkichthuoc, mota);

        res.status(201).json({
            message: "Thêm kích thước mới thành công!",
            id: result.insertId
        });

    } catch (error) {
        console.error("Lỗi khi thêm kích thước:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
//Sửa kích thước
import { capNhatKichThuoc } from "../models/kichthuocModel.js";

export const suaKichThuoc = async (req, res) => {
    try {
        const id = req.params.id;
        const { tenkichthuoc, mota } = req.body;

        if (!tenkichthuoc || !mota) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        const result = await capNhatKichThuoc(id, tenkichthuoc, mota);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy kích thước để sửa!"
            });
        }

        res.status(200).json({
            message: "Cập nhật kích thước thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi sửa kích thước:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};
//xóa kích thước
import { xoaKichThuoc } from "../models/kichthuocModel.js";

export const xoaKichThuocController = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await xoaKichThuoc(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy kích thước để xoá!"
            });
        }

        res.status(200).json({
            message: "Xoá kích thước thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi xoá kích thước:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

