import db from "../config/db.js";
export const taoHoanTien = async (connection, madonhang, sotien) => {
    const [rs] = await connection.query(
        `
    INSERT INTO hoantien (madonhang, sotienhoan, trangthai, ngaytao)
    VALUES (?, ?, 'đang hoàn tiền', NOW())
    `,
        [madonhang, sotien]
    );
    return rs.insertId;
};

export const capNhatTrangThaiHoanTien = async (
    connection,
    mahoantien,
    trangthai
) => {
    await connection.query(
        `UPDATE hoantien SET trangthai=? WHERE mahoantien=?`,
        [trangthai, mahoantien]
    );
};
//CẦN
export const layHoanTienTheoId = async (connection, mahoantien) => {
    const [[row]] = await connection.query(
        `SELECT * FROM hoantien WHERE mahoantien = ?`,
        [mahoantien]
    );
    return row;
};
//CẦN
export const layHoanTienTheoDonHang = async (madonhang) => {
    const [[row]] = await db.query(
        `
        SELECT *
        FROM hoantien
        WHERE madonhang = ?
        ORDER BY ngaytao DESC
        LIMIT 1
        `,
        [madonhang]
    );
    return row;
};
