import {
    themDanhGia,
    layDanhGiaTheoSanPham,
    thongKeDanhGia
} from "../models/danhgiaModel.js";
import db from "../config/db.js";

/**
 * POST /api/danhgia
 */
export const taoDanhGia = async (req, res) => {
    try {
        // Lấy user từ token
        const manguoidung = Number(req.nguoidung?.id);

        // Lấy dữ liệu từ body
        const masanpham = Number(req.body?.masanpham);
        const madonhang = Number(req.body?.madonhang);
        const sosao = Number(req.body?.sosao);
        const noidung = req.body?.noidung;

        // Validate dữ liệu đầu vào
        if (!manguoidung || !masanpham || !madonhang || !sosao) {
            return res.status(400).json({
                message: "Thiếu dữ liệu hoặc sai định dạng"
            });
        }

        // 1️ Kiểm tra đơn hàng có thuộc user & đã thanh toán chưa
        const [donhang] = await db.query(
            `
     SELECT madonhang, dathanhtoan, trangthai
FROM donhang
WHERE madonhang = ?
  AND manguoidung = ?
  AND TRIM(trangthai) = 'đã giao'
      `,
            [madonhang, manguoidung]
        );

        if (!donhang.length) {
            return res.status(403).json({
                message: "Chỉ có thể đánh giá khi đơn hàng đã giao"
            });
        }

        if (Number(donhang[0].dathanhtoan) !== 1) {
            return res.status(403).json({
                message: "Đơn hàng chưa thanh toán"
            });
        }

        // 2️ Kiểm tra sản phẩm có thuộc đơn hàng không (qua biến thể)
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
                message: "Sản phẩm không thuộc đơn hàng này"
            });
        }
        // 3 Cái này dùng để tránh spam đánh giá
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
                message: "Bạn đã đánh giá sản phẩm này rồi"
            });
        }
        // 4 Tạo đánh giá
        await themDanhGia(
            masanpham,
            manguoidung,
            madonhang,
            sosao,
            noidung
        );

        return res.json({
            success: true,
            message: "Đánh giá thành công"
        });
    } catch (err) {
        console.error("Lỗi tạo đánh giá:", err);
        return res.status(500).json({
            message: "Lỗi server"
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
            danhgia
        });
    } catch (err) {
        console.error("Lỗi lấy đánh giá:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};
