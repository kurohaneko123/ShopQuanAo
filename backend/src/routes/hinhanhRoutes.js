import express from "express";
import { uploadHinhAnhTheoBienThe, xoaHinh } from "../controllers/hinhanhController.js";

const router = express.Router();

router.post("/upload-bienthe", uploadHinhAnhTheoBienThe);

router.delete("/xoa/:mahinhanh", xoaHinh);


export default router;
