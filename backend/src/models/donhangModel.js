import db from "../config/db.js";

// Tạo 1 đơn hàng mới
export const taoDonHang = async (data, connection) => {
    const sql = `
    INSERT INTO donhang 
    (manguoidung, tennguoinhan, sodienthoai, diachigiao, donvivanchuyen,
     hinhthucthanhtoan, tongtien, phivanchuyen, tongthanhtoan, ghichu, ngaytao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

    const [result] = await connection.query(sql, [
        data.manguoidung,
        data.tennguoinhan,
        data.sodienthoai,
        data.diachigiao,
        data.donvivanchuyen,
        data.hinhthucthanhtoan,
        data.tongtien,
        data.phivanchuyen,
        data.tongthanhtoan,
        data.ghichu || null,
    ]);

    return result.insertId;
};

// Thêm chi tiết đơn hàng
export const taoChiTietDonHang = async (idDon, chitiet, connection) => {
    const sql = `
    INSERT INTO chitietdonhang 
    (madonhang, mabienthe, soluong, giagoc, giakhuyenmai, ngaytao)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

    const [result] = await connection.query(sql, [
        idDon,
        chitiet.mabienthe,
        chitiet.soluong,
        chitiet.giagoc,
        chitiet.giakhuyenmai,
    ]);

    return result;
};

// Lấy danh sách đơn hàng (có kèm thông tin hoàn tiền nếu có)
export const layTatCaDonHang = async () => {
    const [rows] = await db.query(`
    SELECT 
      dh.madonhang,
      dh.manguoidung,
      nd.hoten AS ten_nguoi_dung,
      dh.tennguoinhan,
      dh.sodienthoai,
      dh.diachigiao,
      dh.donvivanchuyen,
      dh.hinhthucthanhtoan,
      dh.tongtien,
      dh.phivanchuyen,
      dh.tongthanhtoan,
      dh.trangthai,
      dh.ngaytao,

      -- 🔥 HOÀN TIỀN
      ht.mahoantien,
      ht.trangthai AS trangthai_hoantien

    FROM donhang dh
    LEFT JOIN nguoidung nd 
      ON dh.manguoidung = nd.manguoidung
    LEFT JOIN hoantien ht 
      ON dh.madonhang = ht.madonhang
      AND ht.mahoantien = (
        SELECT mahoantien 
        FROM hoantien 
        WHERE madonhang = dh.madonhang 
        ORDER BY ngaytao DESC 
        LIMIT 1
      )
    ORDER BY dh.madonhang DESC
  `);

    return rows;
};

//Code sửa đơn hàng (có ràng buộc)
// Lấy đơn hàng theo ID (KÈM TRẠNG THÁI HOÀN TIỀN)
export const layDonHangTheoID = async (madonhang) => {
    const [rows] = await db.query(
        `
        SELECT 
            d.madonhang,
            d.trangthai,
            d.dathanhtoan,
            d.ghn_order_code,
            d.tennguoinhan,
            d.sodienthoai,
            d.diachigiao,
            d.donvivanchuyen,
            d.hinhthucthanhtoan,
            d.phivanchuyen,
            d.tongthanhtoan,

            -- 🔥 THÔNG TIN HOÀN TIỀN (NẾU CÓ)
            h.mahoantien,
            h.trangthai AS trangthai_hoantien,
            h.sotienhoan,
            h.ngaytao AS ngay_hoan_tien

        FROM donhang d
        LEFT JOIN hoantien h 
            ON d.madonhang = h.madonhang
        WHERE d.madonhang = ?
        ORDER BY h.ngaytao DESC
        LIMIT 1
        `,
        [madonhang]
    );

    return rows[0];
};



// Cập nhật đơn hàng ( dùng chung cho sửa và hủy)
export const capNhatDonHang = async (id, data) => {
    const sql = `
        UPDATE donhang
        SET 
            tennguoinhan = ?, 
            sodienthoai = ?, 
            diachigiao = ?, 
            donvivanchuyen = ?, 
            hinhthucthanhtoan = ?, 
            ghichu = ?, 
            phivanchuyen = ?, 
            tongthanhtoan = ?, 
            trangthai = ?, 
            ngaycapnhat = NOW()
        WHERE madonhang = ?
    `;

    const params = [
        data.tennguoinhan,
        data.sodienthoai,
        data.diachigiao,
        data.donvivanchuyen,
        data.hinhthucthanhtoan,
        data.ghichu || null,
        data.phivanchuyen,
        data.tongthanhtoan,
        data.trangthai,
        id
    ];

    const [result] = await db.query(sql, params);
    return result;
};

//Lịch sử đơn hàng ( dựa theo mã người dùng)
// ================================
// LẤY LỊCH SỬ ĐƠN HÀNG THEO NGƯỜI DÙNG
// ================================
export const layDonHangTheoNguoiDung = async (manguoidung) => {
    const [rows] = await db.query(`
        SELECT 
            dh.madonhang,
            dh.tennguoinhan,
            dh.sodienthoai,
            dh.diachigiao,
            dh.hinhthucthanhtoan,
            dh.tongthanhtoan,
            dh.trangthai,
            dh.ngaytao
        FROM donhang dh
        WHERE dh.manguoidung = ?
        ORDER BY dh.ngaytao DESC
    `, [manguoidung]);

    return rows;
};
//CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
export const capNhatTrangThaiDonHang = async (madonhang, trangthai) => {
    const [result] = await db.query(
        `
        UPDATE donhang
        SET trangthai = ?, ngaycapnhat = NOW()
        WHERE madonhang = ?
        `,
        [trangthai, madonhang]
    );

    return result;
};
