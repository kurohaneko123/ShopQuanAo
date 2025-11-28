import express from "express";
import { hienThiChiTietDonHang } from "../controllers/chitietdonhangController.js";

const router = express.Router();

router.get("/:id", hienThiChiTietDonHang);

export default router;
