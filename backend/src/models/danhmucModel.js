// src/models/danhmucModel.js
//  Model: Xử lý truy vấn database
import db from "../config/db.js";
//  Hàm lấy toàn bộ danh mục (ẩn ngày tạo)
export const layTatCaDanhMuc = async () => {
    const [rows] = await db.query(`
        SELECT 
            madanhmuc,
            tendanhmuc,
            slug
        FROM danhmuc
    `);
    return rows;
};