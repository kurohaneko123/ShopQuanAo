import express from "express";
import {
    dangNhapNguoiDung,
    dangKyNguoiDung,
    layThongTinCaNhan,
    guiMaXacNhan,
    datLaiMatKhau,
    capNhatThongTinNguoiDung,
    layDanhSachNguoiDung,
    adminCapNhatNguoiDung
} from "../controllers/nguoidungController.js";
import { xacthucToken } from "../middleware/xacthuctoken.js";

const router = express.Router();

router.post("/dangnhap", dangNhapNguoiDung);
router.post("/dangky", dangKyNguoiDung);

//  API này chỉ xem được nếu có token hợp lệ
router.get("/thongtin", xacthucToken, layThongTinCaNhan);

// API Quên mật khẩu và đặt lại mật khẩu
router.post("/quenmatkhau", guiMaXacNhan);
router.post("/datlaimatkhau", datLaiMatKhau);

//API cập nhật thông tin người dùng (user)
router.put("/capnhat", xacthucToken, capNhatThongTinNguoiDung);

//API lấy danh sách người dùng ( dashboard admin)
router.get("/danhsach", xacthucToken, layDanhSachNguoiDung);

//API cập nhật thông tin người dùng (admin)
router.put("/admin/sua/:id", xacthucToken, adminCapNhatNguoiDung);
export default router;
