import express from "express";
import { xoaBienTheController, suaBienThe } from "../controllers/bientheController.js";

const router = express.Router();

// DELETE biến thể theo id
router.delete("/xoa/:id", xoaBienTheController);

// PUT biến thể theo id
router.put("/sua/:id", suaBienThe);

export default router;
