"use client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import axios from "axios";

export default function ChiTietSanPham() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("Đen");
  const [selectedSize, setSelectedSize] = useState("M");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";

  // 🧠 Lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sanpham/${id}`);
        setProduct(res.data.sanpham || null);
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  //  Ảnh backend (4 ảnh có sẵn trong thư mục public/images)
  const colorImages = {
    Đen: [
      `${BASE_URL}/images/aothuncottonden1.jpg`,
      `${BASE_URL}/images/aothuncottonden2.jpg`,
    ],
    Trắng: [
      `${BASE_URL}/images/aothuncottontrang1.jpg`,
      `${BASE_URL}/images/aothuncottontrang2.jpg`,
    ],
  };

  // Khi đổi màu
  useEffect(() => {
    const imgs = colorImages[selectedColor] || [];
    setMainImage(imgs[0]);
  }, [selectedColor]);

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

  const currentImages = colorImages[selectedColor] || [];

  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="bg-white border rounded-3xl shadow-sm p-8 md:p-10">
          {/* ===== BREADCRUMB ===== */}
          <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1">
            <Link to="/" className="hover:text-black transition">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/all" className="hover:text-black transition">
              Sản phẩm
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
              {/* ===== ẢNH CHÍNH (có hiệu ứng hover đổi ảnh) ===== */}
              <div
                className="w-full max-w-[550px] rounded-3xl overflow-hidden shadow-sm border relative bg-gray-50 flex justify-center items-center"
                //  Khi di chuột vào ảnh:
                onMouseEnter={() => {
                  //  Lấy danh sách ảnh theo màu đang chọn (đen / trắng)
                  const imgs = colorImages[selectedColor];
                  //  Nếu có ít nhất 2 ảnh thì đổi sang ảnh thứ 2
                  if (imgs && imgs.length > 1) setMainImage(imgs[1]);
                }}
                // Khi rời chuột khỏi ảnh:
                onMouseLeave={() => {
                  // Lấy lại danh sách ảnh theo màu đang chọn
                  const imgs = colorImages[selectedColor];
                  // Nếu có ít nhất 1 ảnh thì đổi lại ảnh đầu tiên
                  if (imgs && imgs.length > 0) setMainImage(imgs[0]);
                }}
              >
                {/*  Ảnh chính của sản phẩm */}
                <img
                  src={mainImage} // ảnh đang hiển thị
                  alt={product.tensanpham} // tên sản phẩm để SEO tốt hơn
                  className="max-h-[500px] w-auto object-contain rounded-3xl transition-transform duration-300" // giữ tỉ lệ ảnh chuẩn, hover mượt
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
                      className="w-full h-full object-contain bg-white rounded-lg transition-transform duration-300 hover:scale-105"
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
                <div className="text-3xl font-bold text-red-600">199.000đ</div>
              </div>

              {/* Màu sắc */}
              <div>
                <h4 className="font-semibold mb-2">Màu sắc</h4>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(colorImages).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          color === "Đen"
                            ? "#000"
                            : color === "Trắng"
                            ? "#fff"
                            : "#ccc",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Kích cỡ */}
              <div>
                <h4 className="font-semibold mb-2">Kích cỡ</h4>
                <div className="flex gap-3 flex-wrap">
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
