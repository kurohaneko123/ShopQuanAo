
//  Route: Định tuyến API
import express from "express";
import { hienThiDanhMuc, themDanhMuc, suaDanhMuc, xoaDanhMucController } from "../controllers/danhmucController.js";

const router = express.Router();

// Khi truy cập GET /api/danhmuc → chạy controller hienThiDanhMuc
router.get("/", hienThiDanhMuc);

// POST thêm danh mục mới
router.post("/them", themDanhMuc);

//PUT sửa danh mục
router.put("/sua/:id", suaDanhMuc);

//DELETE xóa danh mục
router.delete("/xoa/:id", xoaDanhMucController);

export default router;
