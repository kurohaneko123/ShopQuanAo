import express from "express";
import { uploadHinhAnhTheoBienThe } from "../controllers/hinhanhController.js";

const router = express.Router();

router.post("/upload-bienthe", uploadHinhAnhTheoBienThe);

export default router;
