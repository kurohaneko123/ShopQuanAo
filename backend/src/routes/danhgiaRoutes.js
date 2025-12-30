import express from "express";
import { taoDanhGia, layDanhGia } from "../controllers/danhgiaController.js";
import { uploadAnhDanhGia } from "../controllers/hinhanhdanhgiaController.js";
import uploadDanhGia from "../middleware/uploadDanhGia.js";
import { xacthucToken } from "../middleware/xacthucToken.js";

const router = express.Router();

// TẠO ĐÁNH GIÁ
router.post("/", xacthucToken, taoDanhGia);

//  LẤY ĐÁNH GIÁ THEO SẢN PHẨM (AI CŨNG XEM ĐƯỢC)
router.get("/sanpham/:masanpham", layDanhGia);

// upload ảnh đánh giá
router.post(
  "/:madanhgia/hinhanh",
  xacthucToken,
  uploadDanhGia.array("images", 5),
  uploadAnhDanhGia
);

export default router;
