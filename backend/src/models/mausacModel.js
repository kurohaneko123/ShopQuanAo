import db from "../config/db.js";

//  Lấy toàn bộ màu sắc
export const layTatCaMauSac = async () => {
    const [rows] = await db.query(`
        SELECT 
            mamausac,
            tenmausac,
            mota,
            hexcode,
            ngaytao
        FROM mausac
        ORDER BY mamausac ASC
    `);

    return rows;
};

// Model: Thêm màu sắc mới
export const taoMauSacMoi = async (data) => {
    const sql = `
        INSERT INTO mausac (tenmausac, mota, hexcode, ngaytao)
        VALUES (?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
        data.tenmausac,
        data.mota,
        data.hexcode
    ]);

    return result;
};

//  Model: Cập nhật màu sắc
export const capNhatMauSac = async (id, data) => {
    const sql = `
        UPDATE mausac
        SET tenmausac = ?, mota = ?, hexcode = ?
        WHERE mamausac = ?
    `;

    const [result] = await db.query(sql, [
        data.tenmausac,
        data.mota,
        data.hexcode,
        id
    ]);

    return result;
};

//  Model: Xoá màu sắc
export const xoaMauSac = async (id) => {
    const sql = `DELETE FROM mausac WHERE mamausac = ?`;

    const [result] = await db.query(sql, [id]);

    return result;
};

