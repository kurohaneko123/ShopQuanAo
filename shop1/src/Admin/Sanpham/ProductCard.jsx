import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ProductCard({
  product,
  categoryName,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex gap-4">
        <img
          src={product.anhdaidien}
          className="w-20 h-20 object-cover rounded-lg border border-white/10"
        />

        <div className="flex-1">
          <h4 className="font-bold text-white">{product.tensanpham}</h4>
          <p className="text-sm text-gray-400">{product.thuonghieu}</p>
          <p className="text-sm text-gray-500">{categoryName}</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-2 border-t border-white/10">
        <button
          onClick={() => onView(product.masanpham)}
          className="text-indigo-400"
        >
          <Eye size={18} />
        </button>

        <button onClick={() => onEdit(product)} className="text-yellow-400">
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(product.masanpham)}
          className="text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
