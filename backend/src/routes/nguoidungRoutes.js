import express from "express";
import {
    dangNhapNguoiDung,
    dangKyNguoiDung,
    layThongTinCaNhan,
    guiMaXacNhan,
    datLaiMatKhau
} from "../controllers/nguoidungController.js";
import { xacthucToken } from "../middleware/xacthuctoken.js";

const router = express.Router();

router.post("/dangnhap", dangNhapNguoiDung);
router.post("/dangky", dangKyNguoiDung);

// 🟢 API này chỉ xem được nếu có token hợp lệ
router.get("/thongtin", xacthucToken, layThongTinCaNhan);

// API Quên mật khẩu và đặt lại mật khẩu
router.post("/quenmatkhau", guiMaXacNhan);
router.post("/datlaimatkhau", datLaiMatKhau);

export default router;
