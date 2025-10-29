
// 🚏 Route: Định tuyến API
import express from "express";
import { hienThiDanhMuc } from "../controllers/danhmucController.js";

const router = express.Router();

// Khi truy cập GET /api/danhmuc → chạy controller hienThiDanhMuc
router.get("/", hienThiDanhMuc);

export default router;
