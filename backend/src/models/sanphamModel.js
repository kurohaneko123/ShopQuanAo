// src/models/sanphamModel.js
import db from "../config/db.js";

// 🔍 Lấy danh sách sản phẩm hiển thị cho khách hàng
export const layTatCaSanPham = async () => {
    const [rows] = await db.query(`
        SELECT 
            masanpham,
            tensanpham,
            thuonghieu,
            mota,
            chatlieu,
            kieudang,
            baoquan,
            madanhmuc
        FROM sanpham
    `);
    return rows;
};
