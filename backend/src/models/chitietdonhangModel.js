import db from "../config/db.js";

export const layChiTietDonHang = async (madonhang) => {
    const [rows] = await db.query(
        `
    SELECT 
        ctdh.machitietdonhang,
        ctdh.madonhang,
        ctdh.mabienthe,
        bt.masanpham,
        sp.tensanpham,
        ctdh.soluong,
        ctdh.giagoc,
        ctdh.loaikhuyenmai,
        ctdh.giakhuyenmai,
        ctdh.giasaukhuyenmai,
        ctdh.ghichu,
        ctdh.ngaytao,
        ctdh.ngaycapnhat
    FROM chitietdonhang ctdh
    JOIN bienthesanpham bt ON ctdh.mabienthe = bt.mabienthe
    JOIN sanpham sp ON bt.masanpham = sp.masanpham
    WHERE ctdh.madonhang = ?
    ORDER BY ctdh.machitietdonhang ASC
    `,
        [madonhang]
    );

    return rows;
};

