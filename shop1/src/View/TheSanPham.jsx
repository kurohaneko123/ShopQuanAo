import React, { useState } from "react";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <div
      className="relative bg-white shadow-md rounded-lg overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hình sản phẩm */}
      <img
        src={selectedColor.image}
        alt={product.name}
        className="w-full h-80 object-cover transition duration-300"
      />

      {/* Khi hover mới hiện */}
      {hovered && (
        <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center gap-3 p-4 transition">
          {/* Nút thêm giỏ hàng */}
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
            Thêm vào giỏ hàng +
          </button>

          {/* Danh sách size */}
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                className="px-3 py-1 border rounded-md text-sm hover:bg-black hover:text-white transition"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        {/* Nút chọn màu */}
        <div className="flex gap-2 mb-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColor.name === color.name
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.code }}
            ></button>
          ))}
        </div>

        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
