import db from "../config/db.js";

// Lấy tất cả kích thước
export const layTatCaKichThuoc = async () => {
    const [rows] = await db.query(`
        SELECT 
            makichthuoc,
            tenkichthuoc,
            mota,
            ngaytao
        FROM kichthuoc
        ORDER BY makichthuoc ASC
    `);

    return rows;
};

//Thêm 1 kích thước 
export const themKichThuoc = async (tenkichthuoc, mota) => {
    const sql = `
        INSERT INTO kichthuoc (tenkichthuoc, mota, ngaytao)
        VALUES (?, ?, NOW())
    `;
    const [result] = await db.query(sql, [tenkichthuoc, mota]);
    return result;
};

//Sửa kích thước
export const capNhatKichThuoc = async (id, tenkichthuoc, mota) => {
    const sql = `
        UPDATE kichthuoc
        SET tenkichthuoc = ?, mota = ?
        WHERE makichthuoc = ?
    `;
    const [result] = await db.query(sql, [tenkichthuoc, mota, id]);
    return result;
};
//Xóa kích thước 
export const xoaKichThuoc = async (id) => {
    const sql = `
        DELETE FROM kichthuoc
        WHERE makichthuoc = ?
    `;
    const [result] = await db.query(sql, [id]);
    return result;
};
