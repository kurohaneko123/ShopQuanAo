// Import express để tạo router
import express from "express";
// Import controller
import {
  hienThiSanPham,
  layChiTietSanPham,
  uploadAnhDaiDien,
  themSanPham,
  xoaSanPhamController,
  suaSanPham,
} from "../controllers/sanphamController.js";

// Khởi tạo router
const router = express.Router();

// Khi người dùng truy cập GET /api/sanpham → chạy hàm hienThiSanPham
router.get("/", hienThiSanPham);

//  GET /api/sanpham/:id → chi tiết sản phẩm
router.get("/:id", layChiTietSanPham);

//POST thêm sản phẩm
router.post("/them", themSanPham);

// PUT sửa sản phẩm
router.put("/sua/:id", suaSanPham);

//DELETE xóa sản phẩm
router.delete("/:id", xoaSanPhamController);

//  POST upload ảnh đại diện
router.post("/upanhdaidien", uploadAnhDaiDien);


// Export router để server.js có thể dùng
export default router;
