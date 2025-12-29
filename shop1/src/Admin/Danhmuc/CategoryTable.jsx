import { Pencil, Trash2 } from "lucide-react";

export default function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] p-4 overflow-x-auto text-gray-200">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead>
          <tr className="bg-white/5 text-gray-400 uppercase tracking-wide">
            <th className="p-3 border-b border-white/10">Mã</th>
            <th className="p-3 border-b border-white/10">Tên danh mục</th>
            <th className="p-3 border-b border-white/10">Mô tả</th>
            <th className="p-3 border-b border-white/10 text-center">
              Hành động
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {categories.map((c) => (
            <tr
              key={c.madanhmuc}
              className="hover:bg-white/5 transition-colors border-b border-white/5"
            >
              <td className="p-3">{c.madanhmuc}</td>
              <td className="p-3 text-gray-200 font-bold">{c.tendanhmuc}</td>
              <td className="p-3 text-gray-400">{c.mota}</td>

              <td className="p-3 text-center">
                <div className="flex justify-center gap-4">
                  {/* Sửa */}
                  <button
                    onClick={() => onEdit(c)}
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    <Pencil size={20} />
                  </button>

                  {/* Xóa */}
                  <button
                    onClick={() => onDelete(c.madanhmuc)}
                    className="text-red-600 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} className="text-red-500" />
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
