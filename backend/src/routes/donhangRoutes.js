import express from "express";
import { themDonHang, layDanhSachDonHang, suaDonHang, khachHuyDonHang, adminHuyDonHang } from "../controllers/donhangController.js";

const router = express.Router();
//Tạo 1 đơn hàng
router.post("/them", themDonHang);
//Lấy danh sách đơn hàng
router.get("/", layDanhSachDonHang);
//Sửa đơn hàng ( có ràng buộc )
router.put("/sua/:id", suaDonHang);
//Khách hủy đơn
router.put("/huy/:id", khachHuyDonHang);
//Admin hủy đơn
router.put("/admin/huy/:id", adminHuyDonHang);
export default router;
