import db from "../config/db.js";
//Upload hình ảnh đánh giá
export const themAnhDanhGia = async (madanhgia, duongdananh) => {
    await db.query(
        `
        INSERT INTO hinhanhdanhgia (madanhgia, duongdananh)
        VALUES (?, ?)
        `,
        [madanhgia, duongdananh]
    );
};
//Lấy hình ảnh đánh giá
export const layAnhDanhGiaTheoDanhGia = async (madanhgia) => {
    const [rows] = await db.query(
        `
        SELECT duongdananh
        FROM hinhanhdanhgia
        WHERE madanhgia = ?
        `,
        [madanhgia]
    );
    return rows;
};
