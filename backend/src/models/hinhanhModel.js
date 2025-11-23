import db from "../config/db.js";

//  Thêm ảnh mới vào DB
export const themHinhAnh = async (mabienthe, urlhinhanh, stt) => {
    const [result] = await db.query(
        "INSERT INTO hinhanh (mabienthe, urlhinhanh, ngaytao, stt) VALUES (?, ?, NOW(), ?)",
        [mabienthe, urlhinhanh, stt]
    );
    return result.insertId;
};

//  Lấy tất cả ảnh (tuỳ anh có thể dùng để quản lý)
export const layTatCaHinhAnh = async () => {
    const [rows] = await db.query("SELECT * FROM hinhanh ORDER BY mahinhanh DESC");
    return rows;
};

//  Lấy ảnh theo mã biến thể
export const layHinhAnhTheoBienThe = async (mabienthe) => {
    const [rows] = await db.query("SELECT * FROM hinhanh WHERE mabienthe = ?", [mabienthe]);
    return rows;
};

// Xóa ảnh theo mã hình
export const xoaHinhAnh = async (mahinhanh) => {
    const sql = `DELETE FROM hinhanh WHERE mahinhanh = ?`;

    const [result] = await db.query(sql, [mahinhanh]);
    return result;
};