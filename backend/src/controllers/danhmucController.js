
//  Controller: Xử lý logic và phản hồi API
// Import hàm từ model
import { layTatCaDanhMuc, taoDanhMucMoi, checkSlugTonTai, taoSlug, capNhatDanhMuc, checkSlugTonTaiKhiSua, xoaDanhMuc } from "../models/danhmucModel.js";

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

//FUL HÀM THÊM 1 DANH MỤC MỚI
export const themDanhMuc = async (req, res) => {
    try {
        const data = req.body;

        if (!data.tendanhmuc || !data.gioitinh) {
            return res.status(400).json({
                message: "Thiếu tên danh mục hoặc giới tính!",
            });
        }

        // Tạo slug từ tên danh mục
        const slug = taoSlug(data.tendanhmuc);
        data.slug = slug;

        // Check slug tồn tại chưa
        const tonTai = await checkSlugTonTai(slug);

        if (tonTai) {
            return res.status(400).json({
                message: "Danh mục đã tồn tại (slug trùng)!",
            });
        }

        // Thêm vào DB
        const result = await taoDanhMucMoi(data);

        res.status(201).json({
            message: "Thêm danh mục mới thành công!",
            id: result.insertId,
            slug,
        });
    } catch (error) {
        console.error("Lỗi thêm danh mục:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};
//Sửa danh mục
export const suaDanhMuc = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        if (!data.tendanhmuc || !data.gioitinh) {
            return res.status(400).json({
                message: "Thiếu tên danh mục hoặc giới tính!"
            });
        }

        // Tạo slug mới từ tên danh mục
        const slug = taoSlug(data.tendanhmuc);
        data.slug = slug;

        // Check slug trùng nhưng không tính chính nó
        const tonTai = await checkSlugTonTaiKhiSua(slug, id);

        if (tonTai) {
            return res.status(400).json({
                message: "Slug đã tồn tại ở danh mục khác!"
            });
        }

        // Cập nhật
        const result = await capNhatDanhMuc(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy danh mục để sửa!"
            });
        }

        res.status(200).json({
            message: "Cập nhật danh mục thành công!",
            updatedId: id,
            slug
        });

    } catch (error) {
        console.error("Lỗi sửa danh mục:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

// Xoá danh mục
export const xoaDanhMucController = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await xoaDanhMuc(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy danh mục để xoá!"
            });
        }

        res.status(200).json({
            message: "Xoá danh mục thành công!",
            deletedId: id
        });

    } catch (error) {
        console.error("Lỗi xoá danh mục:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};