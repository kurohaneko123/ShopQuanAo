import { Pencil, Trash2 } from "lucide-react";

export default function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="border p-3">Mã</th>
          <th className="border p-3">Tên danh mục</th>
          <th className="border p-3">Mô tả</th>
          <th className="border p-3">Hành động</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((c) => (
          <tr key={c.madanhmuc} className="hover:bg-gray-50">
            <td className="border p-3">{c.madanhmuc}</td>
            <td className="border p-3">{c.tendanhmuc}</td>
            <td className="border p-3">{c.mota}</td>

            <td className="border p-3 text-center">
              <button
                onClick={() => onEdit(c)}
                className="text-yellow-500 hover:text-yellow-600 mr-3"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(c.madanhmuc)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
