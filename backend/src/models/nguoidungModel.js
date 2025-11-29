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

// CẬP NHẬT THÔNG TIN NGƯỜI DÙNG(User)
export const capNhatThongTinModel = async (maNguoiDung, hoTen, soDienThoai, diaChi) => {
    const fields = [];
    const values = [];

    if (hoTen) {
        fields.push("hoten = ?");
        values.push(hoTen);
    }

    if (soDienThoai) {
        fields.push("sodienthoai = ?");
        values.push(soDienThoai);
    }

    if (diaChi) {
        fields.push("diachi = ?");
        values.push(diaChi);
    }

    if (fields.length === 0) return false;

    values.push(maNguoiDung);

    const sql = `
        UPDATE nguoidung
        SET ${fields.join(", ")}, ngaycapnhat = NOW()
        WHERE manguoidung = ?
    `;

    // ⭐ Dùng pool (KHÔNG PHẢI db)
    await pool.query(sql, values);

    return true;
};
//Lấy tất cả danh sách người dùng (dashboard)
export const layTatCaNguoiDung = async () => {
    const [rows] = await pool.query("SELECT * FROM nguoidung ORDER BY manguoidung DESC");
    return rows;
};

//Cập nhật thông tin người dùng(Admin)
export const adminCapNhatNguoiDungModel = async (id, data) => {
    const fields = [];
    const values = [];

    // Các trường admin được phép sửa
    if (data.hoten) {
        fields.push("hoten = ?");
        values.push(data.hoten);
    }

    if (data.sodienthoai) {
        fields.push("sodienthoai = ?");
        values.push(data.sodienthoai);
    }

    if (data.diachi) {
        fields.push("diachi = ?");
        values.push(data.diachi);
    }

    if (data.vaitro) {
        fields.push("vaitro = ?");
        values.push(data.vaitro);
    }

    if (data.trangthai) {
        fields.push("trangthai = ?");
        values.push(data.trangthai);
    }

    if (data.email) {
        // Kiểm tra email chưa tồn tại
        const [check] = await pool.query(
            "SELECT * FROM nguoidung WHERE email = ? AND manguoidung != ?",
            [data.email, id]
        );

        if (check.length > 0) {
            throw new Error("Email mới đã tồn tại!");
        }

        fields.push("email = ?");
        values.push(data.email);
    }

    if (fields.length === 0) {
        throw new Error("Không có dữ liệu hợp lệ để cập nhật!");
    }

    values.push(id);

    const sql = `
        UPDATE nguoidung
        SET ${fields.join(", ")}, ngaycapnhat = NOW()
        WHERE manguoidung = ?
    `;

    await pool.query(sql, values);

    return true;
};