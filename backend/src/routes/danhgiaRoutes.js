import express from "express";
import { taoDanhGia } from "../controllers/danhgiaController.js";
import { uploadAnhDanhGia } from "../controllers/hinhanhdanhgiaController.js";
import uploadDanhGia from "../middleware/uploadDanhGia.js";
import { xacthucToken } from "../middleware/xacthucToken.js";

const router = express.Router();

// tạo đánh giá
router.post("/", xacthucToken, taoDanhGia);

// upload ảnh đánh giá
router.post(
    "/:madanhgia/hinhanh",
    xacthucToken,
    uploadDanhGia.array("images", 5),
    uploadAnhDanhGia
);

export default router;
