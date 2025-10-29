
// 🚏 Route: Định tuyến API voucher
import express from "express";
import { hienThiVoucher } from "../controllers/voucherController.js";

const router = express.Router();

// GET /api/voucher → Hiển thị tất cả voucher đang hoạt động
router.get("/", hienThiVoucher);

export default router;
