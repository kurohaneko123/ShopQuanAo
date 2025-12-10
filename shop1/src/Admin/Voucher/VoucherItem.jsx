import { Pencil, Trash2 } from "lucide-react";

export default function VoucherItem({ v, onEdit, onDelete, formatDate }) {
  return (
    <tr className="hover:bg-white/5 border-b border-white/5 transition-colors text-gray-200">
      <td className="p-3 text-center font-semibold">{v.magiamgia}</td>
      <td className="p-3">{v.mota}</td>

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

      <td className="p-3 text-center">
        {v.giatrigiam}
        {v.loaikhuyenmai === "%" ? "%" : "đ"}
      </td>

      <td className="p-3 text-center">{v.giantoida?.toLocaleString()} đ</td>
      <td className="p-3 text-center">{v.dontoithieu?.toLocaleString()} đ</td>

      <td className="p-3 text-center text-gray-400">
        {formatDate(v.ngaybatdau)}
      </td>
      <td className="p-3 text-center text-gray-400">
        {formatDate(v.ngayketthuc)}
      </td>

      <td className="p-3">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onEdit(v)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(v.magiamgia)}
            className="text-red-500 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
