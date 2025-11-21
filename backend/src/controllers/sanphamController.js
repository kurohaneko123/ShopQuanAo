// Import hàm từ model — nơi xử lý truy vấn database
import {
  layTatCaSanPham,
  laySanPhamTheoID,
  layBienTheTheoSanPham,
  layHinhTheoBienThe,
} from "../models/sanphamModel.js";
// 🎯 Controller: Hiển thị toàn bộ sản phẩm
export const hienThiSanPham = async (req, res) => {
  try {
    // 🧠 Gọi hàm trong model để lấy dữ liệu sản phẩm từ database
    const sanphams = await layTatCaSanPham();

    // ✅ Trả kết quả về cho client (frontend)
    // Gửi mã trạng thái 200 (OK) và dữ liệu JSON chứa danh sách sản phẩm
    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công!", // Thông báo cho frontend
      data: sanphams, // Dữ liệu chính — danh sách các sản phẩm
    });
  } catch (error) {
    // ❌ Nếu có lỗi xảy ra trong quá trình truy vấn hoặc xử lý
    console.error("Lỗi khi lấy sản phẩm:", error);

    // Trả lỗi 500 (Internal Server Error) kèm nội dung lỗi chi tiết
    res.status(500).json({
      message: "Lỗi máy chủ", // Thông báo chung
      error: error.message, // Thông tin chi tiết về lỗi để tiện debug
    });
  }
};

// 🟢 Lấy chi tiết sản phẩm theo ID
export const layChiTietSanPham = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Thông tin sản phẩm
    const sanpham = await laySanPhamTheoID(id);
    if (!sanpham)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    // 2️⃣ Biến thể
    const bienthe = await layBienTheTheoSanPham(id);

    // 3️⃣ Hình ảnh
    const hinhanh = await layHinhTheoBienThe(id);

    // 4️⃣ Gộp ảnh theo biến thể
    const bientheCoHinh = bienthe.map((bt) => ({
      ...bt,
      hinhanh: hinhanh
        .filter((h) => h.mabienthe === bt.mabienthe)
        .map((h) => h.urlhinhanh),
    }));

    res.json({
      message: "Lấy chi tiết sản phẩm thành công!",
      sanpham,
      bienthe: bientheCoHinh,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// 🟢 Upload ảnh đại diện sản phẩm
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import db from "../config/db.js";
import { getCloudinaryFolder } from "../utils/locnamnucloudinary.js";

// 🟢 Upload ảnh đại diện sản phẩm
export const uploadAnhDaiDien = async (req, res) => {
  try {
    const upload = multer({
      storage: new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
          const { masanpham } = req.body;

          if (!masanpham) throw new Error("Thiếu mã sản phẩm");

          // Lấy madanhmuc
          const [spRows] = await db.query(
            "SELECT madanhmuc FROM sanpham WHERE masanpham = ?",
            [masanpham]
          );

          const madanhmuc = spRows[0]?.madanhmuc;
          if (!madanhmuc) throw new Error("Không tìm thấy madanhmuc");

          // Lấy tên danh mục
          const [dmRows] = await db.query(
            "SELECT tendanhmuc FROM danhmuc WHERE madanhmuc = ?",
            [madanhmuc]
          );

          const tendanhmuc = dmRows[0]?.tendanhmuc;
          const gioitinh = tendanhmuc.includes("Nam") ? "Nam" : "Nu";

          const folder = getCloudinaryFolder(gioitinh, tendanhmuc);

          return {
            folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            public_id: `avatar_${masanpham}_${Date.now()}`,
          };
        },
      }),
    }).single("image");

    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Upload lỗi Cloudinary", err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Chưa chọn file" });
      }

      const { masanpham } = req.body;
      const url = req.file.path;

      // Cập nhật vào DB
      await db.query("UPDATE sanpham SET anhdaidien = ? WHERE masanpham = ?", [
        url,
        masanpham,
      ]);

      res.json({
        message: "Upload ảnh đại diện thành công!",
        url,
      });
    });
  } catch (error) {
    console.log("❌ Lỗi backend:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
