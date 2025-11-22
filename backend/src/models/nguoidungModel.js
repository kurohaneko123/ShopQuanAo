import pool from "../config/db.js";
import bcrypt from "bcryptjs";

//  Tạo người dùng mới
export const taoNguoiDung = async ({ email, matkhau, hoten, sodienthoai }) => {
    const [kiemTra] = await pool.query("SELECT * FROM nguoidung WHERE email = ?", [email]);
    if (kiemTra.length > 0) throw new Error("Email đã tồn tại!");

    const matkhauMaHoa = await bcrypt.hash(matkhau, 10);
    await pool.query(
        `INSERT INTO nguoidung (email, matkhau, hoten, sodienthoai, vaitro, trangthai)
     VALUES (?, ?, ?, ?, 'client', 'hoạt động')`,
        [email, matkhauMaHoa, hoten || null, sodienthoai || null]
    );
};

//  Tìm người dùng theo email
export const timNguoiDungTheoEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM nguoidung WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
};

//  Kiểm tra mật khẩu
export const kiemTraMatKhau = async (matkhauNhap, matkhauDB) => {
    return await bcrypt.compare(matkhauNhap, matkhauDB);
};
