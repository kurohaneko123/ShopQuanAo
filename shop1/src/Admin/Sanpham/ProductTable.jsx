import ProductItem from "./ProductItem";

export default function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
  onView,
}) {
  const getCategoryName = (id) => {
    const cate = categories.find((c) => c.madanhmuc === id);
    return cate ? cate.tendanhmuc : "—";
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] overflow-hidden">
      <table className="w-full text-sm text-gray-300">
        {/* HEADER */}
        <thead className="bg-white/5 text-gray-400 uppercase tracking-wide">
          <tr>
            <th className="p-3 border-b border-white/10">Ảnh</th>
            <th className="p-3 border-b border-white/10">Tên sản phẩm</th>
            <th className="p-3 border-b border-white/10">Thương hiệu</th>
            <th className="p-3 border-b border-white/10">Chất liệu</th>
            <th className="p-3 border-b border-white/10">Kiểu dáng</th>
            <th className="p-3 border-b border-white/10">Danh mục</th>
            <th className="p-3 border-b border-white/10">Hành động</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {products.map((p) => (
            <ProductItem
              key={p.masanpham}
              product={p}
              getCategoryName={getCategoryName}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
