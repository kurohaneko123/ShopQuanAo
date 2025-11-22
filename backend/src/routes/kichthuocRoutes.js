import express from "express";
import { hienThiKichThuoc, taoKichThuoc, suaKichThuoc, xoaKichThuocController } from "../controllers/kichthuocController.js";

const router = express.Router();

// GET: lấy danh sách kích thước
router.get("/", hienThiKichThuoc);

// POST thêm kích thước
router.post("/them", taoKichThuoc);

// PUT sửa kích thước
router.put("/sua/:id", suaKichThuoc);

// DELETE xoá kích thước
router.delete("/xoa/:id", xoaKichThuocController);
export default router;
