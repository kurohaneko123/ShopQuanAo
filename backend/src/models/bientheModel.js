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
//Lọc biến thể
export const locBienTheModel = async (boLoc) => {
  let sql = `
    SELECT DISTINCT
      sp.masanpham,
      sp.tensanpham,
      sp.anhdaidien,
      sp.slug,
      dm.gioitinh,
      MIN(bt.giaban) AS giaban_min,
      MAX(bt.giaban) AS giaban_max
    FROM bienthesanpham bt
    JOIN sanpham sp ON bt.masanpham = sp.masanpham
    JOIN danhmuc dm ON sp.madanhmuc = dm.madanhmuc
    JOIN kichthuoc kt ON bt.makichthuoc = kt.makichthuoc
    JOIN mausac ms ON bt.mamausac = ms.mamausac
    WHERE bt.trangthaihoatdongbtsp = 'hoạt động'
  `;

  const thamSo = [];

  // 🎯 lọc kích thước
  if (boLoc.kichthuoc?.length) {
    sql += ` AND bt.makichthuoc IN (${boLoc.kichthuoc.map(() => "?").join(",")})`;
    thamSo.push(...boLoc.kichthuoc);
  }

  // 🎯 lọc màu sắc
  if (boLoc.mausac?.length) {
    sql += ` AND bt.mamausac IN (${boLoc.mausac.map(() => "?").join(",")})`;
    thamSo.push(...boLoc.mausac);
  }

  // 🎯 lọc giá
  if (boLoc.giaTu) {
    sql += ` AND bt.giaban >= ?`;
    thamSo.push(boLoc.giaTu);
  }

  if (boLoc.giaDen) {
    sql += ` AND bt.giaban <= ?`;
    thamSo.push(boLoc.giaDen);
  }

  // 🎯 lọc giới tính
  if (boLoc.gioitinh) {
    sql += ` AND dm.gioitinh = ?`;
    thamSo.push(boLoc.gioitinh);
  }

  sql += ` GROUP BY sp.masanpham ORDER BY sp.ngaytao DESC`;

  const [ketQua] = await db.query(sql, thamSo);
  return ketQua;
};
