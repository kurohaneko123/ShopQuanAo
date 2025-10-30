// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js"; // 🧠 Kết nối MySQL
import sanphamRoutes from "./src/routes/sanphamRoutes.js"; // 🧩 Route sản phẩm
import danhmucRoutes from "./src/routes/danhmucRoutes.js"; // 🧩 Route danh mục
import voucherRoutes from "./src/routes/voucherRoutes.js"; // 🧩 Route voucher
import nguoidungRoutes from "./src/routes/nguoidungRoutes.js"; // 🧩 Route người dùng (đăng nhập + đăng ký)

dotenv.config();

const app = express();

// 🧱 Middleware
app.use(cors());
app.use(express.json());

// 🔰 Route test server
app.get("/", (req, res) => {
    res.send("💚 Backend server kết nối WAMP thành công & JWT đang hoạt động ngon lành!");
});

// 🔍 Route test DB
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("❌ Lỗi kết nối DB:", error);
        res.status(500).json({ success: false, message: "Lỗi kết nối DB" });
    }
});

// 🚀 Gắn các route API chính
app.use("/api/sanpham", sanphamRoutes);
app.use("/api/danhmuc", danhmucRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/nguoidung", nguoidungRoutes); // ✅ Thêm route người dùng (JWT login/register)

// ⚙️ Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
