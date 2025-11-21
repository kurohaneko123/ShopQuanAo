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
            madanhmuc,
            anhdaidien
        FROM sanpham
    `);
  return rows;
};
// 🟢 Lấy thông tin chi tiết sản phẩm theo ID
export const laySanPhamTheoID = async (id) => {
  const [rows] = await db.query(`SELECT * FROM sanpham WHERE masanpham = ?`, [
    id,
  ]);
  return rows[0];
};

// 🟢 Lấy danh sách biến thể của sản phẩm
export const layBienTheTheoSanPham = async (id) => {
  const [rows] = await db.query(
    `SELECT 
        bt.*,
        ms.tenmausac,
        ms.hexcode,
        kt.tenkichthuoc
     FROM bienthesanpham bt
     JOIN mausac ms ON bt.mamausac = ms.mamausac
     JOIN kichthuoc kt ON bt.makichthuoc = kt.makichthuoc
     WHERE bt.masanpham = ?`,
    [id]
  );
  return rows;
};

// 🟢 Lấy hình ảnh theo mã sản phẩm (qua mã biến thể)
export const layHinhTheoBienThe = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM hinhanh 
     WHERE mabienthe IN (
       SELECT mabienthe FROM bienthesanpham WHERE masanpham = ?
     )`,
    [id]
  );
  return rows;
};
