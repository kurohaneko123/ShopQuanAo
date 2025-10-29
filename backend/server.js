// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js"; // 🧠 Kết nối MySQL
import sanphamRoutes from "./src/routes/sanphamRoutes.js"; // 🧩 Import routes sản phẩm
import danhmucRoutes from "./src/routes/danhmucRoutes.js";// 🧩 Import routes danh mục
import voucherRoutes from "./src/routes/voucherRoutes.js";// 🧩 Import routes voucher

dotenv.config();

const app = express();

// 🧱 Middleware
app.use(cors());
app.use(express.json());

// 🔰 Route test server
app.get("/", (req, res) => {
    res.send("💚 Backend server kết nối WAMP thành công!");
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

// 🚀 Gắn route sản phẩm (đồng bộ controller + model)
app.use("/api/sanpham", sanphamRoutes);
// 🚀 Gắn route danh mục (đồng bộ controller + model)
app.use("/api/danhmuc", danhmucRoutes);
// 🚀 Gắn route voucher (đồng bộ controller + model)
app.use("/api/voucher", voucherRoutes);
// ⚙️ Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
