// Import express để tạo router
import express from "express";
// Import controller
import { hienThiSanPham } from "../controllers/sanphamController.js";

// Khởi tạo router
const router = express.Router();

// Khi người dùng truy cập GET /api/sanpham → chạy hàm hienThiSanPham
router.get("/", hienThiSanPham);

// Export router để server.js có thể dùng
export default router;
