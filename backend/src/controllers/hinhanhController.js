import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { getCloudinaryFolder } from "../utils/locnamnucloudinary.js";
import db from "../config/db.js";
import { themHinhAnh } from "../models/hinhanhModel.js";
import { xoaHinhAnh } from "../models/hinhanhModel.js";
export const uploadHinhAnhTheoBienThe = async (req, res) => {
  try {
    //  B1: KHÔNG đọc req.body ở đây

    //  B2: tạo multer storage trước
    const upload = multer({
      storage: new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
          const { mabienthe } = req.body;

          console.log(" BODY:", req.body);

          if (!mabienthe) throw new Error("Thiếu mã biến thể");

          const [btRows] = await db.query(
            "SELECT masanpham FROM bienthesanpham WHERE mabienthe = ?",
            [mabienthe]
          );

          console.log(" Mã sản phẩm:", btRows);

          const masanpham = btRows[0]?.masanpham;
          if (!masanpham) throw new Error("Không tìm thấy masanpham");

          const [spRows] = await db.query(
            "SELECT madanhmuc FROM sanpham WHERE masanpham = ?",
            [masanpham]
          );

          console.log(" Mã danh mục:", spRows);

          const madanhmuc = spRows[0]?.madanhmuc;
          if (!madanhmuc) throw new Error("Không tìm thấy madanhmuc");

          const [dmRows] = await db.query(
            "SELECT tendanhmuc FROM danhmuc WHERE madanhmuc = ?",
            [madanhmuc]
          );

          const tendanhmuc = dmRows[0]?.tendanhmuc;
          console.log(" Tên danh mục:", tendanhmuc);

          if (!tendanhmuc) throw new Error("Không tìm thấy tendanhmuc");

          const gioitinh = tendanhmuc.includes("Nam") ? "Nam" : "Nu";
          console.log(" Giới tính:", gioitinh);

          const folder = getCloudinaryFolder(gioitinh, tendanhmuc);
          console.log(" FolderPath:", folder);

          return {
            folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            public_id: Date.now().toString(),
          };
        },
      }),
    }).single("image");

    //  B3: chạy multer, lúc này mới có req.body
    upload(req, res, async (err) => {
      if (err)
        return res.status(500).json({ message: "Upload lỗi Cloudinary", err });

      const { mabienthe } = req.body;

      if (!req.file) return res.status(400).json({ message: "Chưa chọn file" });

      const url = req.file.path;

      await themHinhAnh(mabienthe, url, 1);

      res.json({
        message: "Upload thành công!",
        url,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//Xóa hình ảnh
export const xoaHinh = async (req, res) => {
  try {
    const { mahinhanh } = req.params;

    if (!mahinhanh) {
      return res.status(400).json({
        message: "Thiếu mã hình (mahinhanh)!"
      });
    }

    const result = await xoaHinhAnh(mahinhanh);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hình để xoá!"
      });
    }

    res.json({
      message: "Xoá hình ảnh thành công!",
      deleted: mahinhanh
    });

  } catch (error) {
    console.error("Lỗi khi xoá hình ảnh:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message
    });
  }
};