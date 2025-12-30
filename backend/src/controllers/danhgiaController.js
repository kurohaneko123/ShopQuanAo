import {
  themDanhGia,
  layDanhGiaTheoSanPham,
  thongKeDanhGia,
} from "../models/danhgiaModel.js";
import db from "../config/db.js";

/**
 * POST /api/danhgia
 */
export const taoDanhGia = async (req, res) => {
  try {
    // 1️ Lấy user từ token
    const manguoidung = Number(req.nguoidung?.id);

    // 2️ Lấy dữ liệu từ body
    const masanpham = Number(req.body?.masanpham);
    const madonhang = Number(req.body?.madonhang);
    const sosao = Number(req.body?.sosao);
    const noidung = req.body?.noidung;

    // 3️ Validate dữ liệu đầu vào
    if (!manguoidung || !masanpham || !madonhang || !sosao) {
      return res.status(400).json({
        message: "Thiếu dữ liệu hoặc sai định dạng",
      });
    }

    // 4️ Kiểm tra đơn hàng có thuộc user hay không
    const [donhang] = await db.query(
      `
            SELECT madonhang
            FROM donhang
            WHERE madonhang = ?
              AND manguoidung = ?
            `,
      [madonhang, manguoidung]
    );

    if (donhang.length === 0) {
      return res.status(403).json({
        message: "Đơn hàng không thuộc người dùng",
      });
    }

    // 5️ Kiểm tra sản phẩm có thuộc đơn hàng không (qua biến thể)
    const [kiemTraSanPham] = await db.query(
      `
            SELECT ctdh.machitietdonhang
            FROM chitietdonhang ctdh
            JOIN bienthesanpham bt ON ctdh.mabienthe = bt.mabienthe
            WHERE ctdh.madonhang = ?
              AND bt.masanpham = ?
            `,
      [madonhang, masanpham]
    );

    if (kiemTraSanPham.length === 0) {
      return res.status(403).json({
        message: "Sản phẩm không thuộc đơn hàng này",
      });
    }

    // 6️ Chống spam: mỗi sản phẩm chỉ được đánh giá 1 lần / đơn hàng
    const [daDanhGia] = await db.query(
      `
            SELECT 1
            FROM danhgia
            WHERE masanpham = ?
              AND manguoidung = ?
              AND madonhang = ?
            LIMIT 1
            `,
      [masanpham, manguoidung, madonhang]
    );

    if (daDanhGia.length > 0) {
      return res.status(409).json({
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // 7️⃣ Tạo đánh giá
    const madanhgia = await themDanhGia(
      masanpham,
      manguoidung,
      madonhang,
      sosao,
      noidung
    );

    return res.status(201).json({
      success: true,
      message: "Đánh giá thành công",
      madanhgia, // ✅ FE lấy để upload ảnh
    });
  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

/**
 * GET /api/danhgia/:masanpham
 */
export const layDanhGia = async (req, res) => {
  try {
    const { masanpham } = req.params;

    const danhgia = await layDanhGiaTheoSanPham(masanpham);
    const thongke = await thongKeDanhGia(masanpham);

    res.json({
      thongke,
      danhgia,
    });
  } catch (err) {
    console.error("Lỗi lấy đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
