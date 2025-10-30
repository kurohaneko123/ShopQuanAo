// backend/src/middleware/xacthucToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware xác thực JWT
 * - Kiểm tra xem user có gửi token hợp lệ không
 * - Nếu có thì decode ra thông tin user
 * - Nếu không thì chặn luôn
 */
export const xacthucToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Lấy phần sau "Bearer"

    if (!token) {
        return res
            .status(401)
            .json({ message: "Thiếu token! Vui lòng đăng nhập để tiếp tục." });
    }

    try {
        // ✅ Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Lưu user vào req để controller phía sau có thể xài
        req.nguoidung = decoded;
        next(); // Cho qua
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
