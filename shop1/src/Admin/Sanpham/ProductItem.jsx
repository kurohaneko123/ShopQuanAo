// src/Admin/Sanpham/ProductItem.jsx
import { Pencil, Trash2, Eye } from "lucide-react";

export default function ProductItem({
  product,
  getCategoryName,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      {/* ẢNH */}
      <td className="p-3 border border-white/10 text-center">
        {product.anhdaidien?.trim() ? (
          <img
            src={product.anhdaidien}
            className="w-20 h-20 object-cover rounded-lg shadow-lg border border-white/10"
          />
        ) : (
          <div className="w-20 h-20 bg-[#222] rounded-lg flex items-center justify-center text-gray-500 text-xs border border-white/10">
            No Image
          </div>
        )}
      </td>

      {/* TÊN */}
      <td className="p-3 border border-white/10 text-gray-200 font-bold">
        {product.tensanpham}
      </td>

      {/* THÔNG TIN */}
      <td className="p-3 border border-white/10 text-gray-400">
        {product.thuonghieu || "—"}
      </td>
      <td className="hidden md:table-cell p-3 border border-white/10 text-gray-400">
        {product.chatlieu || "—"}
      </td>

      <td className="hidden lg:table-cell p-3 border border-white/10 text-gray-400">
        {product.kieudang || "—"}
      </td>

      <td className="p-3 border border-white/10 text-gray-400">
        {getCategoryName(product.madanhmuc)}
      </td>

      {/* ACTIONS */}
      <td className="p-3 border border-white/10">
        <div className="flex justify-center gap-4">
          {/* XEM */}
          <button
            onClick={() => onView(product.masanpham)}
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            <Eye size={20} />
          </button>

          {/* SỬA */}
          <button
            onClick={() => onEdit(product)}
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            <Pencil size={20} />
          </button>

          {/* XOÁ */}
          <button
            onClick={() => onDelete(product.masanpham)}
            className="text-red-500 hover:text-red-400 transition"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}
