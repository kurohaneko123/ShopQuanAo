import multer from "multer";
import path from "path";
import fs from "fs";
import { themHinhAnh } from "../models/hinhanhModel.js";

const imageDir = "public/images";
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

// 🟢 Upload ảnh theo mã biến thể
export const uploadHinhAnhTheoBienThe = [
    upload.single("image"),
    async (req, res) => {
        try {
            const { mabienthe } = req.body;
            if (!req.file) return res.status(400).json({ message: "Không có file nào được tải lên" });
            if (!mabienthe) return res.status(400).json({ message: "Thiếu mã biến thể" });

            const urlhinhanh = `/images/${req.file.filename}`;
            await themHinhAnh(mabienthe, urlhinhanh, 1);

            res.status(200).json({
                message: "Upload thành công!",
                url: urlhinhanh,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server khi upload ảnh" });
        }
    },
];
