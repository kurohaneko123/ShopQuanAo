// shop1/src/Admin/Voucher/VoucherTable.jsx
import { Pencil, Trash2 } from "lucide-react";

export default function VoucherTable({ vouchers, onEdit, onDelete }) {
  const format = (v) => (v ? v.toLocaleString() + " đ" : "—");

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl shadow-lg overflow-x-auto text-gray-200">
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="bg-white/5 text-gray-400 uppercase tracking-wide text-center">
            <th className="p-3 border-b border-white/10 w-[130px]">
              Mã giảm giá
            </th>
            <th className="p-3 border-b border-white/10 w-[250px] text-left">
              Mô tả
            </th>
            <th className="p-3 border-b border-white/10 w-[90px]">Loại</th>
            <th className="p-3 border-b border-white/10 w-[120px]">Giá trị</th>
            <th className="p-3 border-b border-white/10 w-[140px]">
              Giảm tối đa
            </th>
            <th className="p-3 border-b border-white/10 w-[140px]">
              Đơn tối thiểu
            </th>
            <th className="p-3 border-b border-white/10 w-[130px]">Bắt đầu</th>
            <th className="p-3 border-b border-white/10 w-[130px]">Kết thúc</th>
            <th className="p-3 border-b border-white/10 w-[120px]">
              Hành động
            </th>
          </tr>
        </thead>

        <tbody>
          {vouchers.map((v) => (
            <tr
              key={v.magiamgia}
              className="hover:bg-white/5 border-b border-white/5 transition-colors"
            >
              <td className="p-3 text-center font-medium text-gray-200">
                {v.magiamgia}
              </td>
              <td className="p-3 text-left text-gray-300">{v.mota}</td>

              {/* Badge loại */}
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                    v.loaikhuyenmai === "%"
                      ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
                      : "bg-emerald-600/30 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {v.loaikhuyenmai}
                </span>
              </td>

              {/* Giá trị */}
              <td className="p-3 text-center text-gray-200">
                {v.giatrigiam}
                {v.loaikhuyenmai === "%" ? "%" : " đ"}
              </td>

              {/* Giảm tối đa */}
              <td className="p-3 text-center text-gray-300">
                {format(v.giantoida)}
              </td>

              {/* Đơn tối thiểu */}
              <td className="p-3 text-center text-gray-300">
                {format(v.dontoithieu)}
              </td>

              {/* Ngày */}
              <td className="p-3 text-center text-gray-400">
                {v.ngaybatdau?.split("T")[0]}
              </td>
              <td className="p-3 text-center text-gray-400">
                {v.ngayketthuc?.split("T")[0]}
              </td>

              {/* Actions */}
              <td className="p-3">
                <div className="flex justify-center gap-4">
                  <button
                    className="text-yellow-400 hover:text-yellow-300 transition"
                    onClick={() => onEdit(v)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-400 transition"
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
