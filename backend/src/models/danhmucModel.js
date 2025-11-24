// src/models/danhmucModel.js
//  Model: Xử lý truy vấn database
import db from "../config/db.js";
//  Hàm lấy toàn bộ danh mục (ẩn ngày tạo)
export const layTatCaDanhMuc = async () => {
    const [rows] = await db.query(`
        SELECT 
            madanhmuc,
            tendanhmuc,
            slug,
            gioitinh
        FROM danhmuc
    `);
    return rows;
};
//FULL HÀM THÊM DANH MỤC
// Hàm tạo slug
export const taoSlug = (text) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
};

// Check slug tồn tại chưa
export const checkSlugTonTai = async (slug) => {
    const [rows] = await db.query(
        "SELECT madanhmuc FROM danhmuc WHERE slug = ?",
        [slug]
    );
    return rows.length > 0;
};

// Thêm danh mục mới
export const taoDanhMucMoi = async (data) => {
    const sql = `
        INSERT INTO danhmuc (tendanhmuc, slug, gioitinh, ngaytao)
        VALUES (?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
        data.tendanhmuc,
        data.slug,
        data.gioitinh,
    ]);

    return result;
};

// Cập nhật danh mục
export const capNhatDanhMuc = async (id, data) => {
    const sql = `
        UPDATE danhmuc 
        SET tendanhmuc = ?, slug = ?, gioitinh = ?
        WHERE madanhmuc = ?
    `;

    const [result] = await db.query(sql, [
        data.tendanhmuc,
        data.slug,
        data.gioitinh,
        id
    ]);

    return result;
};

// Kiểm tra slug trùng nhưng loại trừ chính nó
export const checkSlugTonTaiKhiSua = async (slug, id) => {
    const [rows] = await db.query(
        "SELECT madanhmuc FROM danhmuc WHERE slug = ? AND madanhmuc != ?",
        [slug, id]
    );
    return rows.length > 0;
};

// Xoá danh mục theo ID
export const xoaDanhMuc = async (id) => {
    const [result] = await db.query(
        "DELETE FROM danhmuc WHERE madanhmuc = ?",
        [id]
    );
    return result;
};