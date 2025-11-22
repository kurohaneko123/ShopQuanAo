import express from "express";
import {
    hienThiVoucher,
    themVoucher,
    suaVoucher,
    xoaMotVoucher
} from "../controllers/voucherController.js";

const router = express.Router();

router.get("/", hienThiVoucher);
router.post("/themvoucher", themVoucher);
router.put("/suavoucher/:id", suaVoucher);
router.delete("/xoavoucher/:id", xoaMotVoucher);
export default router;
