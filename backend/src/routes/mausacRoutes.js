import express from "express";
import { hienThiMauSac, themMauSac, suaMauSac, xoaMau } from "../controllers/mausacController.js";

const router = express.Router();

// GET: Lấy danh sách màu sắc
router.get("/", hienThiMauSac);

// POST: thêm màu sắc mới
router.post("/them", themMauSac);

//PUT: sửa màu sắc
router.put("/sua/:id", suaMauSac);

//DELETE: xóa màu sắc
router.delete("/xoa/:id", xoaMau);
export default router;
