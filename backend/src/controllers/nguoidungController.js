import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
    taoNguoiDung,
    timNguoiDungTheoEmail,
    kiemTraMatKhau,
} from "../models/nguoidungModel.js";

dotenv.config();

// 🧠 Hàm tạo token JWT
const taoToken = (nguoidung) => {
    return jwt.sign(
        {
            id: nguoidung.manguoidung,
            email: nguoidung.email,
            vaitro: nguoidung.vaitro,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );
};

// 🟢 Đăng ký người dùng
export const dangKyNguoiDung = async (req, res) => {
    try {
        const { email, matkhau, hoten, sodienthoai } = req.body;
        if (!email || !matkhau)
            return res.status(400).json({ message: "Thiếu email hoặc mật khẩu." });

        await taoNguoiDung({ email, matkhau, hoten, sodienthoai });

        const nguoidung = await timNguoiDungTheoEmail(email);
        const token = taoToken(nguoidung);

        res.status(201).json({
            message: "Đăng ký thành công!",
            nguoidung: {
                manguoidung: nguoidung.manguoidung,
                email: nguoidung.email,
                hoten: nguoidung.hoten,
                vaitro: nguoidung.vaitro,
            },
            token,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🟣 Đăng nhập người dùng
export const dangNhapNguoiDung = async (req, res) => {
    try {
        const { email, matkhau } = req.body;
        if (!email || !matkhau)
            return res.status(400).json({ message: "Thiếu thông tin đăng nhập." });

        const nguoidung = await timNguoiDungTheoEmail(email);
        if (!nguoidung)
            return res.status(404).json({ message: "Email không tồn tại." });

        const hopLe = await kiemTraMatKhau(matkhau, nguoidung.matkhau);
        if (!hopLe)
            return res.status(401).json({ message: "Mật khẩu không đúng." });

        const token = taoToken(nguoidung);

        res.json({
            message: "Đăng nhập thành công!",
            nguoidung: {
                manguoidung: nguoidung.manguoidung,
                email: nguoidung.email,
                hoten: nguoidung.hoten,
                sodienthoai: nguoidung.sodienthoai,
                vaitro: nguoidung.vaitro,
            },
            token,
        });
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập." });
    }
};
// 🟢 Lấy thông tin người dùng từ token (API bảo vệ)
export const layThongTinCaNhan = async (req, res) => {
    try {
        const user = req.nguoidung; // middleware xacthucToken sẽ gán vào req.nguoidung
        res.json({
            message: "Lấy thông tin người dùng thành công!",
            nguoidung: user,
        });
    } catch (error) {
        console.error("❌ Lỗi lấy thông tin cá nhân:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin người dùng." });
    }
};

