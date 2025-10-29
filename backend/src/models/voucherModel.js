
// 🧠 Model: Lấy danh sách voucher cho khách hàng
import db from "../config/db.js";

export const layTatCaVoucher = async () => {
    const [rows] = await db.query(`
        SELECT 
            magiamgia,
            mota,
            loaikhuyenmai,
            giatrigiam,
            giantoida,
            dontoithieu,
            ngaybatdau,
            ngayketthuc,
            trangthai
        FROM voucher
        WHERE trangthai = 'hoạt động'
    `);
    return rows;
};
