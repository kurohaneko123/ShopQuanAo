import db from "../config/db.js";
//Xóa biến thể
export const xoaBienThe = async (mabienthe) => {
    const sql = `
      DELETE FROM bienthesanpham
      WHERE mabienthe = ?
  `;

    const [result] = await db.query(sql, [mabienthe]);
    return result;
};

//Thêm biến thể
export const capNhatBienThe = async (id, data) => {
    const sql = `
    UPDATE bienthesanpham 
    SET 
      makichthuoc = ?, 
      mamausac = ?, 
      soluongton = ?, 
      giaban = ?,
      trangthaihoatdongbtsp = ?
    WHERE mabienthe = ?
  `;

    const [result] = await db.query(sql, [
        data.makichthuoc,
        data.mamausac,
        data.soluongton,
        data.giaban,
        data.trangthaihoatdongbtsp || "hoạt động",
        id
    ]);

    return result;
};