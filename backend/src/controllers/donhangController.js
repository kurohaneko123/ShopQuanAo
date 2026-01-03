import db from "../config/db.js";
import axios from "axios";
import {
  taoDonHang,
  taoChiTietDonHang,
  layTatCaDonHang,
  layDonHangTheoID,
  capNhatDonHang,
  layDonHangTheoNguoiDung,
  capNhatTrangThaiDonHang,
  laySanPhamBanChay,
} from "../models/donhangModel.js";


// Tạo 1 đơn hàng (CHỈ CHECK KHO – KHÔNG TRỪ)
export const themDonHang = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const data = req.body;

    if (!data.danhsach || data.danhsach.length === 0) {
      return res.status(400).json({
        message: "Đơn hàng phải có ít nhất 1 sản phẩm!",
      });
    }

    await connection.beginTransaction();

    /* =======================
       1️⃣ TẠO ĐƠN HÀNG (PENDING)
    ======================= */
    const idDonHang = await taoDonHang(data, connection);
    // 👉 trạng thái đơn lúc này: "pending" / "cho_xac_nhan"

    /* =======================
       2️⃣ CHECK KHO + THÊM CHI TIẾT
       ❌ KHÔNG TRỪ KHO
    ======================= */
    for (const item of data.danhsach) {
      const { mabienthe, soluong } = item;

      // 🔍 CHỈ CHECK TỒN
      const [[bienthe]] = await connection.query(
        `
        SELECT soluongton
        FROM bienthesanpham
        WHERE mabienthe = ?
        `,
        [mabienthe]
      );

      if (!bienthe || bienthe.soluongton < soluong) {
        await connection.rollback();

        return res.status(400).json({
          message: `Biến thể ${mabienthe} không đủ số lượng tồn`,
        });
      }

      // ✅ Chỉ thêm chi tiết đơn hàng
      await taoChiTietDonHang(idDonHang, item, connection);
    }

    await connection.commit();

    return res.status(201).json({
      message: "Tạo đơn hàng thành công!",
      madonhang: idDonHang,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi hệ thống khi tạo đơn hàng:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi tạo đơn hàng",
    });
  } finally {
    connection.release();
  }
};


//Lấy danh sách đơn hàng
export const layDanhSachDonHang = async (req, res) => {
  try {
    const orders = await layTatCaDonHang();

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công!",
      data: orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

//Sửa đơn hàng ( có ràng buộc )
// Danh sách trạng thái hợp lệ
// Danh sách trạng thái hợp lệ (viết thường để so sánh)
const TRANG_THAI_CHO_PHEP_SUA = [
  "chờ xác nhận",
  "đã xác nhận",
  "đang chuẩn bị",
];

// 🔧 SỬA THÔNG TIN ĐƠN HÀNG (KHÔNG ĐỤNG TRẠNG THÁI)
export const suaDonHang = async (req, res) => {
  try {
    const madonhang = req.params.id;
    const data = req.body;

    // 1️⃣ Lấy đơn hàng hiện tại
    const donhangHienTai = await layDonHangTheoID(madonhang);

    if (!donhangHienTai) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng!",
      });
    }

    const trangThaiHienTai = donhangHienTai.trangthai
      ? donhangHienTai.trangthai.trim().toLowerCase()
      : null;

    if (!trangThaiHienTai) {
      return res.status(400).json({
        message: "Đơn hàng không có trạng thái hợp lệ!",
      });
    }

    // 🚫 CHẶN TUYỆT ĐỐI ĐỔI TRẠNG THÁI
    if (data.trangthai) {
      return res.status(400).json({
        message: "API này không cho phép thay đổi trạng thái đơn hàng!",
      });
    }

    // 2️⃣ KHÔNG cho sửa khi đơn đã kết thúc
    const TRANG_THAI_CAM_SUA = ["đã giao", "đã hủy", "đã hoàn tiền"];

    if (TRANG_THAI_CAM_SUA.includes(trangThaiHienTai)) {
      return res.status(400).json({
        message: `Không thể sửa thông tin đơn hàng ở trạng thái: ${donhangHienTai.trangthai}`,
      });
    }

    // 3️⃣ Validate dữ liệu bắt buộc
    if (!data.tennguoinhan || !data.sodienthoai || !data.diachigiao) {
      return res.status(400).json({
        message: "Thiếu thông tin người nhận, số điện thoại hoặc địa chỉ!",
      });
    }

    // 4️⃣ Chuẩn hóa data update (KHÔNG có trangthai)
    const payload = {
      tennguoinhan: data.tennguoinhan,
      sodienthoai: data.sodienthoai,
      diachigiao: data.diachigiao,
      ghichu: data.ghichu || null,
      donvivanchuyen: donhangHienTai.donvivanchuyen,
      hinhthucthanhtoan: donhangHienTai.hinhthucthanhtoan,
      phivanchuyen: donhangHienTai.phivanchuyen,
      tongthanhtoan: donhangHienTai.tongthanhtoan,
      trangthai: donhangHienTai.trangthai, // 🔒 giữ nguyên
    };

    // 5️⃣ Update DB
    await capNhatDonHang(madonhang, payload);

    return res.status(200).json({
      message: "Cập nhật thông tin đơn hàng thành công!",
      madonhang,
      trangthai: donhangHienTai.trangthai,
    });
  } catch (error) {
    console.error("Lỗi sửa thông tin đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};

// Khách hàng GỬI YÊU CẦU HỦY ĐƠN (chờ admin xác nhận)
// Khách hàng GỬI YÊU CẦU HỦY ĐƠN (chờ admin xác nhận)
const TRANG_THAI_KHACH_DUOC_YEU_CAU_HUY = [
  "chờ xác nhận",
  "đã xác nhận",
];

export const khachHuyDonHang = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const madonhang = req.params.id;
    const { lydo_huy } = req.body;

    if (!lydo_huy || !lydo_huy.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập lý do hủy đơn hàng",
      });
    }

    await connection.beginTransaction();

    const donhang = await layDonHangTheoID(madonhang);
    if (!donhang) {
      await connection.rollback();
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng!",
      });
    }

    // Đã thanh toán → không cho yêu cầu hủy
    if (Number(donhang.dathanhtoan) === 1) {
      await connection.rollback();
      return res.status(400).json({
        message: "Đơn hàng đã thanh toán, vui lòng liên hệ admin",
      });
    }

    const tt = donhang.trangthai
      ? donhang.trangthai.trim().toLowerCase()
      : "chờ xác nhận";

    if (!TRANG_THAI_KHACH_DUOC_YEU_CAU_HUY.includes(tt)) {
      await connection.rollback();
      return res.status(400).json({
        message: `Không thể yêu cầu hủy ở trạng thái: ${donhang.trangthai}`,
      });
    }

    // ✅ CHỈ CẬP NHẬT TRẠNG THÁI + LÝ DO (KHÔNG HOÀN KHO)
    await connection.query(
      `
      UPDATE donhang
      SET trangthai = 'yêu cầu hủy',
          lydo_huy = ?,
          ngaycapnhat = NOW()
      WHERE madonhang = ?
      `,
      [lydo_huy.trim(), madonhang]
    );

    await connection.commit();

    return res.json({
      message: "Đã gửi yêu cầu hủy đơn hàng. Vui lòng chờ admin xác nhận.",
      madonhang,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Lỗi khách yêu cầu hủy đơn:", err);

    return res.status(500).json({
      message: "Lỗi máy chủ",
    });
  } finally {
    connection.release();
  }
};


// Admin XÁC NHẬN HỦY ĐƠN HÀNG
export const adminHuyDonHang = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const madonhang = req.params.id;
    await connection.beginTransaction();

    const donhang = await layDonHangTheoID(madonhang);
    if (!donhang) {
      await connection.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    const tt = donhang.trangthai
      ? donhang.trangthai.trim().toLowerCase()
      : "";

    /* 🚫 CHẶN ĐƠN ĐANG / ĐÃ GIAO */
    if (["đang giao", "đã giao"].includes(tt)) {
      await connection.rollback();
      return res.status(400).json({
        message:
          "Đơn hàng đã hoặc đang giao, không thể hủy. Vui lòng xử lý theo quy trình trả hàng.",
      });
    }

    /* ✅ CHỈ HỦY KHI KHÁCH ĐÃ GỬI YÊU CẦU */
    if (tt !== "yêu cầu hủy") {
      await connection.rollback();
      return res.status(400).json({
        message: "Chỉ có thể hủy đơn khi khách đã gửi yêu cầu hủy",
      });
    }

    /* ================== HỦY GHN (NẾU CÓ) ================== */
    if (donhang.ghn_order_code) {
      try {
        const ghnRes = await axios.post(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel",
          { order_codes: [donhang.ghn_order_code] },
          {
            headers: {
              "Content-Type": "application/json",
              ShopId: process.env.GHN_SHOP_ID,
              Token: process.env.GHN_TOKEN,
            },
          }
        );

        // 👉 GHN có trả return_code
        if (ghnRes.data?.code !== 200) {
          throw new Error("GHN không cho phép hủy đơn");
        }
      } catch (ghnErr) {
        await connection.rollback();
        return res.status(400).json({
          message:
            "Huỷ GHN thất bại. Đơn đang được GHN xử lý, không thể hủy trên hệ thống.",
          ghn: ghnErr?.response?.data || ghnErr.message,
        });
      }
    }

    /* ================== HOÀN KHO ================== */
    const [chitiet] = await connection.query(
      `SELECT mabienthe, soluong FROM chitietdonhang WHERE madonhang = ?`,
      [madonhang]
    );

    for (const item of chitiet) {
      await connection.query(
        `UPDATE bienthesanpham
         SET soluongton = soluongton + ?
         WHERE mabienthe = ?`,
        [item.soluong, item.mabienthe]
      );
    }

    /* ================== UPDATE ĐƠN ================== */
    await connection.query(
      `
      UPDATE donhang
      SET trangthai = 'đã hủy',
          ngaycapnhat = NOW()
      WHERE madonhang = ?
      `,
      [madonhang]
    );

    /* ================== REFUND ZALOPAY ================== */
    if (
      donhang.hinhthucthanhtoan === "ZALOPAY" &&
      Number(donhang.dathanhtoan) === 1
    ) {
      try {
        await axios.post(
          "http://localhost:5000/api/payment/zalopay/refund",
          { madonhang },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          }
        );
      } catch (refundErr) {
        console.error(
          "AUTO REFUND FAILED:",
          refundErr?.response?.data || refundErr.message
        );
        // ❗ KHÔNG rollback
      }
    }

    await connection.commit();

    return res.json({
      message: "Admin đã xác nhận hủy đơn hàng thành công",
      madonhang,
      oldStatus: donhang.trangthai,
      newStatus: "đã hủy",
    });
  } catch (err) {
    await connection.rollback();
    console.error("Lỗi admin hủy đơn:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  } finally {
    connection.release();
  }
};


//Lấy đơn hàng theo id
export const layDonHangById = async (req, res) => {
  try {
    const { madonhang } = req.params;

    const donhang = await layDonHangTheoID(madonhang);

    if (!donhang) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json(donhang);
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// ================================
// LỊCH SỬ ĐƠN HÀNG THEO NGƯỜI DÙNG
// ================================
export const layLichSuDonHangCuaToi = async (req, res) => {
  try {
    // LẤY TỪ xacthucToken
    const manguoidung = req.nguoidung.id;

    const orders = await layDonHangTheoNguoiDung(manguoidung);

    return res.status(200).json({
      message: "Lấy lịch sử đơn hàng thành công!",
      data: orders,
    });
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn hàng:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};
// ADMIN XÁC NHẬN ĐƠN HÀNG + TRỪ KHO
export const adminXacNhanDonHang = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const madonhang = req.params.id;

    await connection.beginTransaction();

    // 1️. Lấy đơn hàng hiện tại
    const donhang = await layDonHangTheoID(madonhang);
    if (!donhang) {
      await connection.rollback();
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng!",
      });
    }

    const trangThaiHienTai = donhang.trangthai
      ? donhang.trangthai.trim().toLowerCase()
      : null;

    // 2️. Chỉ cho xác nhận khi CHỜ XÁC NHẬN
    if (trangThaiHienTai !== "chờ xác nhận") {
      await connection.rollback();
      return res.status(400).json({
        message: `Không thể xác nhận đơn ở trạng thái: ${donhang.trangthai}`,
      });
    }

    // 3️. Lấy chi tiết đơn hàng
    const [chiTiet] = await connection.query(
      `
            SELECT mabienthe, soluong
            FROM chitietdonhang
            WHERE madonhang = ?
            `,
      [madonhang]
    );

    if (chiTiet.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Đơn hàng không có sản phẩm!",
      });
    }

    // 4️. CHECK & TRỪ KHO
    for (const item of chiTiet) {
      // lock row tránh race condition
      const [[bienthe]] = await connection.query(
        `
                SELECT soluongton
                FROM bienthesanpham
                WHERE mabienthe = ?
                FOR UPDATE
                `,
        [item.mabienthe]
      );

      if (!bienthe) {
        await connection.rollback();
        return res.status(400).json({
          message: `Biến thể ${item.mabienthe} không tồn tại`,
        });
      }

      if (bienthe.soluongton < item.soluong) {
        await connection.rollback();
        return res.status(400).json({
          message: `Không đủ tồn kho cho biến thể ${item.mabienthe}`,
        });
      }

      // trừ kho
      await connection.query(
        `
                UPDATE bienthesanpham
                SET soluongton = soluongton - ?
                WHERE mabienthe = ?
                `,
        [item.soluong, item.mabienthe]
      );
    }

    // 5️. Update trạng thái đơn hàng
    await connection.query(
      `
            UPDATE donhang
            SET trangthai = 'đã xác nhận',
                ngaycapnhat = NOW()
            WHERE madonhang = ?
            `,
      [madonhang]
    );

    await connection.commit();

    return res.json({
      message: "Xác nhận đơn hàng & trừ kho thành công",
      madonhang,
      oldStatus: donhang.trangthai,
      newStatus: "đã xác nhận",
      deductedItems: chiTiet.length,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Lỗi xác nhận đơn hàng:", err);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: err.message,
    });
  } finally {
    connection.release();
  }
};
// ADMIN HỦY ĐƠN HÀNG ZALOPAY (GỌI HOÀN TIỀN)
export const adminHuyDonHangZaloPay = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const madonhang = req.params.id;
    await connection.beginTransaction();

    // 1️⃣ Lấy đơn hàng
    const donhang = await layDonHangTheoID(madonhang);
    if (!donhang) {
      await connection.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (donhang.hinhthucthanhtoan !== "ZALOPAY") {
      await connection.rollback();
      return res.status(400).json({ message: "Không phải đơn ZaloPay" });
    }

    // 🔥 KHÓA DOUBLE REFUND
    const trangThai = donhang.trangthai?.trim().toLowerCase();
    if (trangThai === "đang hoàn tiền" || trangThai === "đã hoàn tiền") {
      await connection.rollback();
      return res.status(400).json({
        message: "Đơn hàng đang hoặc đã hoàn tiền",
      });
    }

    // 2️⃣ Insert hoantien (đang hoàn tiền)
    const [insertRefund] = await connection.query(
      `
            INSERT INTO hoantien (madonhang, sotienhoan, trangthai, ngaytao)
            VALUES (?, ?, 'đang hoàn tiền', NOW())
            `,
      [madonhang, donhang.tongthanhtoan]
    );

    const refund_id = insertRefund.insertId;

    // 3️⃣ Gọi ZaloPay refund
    const zalopayResult = await goiZaloPayRefund(donhang);

    if (zalopayResult.return_code !== 1) {
      await connection.query(
        `UPDATE hoantien SET trangthai='hoàn tiền thất bại' WHERE mahoantien=?`,
        [refund_id]
      );
      await connection.rollback();
      return res.status(400).json({ message: "Hoàn tiền ZaloPay thất bại" });
    }

    // 4️⃣ Hoàn kho
    const [chitiet] = await connection.query(
      `SELECT mabienthe, soluong FROM chitietdonhang WHERE madonhang=?`,
      [madonhang]
    );

    for (const item of chitiet) {
      await connection.query(
        `UPDATE bienthesanpham SET soluongton = soluongton + ? WHERE mabienthe=?`,
        [item.soluong, item.mabienthe]
      );
    }

    // 5️⃣ Update đơn hàng + hoantien
    await connection.query(
      `
            UPDATE donhang
            SET trangthai='đã hoàn tiền', ngaycapnhat=NOW()
            WHERE madonhang=?
            `,
      [madonhang]
    );

    await connection.query(
      `UPDATE hoantien SET trangthai='đã hoàn tiền' WHERE mahoantien=?`,
      [refund_id]
    );

    await connection.commit();

    return res.json({
      message: "Hoàn tiền ZaloPay thành công",
      madonhang,
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  } finally {
    connection.release();
  }
};
export const sanPhamNoiBat = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const data = await laySanPhamBanChay(limit);

    res.json({
      message: "Lấy sản phẩm nổi bật thành công",
      data,
    });
  } catch (err) {
    console.error("Lỗi sản phẩm nổi bật:", err);
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
};
export const demDonHang = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM donhang
    `);

    res.json({
      total: rows[0].total,
    });
  } catch (err) {
    console.error("demDonHang error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const layChiTietHoaDon = async (req, res) => {
  try {
    const { madonhang } = req.params;

    // LẤY ĐẦY ĐỦ THÔNG TIN ĐƠN HÀNG (CÓ NGÀY TẠO)
    const [[donhang]] = await db.query(
      `
  SELECT
    dh.madonhang,
    dh.ngaytao,
    dh.trangthai,
    dh.hinhthucthanhtoan,
    dh.donvivanchuyen,
    dh.tennguoinhan,
    dh.sodienthoai,
    dh.diachigiao,
    dh.ghichu,

    -- map đúng tên cột DB của em
    dh.tongtien       AS tonghang,
    dh.phivanchuyen   AS phiship,
    0                 AS giamgia,
    dh.tongthanhtoan  AS tongthanhtoan

  FROM donhang dh
  WHERE dh.madonhang = ?
  `,
      [madonhang]
    );

    if (!donhang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // 🔹 LẤY DANH SÁCH SẢN PHẨM (GIỮ NGUYÊN CODE CŨ)
    const [items] = await db.query(
      `
      SELECT
        sp.tensanpham,
        ct.soluong,
        COALESCE(ct.giasaukhuyenmai, ct.giagoc, bt.giaban) AS gia,
        ms.tenmausac AS mau,
        kt.tenkichthuoc AS size
      FROM chitietdonhang ct
      JOIN bienthesanpham bt ON ct.mabienthe = bt.mabienthe
      JOIN sanpham sp ON bt.masanpham = sp.masanpham
      LEFT JOIN mausac ms ON bt.mamausac = ms.mamausac
      LEFT JOIN kichthuoc kt ON bt.makichthuoc = kt.makichthuoc
      WHERE ct.madonhang = ?
      `,
      [madonhang]
    );

    donhang.danhsachsanpham = items;

    return res.json(donhang);
  } catch (err) {
    console.error("Lỗi chi tiết hóa đơn:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
