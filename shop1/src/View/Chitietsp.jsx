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

  const BASE_URL = "http://localhost:5000";

  // ✅ Hàm chuẩn hóa đường dẫn ảnh
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (!path.startsWith("/")) path = "/" + path;
    return `${BASE_URL}${path}`;
  };

  // 🧠 Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sanpham/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data.sanpham);
          setVariants(data.bienthe);

          // Gán mặc định biến thể đầu tiên
          const firstVariant = data.bienthe[0];
          const firstImg = firstVariant?.hinhanh?.[0]
            ? getFullUrl(firstVariant.hinhanh[0])
            : "";

          setMainImage(firstImg);
          setSelectedColor(firstVariant?.tenmausac || "");
          setSelectedSize(firstVariant?.tenkichthuoc || "");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 🟣 Khi đổi màu → đổi ảnh đúng biến thể
  useEffect(() => {
    const variant = variants.find((v) => v.tenmausac === selectedColor);
    if (variant?.hinhanh?.length) {
      const img = getFullUrl(variant.hinhanh[0]);
      setMainImage(img);
    }
  }, [selectedColor, variants]);

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

  // 🧩 Danh sách màu & size duy nhất
  const uniqueColors = [
    ...new Map(variants.map((v) => [v.tenmausac, v.hexcode])).entries(),
  ];
  const uniqueSizes = [...new Set(variants.map((v) => v.tenkichthuoc))];

  // 🧩 Biến thể hiện tại
  const currentVariant = variants.find(
    (v) => v.tenmausac === selectedColor && v.tenkichthuoc === selectedSize
  );

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
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
                    d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75V20.25A1.5 1.5 0 006 21.75h12a1.5 1.5 0 001.5-1.5V9.75"
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

          {/* ===== GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* ===== ẢNH ===== */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[550px] rounded-3xl overflow-hidden shadow-sm border relative">
                <img
                  src={mainImage}
                  alt={product.tensanpham}
                  className="w-full h-[480px] object-cover"
                  onError={(e) =>
                    (e.target.src = getFullUrl("/images/default.jpg"))
                  }
                />
              </div>

              {/* Thumbnail */}
              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                {currentVariant?.hinhanh?.map((img, i) => (
                  <button
                    key={`${currentVariant.mabienthe}-${i}`}
                    onClick={() => setMainImage(getFullUrl(img))}
                    className={`w-20 h-20 md:w-24 md:h-24 border rounded-xl overflow-hidden transition-all ${mainImage === getFullUrl(img)
                        ? "border-black scale-105 shadow-md"
                        : "border-gray-300 hover:border-black"
                      }`}
                  >
                    <img
                      src={getFullUrl(img)}
                      alt="ảnh sản phẩm"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src = getFullUrl("/images/default.jpg"))
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ===== THÔNG TIN ===== */}
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
                  {uniqueColors.map(([colorName, hex], i) => (
                    <button
                      key={`${colorName}-${i}`}
                      onClick={() => setSelectedColor(colorName)}
                      className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === colorName
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
                  {uniqueSizes.map((s, i) => (
                    <button
                      key={`${s}-${i}`}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium ${selectedSize === s
                          ? "bg-black text-white border-black"
                          : "hover:border-black"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút thêm giỏ hàng */}
              <button className="flex items-center justify-center gap-2 bg-black text-white py-4 w-full rounded-xl font-semibold hover:bg-gray-800 transition">
                <ShoppingBag size={20} />
                Thêm vào giỏ hàng
              </button>

              {/* Mô tả */}
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
