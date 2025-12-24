import db from "../config/db.js";
import { queryRefundStatusService } from "./zalopay/ZalopayQueryRefund_Controller.js";
import {
    layHoanTienTheoId,
    capNhatTrangThaiHoanTien
} from "../models/hoantienModel.js";

export const adminCheckHoanTien = async (req, res) => {
    const { mahoantien } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1️⃣ Lấy bản ghi hoàn tiền (QUA MODEL)
        const hoantien = await layHoanTienTheoId(connection, mahoantien);

        if (!hoantien) {
            await connection.rollback();
            return res.status(404).json({ message: "Không tìm thấy hoàn tiền" });
        }

        if (hoantien.trangthai === "đã hoàn tiền") {
            await connection.rollback();
            return res.json({
                message: "Đơn đã hoàn tiền trước đó",
                hoantien
            });
        }

        // 2️⃣ Gọi ZaloPay refund-status
        const result = await queryRefundStatusService(hoantien.m_refund_id);

        // 3️⃣ Nếu hoàn tiền xong
        if (result.sub_return_code === 1) {
            await capNhatTrangThaiHoanTien(
                connection,
                mahoantien,
                "đã hoàn tiền"
            );

            await connection.query(
                `
        UPDATE donhang
        SET trangthai = 'đã hoàn tiền',
            ngaycapnhat = NOW()
        WHERE madonhang = ?
        `,
                [hoantien.madonhang]
            );
        }

        await connection.commit();

        return res.json({
            message: "Đã kiểm tra trạng thái hoàn tiền",
            result
        });

    } catch (err) {
        await connection.rollback();
        return res.status(500).json({
            message: "Lỗi máy chủ",
            error: err.message
        });
    } finally {
        connection.release();
    }
};
