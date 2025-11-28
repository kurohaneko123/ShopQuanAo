import { taoDonHang, taoChiTietDonHang, layTatCaDonHang, layDonHangTheoID, capNhatDonHang } from "../models/donhangModel.js";

//Tạo 1 đơn hàng
export const themDonHang = async (req, res) => {
    try {
        const data = req.body;

        if (!data.danhsach || data.danhsach.length === 0) {
            return res.status(400).json({
                message: "Đơn hàng phải có ít nhất 1 sản phẩm!"
            });
        }

        // 1️. Tạo đơn hàng
        const idDonHang = await taoDonHang(data);

        // 2️. Thêm từng chi tiết đơn hàng
        for (const item of data.danhsach) {
            await taoChiTietDonHang(idDonHang, item);
        }

        return res.status(201).json({
            message: "Tạo đơn hàng thành công!",
            madonhang: idDonHang
        });

    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
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
    "đang chuẩn bị"
];

// 🛠 Sửa đơn hàng (có ràng buộc)
export const suaDonHang = async (req, res) => {
    try {
        const madonhang = req.params.id;
        const data = req.body;

        // 1. Lấy đơn hàng hiện tại
        const donhangHienTai = await layDonHangTheoID(madonhang);

        if (!donhangHienTai) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng!"
            });
        }

        // 🔥 CHUẨN HÓA TRẠNG THÁI HIỆN TẠI
        const trangThaiHienTai = donhangHienTai.trangthai.trim().toLowerCase();

        // 2. Check logic trạng thái (chỉ cho sửa khi: chờ xác nhận, đã xác nhận, đang chuẩn bị)
        if (!TRANG_THAI_CHO_PHEP_SUA.includes(trangThaiHienTai)) {
            return res.status(400).json({
                message: `Không thể sửa đơn hàng ở trạng thái hiện tại: ${donhangHienTai.trangthai}`
            });
        }

        // 3. Validate dữ liệu bắt buộc
        if (!data.tennguoinhan || !data.sodienthoai || !data.diachigiao) {
            return res.status(400).json({
                message: "Thiếu thông tin người nhận, số điện thoại hoặc địa chỉ!"
            });
        }

        // 4. Nếu muốn đổi trạng thái mới → phải hợp lệ
        const trangThaiMoi = data.trangthai?.trim().toLowerCase();

        const danhSachTrangThaiHopLe = [
            "chờ xác nhận",
            "đã xác nhận",
            "đang chuẩn bị",
            "đang giao",
            "đã giao",
            "đã hủy"
        ];

        if (trangThaiMoi && !danhSachTrangThaiHopLe.includes(trangThaiMoi)) {
            return res.status(400).json({
                message: "Trạng thái đơn hàng không hợp lệ!"
            });
        }

        // 5. Tiến hành cập nhật
        const result = await capNhatDonHang(madonhang, data);

        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công!",
            updateId: madonhang,
            oldStatus: donhangHienTai.trangthai,
            newStatus: data.trangthai
        });

    } catch (error) {
        console.error("Lỗi sửa đơn hàng:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};


//Hủy đơn hàng ( khách hàng )
const TRANG_THAI_KHACH_DUOC_HUY = [
    "chờ xác nhận",
    "đã xác nhận"
];

export const khachHuyDonHang = async (req, res) => {
    try {
        const madonhang = req.params.id;

        // 1. Lấy đơn hàng
        const donhang = await layDonHangTheoID(madonhang);
        if (!donhang) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng!"
            });
        }

        const tt = donhang.trangthai.trim().toLowerCase();

        // 2. Check logic khách hủy
        if (!TRANG_THAI_KHACH_DUOC_HUY.includes(tt)) {
            return res.status(400).json({
                message: `Khách không thể hủy đơn ở trạng thái hiện tại: ${donhang.trangthai}`
            });
        }

        // 3. Cập nhật trạng thái
        await capNhatDonHang(madonhang, {
            ...donhang,
            trangthai: "đã hủy"
        });

        return res.status(200).json({
            message: "Khách hủy đơn hàng thành công!",
            madonhang,
            oldStatus: donhang.trangthai,
            newStatus: "đã hủy"
        });

    } catch (error) {
        console.error("Lỗi khách hủy đơn:", error);
        res.status(500).json({
            message: "Lỗi máy chủ!",
            error: error.message
        });
    }
};
//Admin hủy đơn hàng
const TRANG_THAI_ADMIN_DUOC_HUY = [
    "chờ xác nhận",
    "đã xác nhận",
    "đang chuẩn bị",
    "đang giao"
];

export const adminHuyDonHang = async (req, res) => {
    try {
        const madonhang = req.params.id;

        // 1. Lấy đơn hàng
        const donhang = await layDonHangTheoID(madonhang);
        if (!donhang) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng!"
            });
        }

        const tt = donhang.trangthai.trim().toLowerCase();

        // 2. Check logic admin hủy
        if (!TRANG_THAI_ADMIN_DUOC_HUY.includes(tt)) {
            return res.status(400).json({
                message: `Admin không thể hủy đơn ở trạng thái: ${donhang.trangthai}`
            });
        }

        // 3. Update
        await capNhatDonHang(madonhang, {
            ...donhang,
            trangthai: "đã hủy"
        });

        return res.status(200).json({
            message: "Admin đã hủy đơn hàng!",
            madonhang,
            oldStatus: donhang.trangthai,
            newStatus: "đã hủy"
        });

    } catch (error) {
        console.error("Lỗi admin hủy đơn:", error);
        res.status(500).json({
            message: "Lỗi máy chủ!",
            error: error.message
        });
    }
};