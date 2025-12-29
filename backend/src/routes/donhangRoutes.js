import express from "express";
import {
  themDonHang,
  layDanhSachDonHang,
  suaDonHang,
  khachHuyDonHang,
  adminHuyDonHang,
  layDonHangById,
  layLichSuDonHangCuaToi,
  adminXacNhanDonHang,
  adminHuyDonHangZaloPay,
  sanPhamNoiBat,
  demDonHang,
} from "../controllers/donhangController.js";
import { xacthucToken } from "../middleware/xacthuctoken.js";
const router = express.Router();
//Tạo 1 đơn hàng
router.post("/them", themDonHang);
//Lấy danh sách đơn hàng
router.get("/", layDanhSachDonHang);
//Sửa đơn hàng ( có ràng buộc )
router.put("/sua/:id", suaDonHang);
//Sản phẩm nổi bật
router.get("/sanphamnoibat", sanPhamNoiBat);
//Đếm đơn hàng
// ĐẾM ĐƠN HÀNG (admin polling)
router.get("/count", demDonHang);
//Khách hủy đơn
router.put("/huy/:id", khachHuyDonHang);
//Admin hủy đơn
router.put("/admin/huy/:id", adminHuyDonHang);
// API Lịch sử đơn hàng của người dùng (dựa theo JWT)
router.get("/lsdonhang", xacthucToken, layLichSuDonHangCuaToi);
// API Admin hủy đơn hàng zalopay
router.put("/admin/huy-zalopay/:id", adminHuyDonHangZaloPay);
//ROUTES có PARAM luôn để cuối
// API Admin xác nhận đơn hàng
router.put("/xacnhan/:id", adminXacNhanDonHang);
// API để OrderSuccess polling
router.get("/:madonhang", layDonHangById);

export default router;
