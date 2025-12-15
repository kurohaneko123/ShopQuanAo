import cloudinary from "../config/cloudinary.js";
import { themAnhDanhGia } from "../models/hinhanhdanhgiaModel.js";

/**
 * POST /api/danhgia/:madanhgia/hinhanh
 */
export const uploadAnhDanhGia = async (req, res) => {
    try {
        const madanhgia = Number(req.params.madanhgia);
        const files = req.files;

        if (!madanhgia || !files || files.length === 0) {
            return res.status(400).json({
                message: "Thiếu dữ liệu hoặc chưa chọn ảnh"
            });
        }

        const uploadedImages = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: "danhgia"
                }
            );

            await themAnhDanhGia(madanhgia, result.secure_url);
            uploadedImages.push(result.secure_url);
        }

        return res.json({
            success: true,
            images: uploadedImages
        });
    } catch (err) {
        console.error("Lỗi upload ảnh đánh giá:", err);
        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};
