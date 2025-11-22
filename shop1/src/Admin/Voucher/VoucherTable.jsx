// shop1/src/Admin/Voucher/VoucherTable.jsx
import { Pencil, Trash2 } from "lucide-react";

export default function VoucherTable({ vouchers, onEdit, onDelete }) {
  const format = (v) => (v ? v.toLocaleString() + " đ" : "—");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-blue-50 text-gray-700 font-semibold">
            <th className="p-3 border">Mã giảm giá</th>
            <th className="p-3 border">Mô tả</th>
            <th className="p-3 border">Loại</th>
            <th className="p-3 border">Giá trị</th>
            <th className="p-3 border">Giảm tối đa</th>
            <th className="p-3 border">Đơn tối thiểu</th>
            <th className="p-3 border">Bắt đầu</th>
            <th className="p-3 border">Kết thúc</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {vouchers.map((v) => (
            <tr key={v.magiamgia} className="hover:bg-gray-50">
              <td className="p-3 border font-medium">{v.magiamgia}</td>
              <td className="p-3 border">{v.mota}</td>
              <td className="p-3 border text-center">{v.loaikhuyenmai}</td>
              <td className="p-3 border text-center">
                {v.giatrigiam}
                {v.loaikhuyenmai === "%" ? "%" : " đ"}
              </td>
              <td className="p-3 border text-center">{format(v.giantoida)}</td>
              <td className="p-3 border text-center">
                {format(v.dontoithieu)}
              </td>
              <td className="p-3 border text-center">
                {v.ngaybatdau?.split("T")[0]}
              </td>
              <td className="p-3 border text-center">
                {v.ngayketthuc?.split("T")[0]}
              </td>

              <td className="p-3 border">
                <div className="flex justify-center gap-3">
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => onEdit(v)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(v.magiamgia)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
