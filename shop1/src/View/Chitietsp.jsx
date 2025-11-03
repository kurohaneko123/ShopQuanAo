"use client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";

export default function ChiTietSanPham() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sanpham/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.sanpham);
          setVariants(data.bienthe);

          // Gán ảnh đầu tiên
          const firstImage = data.bienthe[0]?.hinhanh?.[0] || "";
          setMainImage(firstImage);

          // Gán mặc định màu & size
          setSelectedColor(data.bienthe[0]?.tenmausac || "");
          setSelectedSize(data.bienthe[0]?.tenkichthuoc || "");
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="pt-[150px] text-center text-gray-600">
        Đang tải sản phẩm...
      </div>
    );

  if (!product)
    return (
      <div className="pt-[150px] text-center text-gray-600">
        Không tìm thấy sản phẩm
      </div>
    );

  // Lấy danh sách màu và size duy nhất
  const uniqueColors = [
    ...new Map(variants.map((v) => [v.tenmausac, v.hexcode])).entries(),
  ];
  const uniqueSizes = [...new Set(variants.map((v) => v.tenkichthuoc))];

  // Tìm biến thể khớp với lựa chọn
  const currentVariant = variants.find(
    (v) => v.tenmausac === selectedColor && v.tenkichthuoc === selectedSize
  );

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        {/* ===== KHUNG CHÍNH ===== */}
        <div className="bg-white border rounded-3xl shadow-sm p-8 md:p-10">
          {/* ===== BREADCRUMB ===== */}
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1">
            <Link to="/" className="hover:text-black transition">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V20.25A1.5 1.5 0 006 21.75h12a1.5 1.5 0 001.5-1.5V9.75"
                  />
                </svg>
                Đồ Nam
              </span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/all" className="hover:text-black transition">
              Áo Nam
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">
              {product.tensanpham}
            </span>
          </nav>

          {/* ===== GRID: ẢNH & THÔNG TIN ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* ẢNH */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[550px] rounded-3xl overflow-hidden shadow-sm border">
                <img
                  src={mainImage}
                  alt={product.tensanpham}
                  className="w-full h-[480px] object-cover"
                />
              </div>

              {/* Thumbnail */}
              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                {currentVariant?.hinhanh?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 md:w-24 md:h-24 border rounded-xl overflow-hidden transition-all ${
                      mainImage === img
                        ? "border-black scale-105 shadow-md"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* THÔNG TIN */}
            <div className="space-y-7">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {product.tensanpham}
                </h1>
                <p className="text-gray-600 text-sm mb-3">
                  {product.thuonghieu}
                </p>
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">
                    (45 đánh giá)
                  </span>
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {Number(currentVariant?.giaban || 0).toLocaleString("vi-VN")}đ
                </div>
              </div>

              {/* Màu sắc */}
              <div>
                <h4 className="font-semibold mb-2">Màu sắc</h4>
                <div className="flex gap-3 flex-wrap">
                  {uniqueColors.map(([colorName, hex]) => (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === colorName
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Kích cỡ */}
              <div>
                <h4 className="font-semibold mb-2">Kích cỡ</h4>
                <div className="flex gap-3 flex-wrap">
                  {uniqueSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium ${
                        selectedSize === s
                          ? "bg-black text-white border-black"
                          : "hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 bg-black text-white py-4 w-full rounded-xl font-semibold hover:bg-gray-800 transition">
                <ShoppingBag size={20} />
                Thêm vào giỏ hàng
              </button>

              <div className="border-t pt-6 mt-8">
                <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                <p className="text-gray-700 leading-relaxed">{product.mota}</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Chất liệu:{" "}
                  <span className="font-medium">{product.chatlieu}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
