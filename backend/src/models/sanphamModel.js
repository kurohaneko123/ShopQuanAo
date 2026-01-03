// src/models/sanphamModel.js
import db from "../config/db.js";
//  Lấy danh sách sản phẩm hiển thị cho khách hàng
export const layTatCaSanPham = async () => {
  const [rows] = await db.query(`
        SELECT 
            masanpham,
            tensanpham,
            slug,
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
//  Lấy thông tin chi tiết sản phẩm theo ID
export const laySanPhamTheoID = async (id) => {
  const [rows] = await db.query(`SELECT * FROM sanpham WHERE masanpham = ?`, [
    id,
  ]);
  return rows[0];
};

//  Lấy danh sách biến thể của sản phẩm
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

//  Lấy hình ảnh theo mã sản phẩm (qua mã biến thể)
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

// Model: Thêm sản phẩm mới
//  Hàm tạo slug chuẩn SEO
const taoSlug = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// ===============================
//  TẠO SẢN PHẨM + BIẾN THỂ
// ===============================
export const taoSanPhamMoi = async (data) => {
  const connection = await db.getConnection(); // transaction
  try {
    await connection.beginTransaction();

    // ---- Tạo slug ----
    const slug = taoSlug(data.tensanpham);

    const [check] = await connection.query(
      "SELECT masanpham FROM sanpham WHERE slug = ?",
      [slug]
    );
    if (check.length > 0) {
      throw new Error("Sản phẩm đã tồn tại (slug bị trùng)");
    }

    // ---- Insert sản phẩm ----
    const sqlSP = `
        INSERT INTO sanpham 
        (tensanpham, slug, thuonghieu, mota, chatlieu, kieudang, baoquan, madanhmuc, anhdaidien, ngaytao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const [resultSP] = await connection.query(sqlSP, [
      data.tensanpham,
      slug,
      data.thuonghieu,
      data.mota,
      data.chatlieu,
      data.kieudang,
      data.baoquan,
      data.madanhmuc,
      data.anhdaidien,
    ]);

    const masanpham = resultSP.insertId;

    // -----------------------
    //  Thêm các biến thể
    // -----------------------
    const sqlBT = `
        INSERT INTO bienthesanpham
        (masanpham, makichthuoc, mamausac, soluongton, giaban, ngaytao, trangthaihoatdongbtsp)
        VALUES (?, ?, ?, ?, ?, NOW(), 'hoạt động')
    `;

    for (const bt of data.bienthe) {
      await connection.query(sqlBT, [
        masanpham,
        bt.makichthuoc,
        bt.mamausac,
        bt.soluongton,
        bt.giaban,
      ]);
    }

    await connection.commit();

    return { masanpham };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

//Xóa sản phẩm
export const xoaSanPham = async (masanpham) => {
  const sql = `
      DELETE FROM sanpham
      WHERE masanpham = ?
  `;

  const [result] = await db.query(sql, [masanpham]);
  return result;
};

// ============================
//  UPDATE SẢN PHẨM
// ============================
export const capNhatSanPham = async (id, data) => {
  const slug = taoSlug(data.tensanpham);

  // Check trùng slug (trừ chính nó)
  const [check] = await db.query(
    "SELECT masanpham FROM sanpham WHERE slug = ? AND masanpham != ?",
    [slug, id]
  );

  if (check.length > 0) {
    throw new Error("Slug đã tồn tại! Tên sản phẩm bị trùng.");
  }

  // KHÔNG UPDATE anhdaidien Ở ĐÂY
  const sql = `
    UPDATE sanpham 
    SET 
      tensanpham = ?, 
      slug = ?, 
      thuonghieu = ?, 
      mota = ?, 
      chatlieu = ?, 
      kieudang = ?, 
      baoquan = ?, 
      madanhmuc = ?, 
      ngaycapnhat = NOW()
    WHERE masanpham = ?
  `;

  const [result] = await db.query(sql, [
    data.tensanpham,
    slug,
    data.thuonghieu,
    data.mota,
    data.chatlieu,
    data.kieudang,
    data.baoquan,
    data.madanhmuc,
    id,
  ]);

  return result;
};
