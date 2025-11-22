
//  Model: Lấy danh sách voucher cho khách hàng
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

// Model thêm 1 voucher
export const taoVoucherMoi = async (data) => {
    const sql = `
        INSERT INTO voucher 
        (mavoucher, magiamgia, mota, loaikhuyenmai, giatrigiam, giantoida, dontoithieu, 
         apdungtoanbo, masanpham, madanhmuc, ngaybatdau, ngayketthuc, trangthai, ngaytao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
        data.mavoucher,
        data.magiamgia,
        data.mota,
        data.loaikhuyenmai,
        data.giatrigiam,
        data.giantoida || null,
        data.dontoithieu || null,
        data.apdungtoanbo,
        data.masanpham || null,
        data.madanhmuc || null,
        data.ngaybatdau,
        data.ngayketthuc,
        data.trangthai || "hoạt động",
    ]);

    return result;
};
//Model cập nhật voucher
export const capNhatVoucher = async (id, data) => {
    const sql = `
        UPDATE voucher 
        SET 
            mavoucher = ?, 
            magiamgia = ?, 
            mota = ?, 
            loaikhuyenmai = ?, 
            giatrigiam = ?, 
            giantoida = ?, 
            dontoithieu = ?, 
            apdungtoanbo = ?, 
            masanpham = ?, 
            madanhmuc = ?, 
            ngaybatdau = ?, 
            ngayketthuc = ?, 
            trangthai = ?
        WHERE magiamgia = ?
    `;

    const [result] = await db.query(sql, [
        data.mavoucher,
        data.magiamgia,
        data.mota,
        data.loaikhuyenmai,
        data.giatrigiam,
        data.giantoida || null,
        data.dontoithieu || null,
        data.apdungtoanbo,
        data.masanpham || null,
        data.madanhmuc || null,
        data.ngaybatdau,
        data.ngayketthuc,
        data.trangthai,
        id
    ]);

    return result;
};
//Model xóa voucher
export const xoaVoucher = async (id) => {
    const sql = `
        DELETE FROM voucher
        WHERE magiamgia = ?
    `;

    const [result] = await db.query(sql, [id]);
    return result;
};
