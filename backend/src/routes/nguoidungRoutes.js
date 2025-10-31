import express from "express";
import {
    dangNhapNguoiDung,
    dangKyNguoiDung,
    layThongTinCaNhan,
} from "../controllers/nguoidungController.js";
import { xacthucToken } from "../middleware/xacthuctoken.js";

const router = express.Router();

router.post("/dangnhap", dangNhapNguoiDung);
router.post("/dangky", dangKyNguoiDung);

// 🟢 API này chỉ xem được nếu có token hợp lệ
router.get("/thongtin", xacthucToken, layThongTinCaNhan);

export default router;
