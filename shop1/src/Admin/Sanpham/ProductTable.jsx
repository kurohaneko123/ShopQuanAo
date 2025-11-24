// src/Admin/Sanpham/ProductTable.jsx
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
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-blue-50 text-gray-700 font-semibold">
            <th className="p-3 border">Ảnh</th>
            <th className="p-3 border">Tên sản phẩm</th>
            <th className="p-3 border">Thương hiệu</th>
            <th className="p-3 border">Chất liệu</th>
            <th className="p-3 border">Kiểu dáng</th>
            <th className="p-3 border">Danh mục</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>

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
