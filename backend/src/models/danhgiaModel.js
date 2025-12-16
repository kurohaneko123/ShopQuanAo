import db from "../config/db.js";

/**
 * Tạo đánh giá mới
 */
export const themDanhGia = async (
    masanpham,
    manguoidung,
    madonhang,
    sosao,
    noidung
) => {
    return db.query(
        `
    INSERT INTO danhgia (masanpham, manguoidung, madonhang, sosao, noidung)
    VALUES (?, ?, ?, ?, ?)
    `,
        [masanpham, manguoidung, madonhang, sosao, noidung]
    );
};


/**
 * Kiểm tra user đã đánh giá sản phẩm trong đơn này chưa
 */
export const kiemTraDaDanhGia = async (
    masanpham,
    manguoidung,
    madonhang
) => {
    const [rows] = await db.query(
        `
    SELECT * FROM danhgia
    WHERE masanpham = ? AND manguoidung = ? AND madonhang = ?
    `,
        [masanpham, manguoidung, madonhang]
    );
    return rows;
};

/**
 * Lấy danh sách đánh giá theo sản phẩm
 */
export const layDanhGiaTheoSanPham = async (masanpham) => {
    const [rows] = await db.query(
        `
        SELECT 
          dg.madanhgia,
          dg.sosao,
          dg.noidung,
          dg.ngaytao,
          nd.hoten AS tennguoidung,
          GROUP_CONCAT(hd.duongdananh) AS hinhanh
        FROM danhgia dg
        JOIN nguoidung nd ON dg.manguoidung = nd.manguoidung
        LEFT JOIN hinhanhdanhgia hd ON dg.madanhgia = hd.madanhgia
        WHERE dg.masanpham = ?
        GROUP BY dg.madanhgia
        ORDER BY dg.ngaytao DESC
        `,
        [masanpham]
    );

    // convert chuỗi ảnh → mảng
    return rows.map(dg => ({
        ...dg,
        hinhanh: dg.hinhanh ? dg.hinhanh.split(",") : []
    }));
};

//LEFT JOIN -> đánh giá không có ảnh vẫn hiện
// GROUP_CONCAT -> gom nhiều ảnh thành 1 dòng
//split(",") -> trả về array ảnh cho FE


/**
 * Tính sao trung bình
 */
export const thongKeDanhGia = async (masanpham) => {
    const [rows] = await db.query(
        `
    SELECT 
      COUNT(*) AS tongdanhgia,
      AVG(sosao) AS diemtb
    FROM danhgia
    WHERE masanpham = ?
    `,
        [masanpham]
    );
    return rows[0];
};
