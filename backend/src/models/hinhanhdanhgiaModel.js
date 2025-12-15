import db from "../config/db.js";

export const themAnhDanhGia = async (madanhgia, duongdananh) => {
    await db.query(
        `
        INSERT INTO hinhanhdanhgia (madanhgia, duongdananh)
        VALUES (?, ?)
        `,
        [madanhgia, duongdananh]
    );
};
