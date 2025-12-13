import { useNavigate } from "react-router-dom";

const TheSanPham = ({ product, price, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/sanpham/${product.id}`)}
      className="group bg-white border rounded-2xl overflow-hidden
                 shadow-sm hover:shadow-lg transition cursor-pointer"
    >
      {/* Ảnh */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={product.hinhanh}
          alt={product.tensanpham}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition duration-300"
        />

        {/* Nút thêm giỏ – chỉ hiện khi hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2
                     opacity-0 group-hover:opacity-100
                     bg-black text-white px-5 py-2 rounded-full
                     text-sm font-medium shadow-lg
                     transition"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Nội dung */}
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {product.tensanpham}
        </h3>

        {product.thuonghieu && (
          <p className="mt-1 text-xs text-slate-500">{product.thuonghieu}</p>
        )}

        {price ? (
          <p className="mt-2 text-red-600 font-bold text-base">
            {price.toLocaleString("vi-VN")}đ
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Đang tải giá…</p>
        )}
      </div>
    </div>
  );
};

export default TheSanPham;
