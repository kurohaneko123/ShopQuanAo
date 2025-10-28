// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js"; // 🧠 import kết nối DB

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("💚 Backend server kết nối WAMP thành công!");
});

// Test DB connection
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("❌ Lỗi kết nối DB:", error);
        res.status(500).json({ success: false, message: "Lỗi kết nối DB" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
