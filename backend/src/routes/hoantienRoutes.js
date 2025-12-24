import express from "express";
import { xacthucToken } from "../middleware/xacthuctoken.js";
import { adminCheckHoanTien } from "../controllers/hoantienController.js";

const router = express.Router();

/**
 * ADMIN kiểm tra trạng thái hoàn tiền (LEVEL 1)
 * POST /api/hoantien/admin/check/:mahoantien
 */
router.post("/admin/check/:mahoantien", xacthucToken, adminCheckHoanTien);

export default router;
