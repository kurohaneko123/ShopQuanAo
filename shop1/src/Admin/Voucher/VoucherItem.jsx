import { Pencil, Trash2 } from "lucide-react";

export default function VoucherItem({ v, onEdit, onDelete, formatDate }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border font-semibold">{v.magiamgia}</td>
      <td className="p-2 border">{v.mota}</td>
      <td className="p-2 border text-center">{v.loaikhuyenmai}</td>
      <td className="p-2 border text-center">
        {v.giatrigiam}
        {v.loaikhuyenmai === "%" ? "%" : "đ"}
      </td>
      <td className="p-2 border text-right">
        {v.giantoida?.toLocaleString()} đ
      </td>
      <td className="p-2 border text-right">
        {v.dontoithieu?.toLocaleString()} đ
      </td>
      <td className="p-2 border text-center">{formatDate(v.ngaybatdau)}</td>
      <td className="p-2 border text-center">{formatDate(v.ngayketthuc)}</td>

      <td className="p-2 border text-center flex gap-3 justify-center">
        <button onClick={() => onEdit(v)} className="text-yellow-500">
          <Pencil size={18} />
        </button>

        <button onClick={() => onDelete(v.magiamgia)} className="text-red-500">
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
