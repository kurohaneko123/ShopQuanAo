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
    <tr className="hover:bg-gray-50">
      {/* Ảnh */}
      <td className="p-3 border text-center">
        {product.anhdaidien && product.anhdaidien.trim() !== "" ? (
          <img
            src={product.anhdaidien}
            className="w-20 h-20 object-cover rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </td>

      {/* Thông tin */}
      <td className="p-3 border font-medium">{product.tensanpham}</td>
      <td className="p-3 border">{product.thuonghieu || "—"}</td>
      <td className="p-3 border">{product.chatlieu || "—"}</td>
      <td className="p-3 border">{product.kieudang || "—"}</td>
      <td className="p-3 border">{getCategoryName(product.madanhmuc)}</td>

      {/* Hành động */}
      <td className="p-3 border">
        <div className="flex justify-center gap-3">
          {/* Xem chi tiết */}
          <button
            onClick={() => onView(product.masanpham)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </button>

          {/* Sửa */}
          <button
            onClick={() => onEdit(product)}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <Pencil size={18} />
          </button>

          {/* Xóa */}
          <button
            onClick={() => onDelete(product.masanpham)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
