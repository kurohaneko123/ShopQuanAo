"use client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import axios from "axios";

export default function ChiTietSanPham() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";
  /* ====== 🛒 Hàm thêm sản phẩm vào giỏ hàng ====== */
  const handleAddToCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];

      // 👉 Lấy đúng variant theo màu + size
      const variant = variants.find(
        (v) => v.tenmausac === selectedColor && v.tenkichthuoc === selectedSize
      );

      if (!variant) {
        alert("Không tìm thấy biến thể sản phẩm!");
        return;
      }

      const newItem = {
        mabienthe: variant.mabienthe,
        tensanpham: product.tensanpham,
        giagoc: Number(variant.giaban),
        giakhuyenmai: Number(variant.giaban),
        soluong: 1,
        mausac: variant.tenmausac,
        size: variant.tenkichthuoc,
        hinhanh: variant.hinhanh?.[0] || product.anhdaidien,
        sku: variant.sku,
      };

      // 👉 Nếu đã có cùng mabienthe thì + số lượng
      const existing = stored.find((i) => i.mabienthe === newItem.mabienthe);
      if (existing) existing.soluong += 1;
      else stored.push(newItem);

      localStorage.setItem("cart", JSON.stringify(stored));

      // 🔔 Gửi sự kiện để Header cập nhật badge
      window.dispatchEvent(new Event("cartUpdated"));

      // ================================
      // ⭐ TOAST CAO CẤP – ZARA STYLE
      // ================================
      const toast = document.createElement("div");
      toast.className = `
  fixed z-[9999]
  bg-white border border-gray-200 shadow-xl
  rounded-xl p-4 w-[320px]
  flex items-center gap-3
  animate-fadeIn

  top-[90px]       /* ĐẨY XUỐNG DƯỚI ICON */
  right-[110px]    /* CANH THEO VỊ TRÍ GIỎ HÀNG */
`;

      toast.innerHTML = `
      <img src="${newItem.hinhanh}" 
           class="w-14 h-14 rounded-md object-cover border" />

      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-900">
          Đã thêm vào giỏ hàng
        </p>

        <p class="text-xs text-gray-500 mt-0.5">
          ${product.tensanpham} • ${newItem.mausac}, ${newItem.size}
        </p>
      </div>

    `;

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  // 🧠 Lấy chi tiết sản phẩm + biến thể
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sanpham/${id}`);

        setProduct(res.data.sanpham);
        setVariants(res.data.bienthe);

        // Auto chọn màu + size đầu tiên
        if (res.data.bienthe.length > 0) {
          setSelectedColor(res.data.bienthe[0].tenmausac);
          setSelectedSize(res.data.bienthe[0].tenkichthuoc);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 👉 Lấy variant theo màu
  const currentVariant = variants.find((v) => v.tenmausac === selectedColor);

  // 👉 Lấy danh sách ảnh
  const currentImages = currentVariant?.hinhanh || [];

  // 👉 Reset ảnh chính mỗi lần đổi màu
  useEffect(() => {
    if (currentImages.length > 0) {
      setMainImage(currentImages[0]);
    } else {
      setMainImage(null); // không có ảnh -> tránh lỗi src=""
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

  //  Lấy danh sách màu
  const colorList = [...new Set(variants.map((v) => v.tenmausac))];

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="bg-white border rounded-3xl shadow-sm p-8 md:p-10">
          {/* ===== BREADCRUMB ===== */}
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1">
            <Link to="/" className="hover:text-black transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/all" className="hover:text-black transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">
              {product.tensanpham}
            </span>
          </nav>

          {/* ===== GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* ===== ẢNH SẢN PHẨM ===== */}
            <div className="flex flex-col items-center">
              {/* ẢNH CHÍNH */}
              <div className="w-full max-w-[550px] rounded-3xl overflow-hidden shadow-sm border bg-gray-50 flex justify-center items-center">
                <img
                  src={mainImage}
                  alt={product.tensanpham}
                  className="max-h-[500px] w-auto object-contain rounded-3xl"
                />
              </div>

              {/* Thumbnail */}
              <div className="flex gap-3 justify-center mt-6 flex-wrap">
                {currentImages.map((img, i) => (
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
                      alt="ảnh sản phẩm"
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ===== THÔNG TIN ===== */}
            <div className="space-y-7">
              <h1 className="text-3xl font-bold">{product.tensanpham}</h1>
              <p className="text-gray-600 text-sm">{product.thuonghieu}</p>

              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  (45 đánh giá)
                </span>
              </div>

              <div className="text-3xl font-bold text-red-600">199.000đ</div>

              {/* Màu sắc */}
              <div>
                <h4 className="font-semibold mb-2">Màu sắc</h4>

                <div className="flex gap-3 flex-wrap">
                  {colorList.map((color) => {
                    const colorHex = variants.find(
                      (v) => v.tenmausac === color
                    )?.hexcode;

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition
            ${
              selectedColor === color
                ? "border-black scale-110"
                : "border-gray-300"
            }`}
                        style={{ backgroundColor: colorHex || "#ccc" }}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-semibold mb-2">Kích cỡ</h4>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL"].map((s) => (
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

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-black text-white py-4 w-full rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                <ShoppingBag size={20} />
                Thêm vào giỏ hàng
              </button>

              {/* Mô tả */}
              <div className="border-t pt-6 mt-8">
                <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                <p className="text-gray-700 leading-relaxed">{product.mota}</p>
                <p className="text-gray-600 text-sm mt-1">
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
