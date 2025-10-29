
// Import hàm từ model — nơi xử lý truy vấn database
import { layTatCaSanPham } from "../models/sanphamModel.js";
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
            error: error.message,   // Thông tin chi tiết về lỗi để tiện debug
        });
    }
};
