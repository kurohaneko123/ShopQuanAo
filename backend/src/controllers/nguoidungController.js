import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {
  taoNguoiDung,
  timNguoiDungTheoEmail,
  kiemTraMatKhau,
  capNhatThongTinModel,
  layTatCaNguoiDung,
  adminCapNhatNguoiDungModel,
} from "../models/nguoidungModel.js";

dotenv.config();

//  Hàm tạo token JWT
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

//  Đăng ký người dùng
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

//  Đăng nhập người dùng
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
    console.error(" Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập." });
  }
};

//  Lấy thông tin người dùng từ token (API bảo vệ)
export const layThongTinCaNhan = async (req, res) => {
  try {
    const user = req.nguoidung; // middleware xacthucToken sẽ gán vào req.nguoidung
    res.json({
      message: "Lấy thông tin người dùng thành công!",
      nguoidung: user,
    });
  } catch (error) {
    console.error(" Lỗi lấy thông tin cá nhân:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi lấy thông tin người dùng." });
  }
};

// =================== QUÊN MẬT KHẨU ===================

// 1️. Gửi mã xác nhận (OTP) qua email
export const guiMaXacNhan = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email." });

    const [rows] = await pool.query("SELECT * FROM nguoidung WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống." });

    const ma = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 số
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // hết hạn sau 10 phút

    await pool.query(
      "UPDATE nguoidung SET resettoken = ?, thoigianhethan = ? WHERE email = ?",
      [ma, expireTime, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop Quần Áo Horizon" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác nhận đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${rows[0].hoten || "bạn"}!</h3>
        <p>Mã xác nhận của bạn là:</p>
        <h1 style="color:#1a73e8; letter-spacing:4px;">${ma}</h1>
        <p>Mã này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      `,
    });

    res.json({ message: "Mã xác nhận đã được gửi đến email của bạn!" });
  } catch (error) {
    console.error(" Lỗi gửi mã xác nhận:", error);
    res.status(500).json({ message: "Không thể gửi mã xác nhận." });
  }
};

// 2️. Đặt lại mật khẩu sau khi nhập mã
export const datLaiMatKhau = async (req, res) => {
  try {
    const { email, resettoken, matkhaumoi } = req.body;

    if (!email || !resettoken || !matkhaumoi) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết." });
    }

    // ✅ CHỈ QUERY THEO EMAIL
    const [rows] = await pool.query(
      "SELECT * FROM nguoidung WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Người dùng không tồn tại!" });
    }

    const nguoidung = rows[0];

    // ✅ SO SÁNH OTP TRONG JS + TRIM + ÉP KIỂU
    if (
      !nguoidung.resettoken ||
      String(nguoidung.resettoken).trim() !== String(resettoken).trim()
    ) {
      return res.status(400).json({ message: "Mã xác nhận không hợp lệ!" });
    }

    // ✅ CHECK HẾT HẠN
    if (new Date(nguoidung.thoigianhethan).getTime() < Date.now()) {
      return res.status(400).json({ message: "Mã xác nhận đã hết hạn!" });
    }

    // 🔐 HASH PASSWORD
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash(matkhaumoi, 10);

    await pool.query(
      `UPDATE nguoidung
   SET matkhau = ?, resettoken = NULL, thoigianhethan = NULL
   WHERE email = ?`,
      [hash, email]
    );


    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error(" Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đặt lại mật khẩu." });
  }
};

//Sửa thông tin người dùng ( khách hàng )
export const capNhatThongTinNguoiDung = async (req, res) => {
  try {
    //  LẤY ID TỪ TOKEN (THEO MIDDLEWARE CỦA ANH)
    const maNguoiDung = req.nguoidung.id;

    const { hoTen, soDienThoai, diaChi } = req.body;

    // Nếu không có gì để cập nhật
    if (!hoTen && !soDienThoai && !diaChi) {
      return res.status(400).json({
        message: "Không có dữ liệu nào để cập nhật!",
      });
    }

    const ok = await capNhatThongTinModel(
      maNguoiDung,
      hoTen,
      soDienThoai,
      diaChi
    );

    if (!ok) {
      return res.status(400).json({
        message: "Không có trường hợp hợp lệ để cập nhật!",
      });
    }

    return res.json({
      message: "Cập nhật thông tin thành công!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Lỗi server!",
      error: err.message,
    });
  }
};
//Lấy tất cả người dùng ( dashboard )
export const layDanhSachNguoiDung = async (req, res) => {
  try {
    const data = await layTatCaNguoiDung();

    res.json({
      message: "Lấy danh sách người dùng thành công!",
      total: data.length,
      nguoidung: data,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

//Cập nhật thông tin của người dùng ( admin )
export const adminCapNhatNguoiDung = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = req.nguoidung;

    // Chỉ admin mới được dùng API này
    if (admin.vaitro !== "admin") {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền sửa thông tin người dùng!",
      });
    }

    const { hoten, sodienthoai, diachi, email, vaitro, trangthai } = req.body;

    const data = { hoten, sodienthoai, diachi, email, vaitro, trangthai };

    const ok = await adminCapNhatNguoiDungModel(id, data);

    return res.json({
      message: "Admin đã cập nhật thông tin người dùng thành công!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Cập nhật thất bại!",
      error: error.message,
    });
  }
};
