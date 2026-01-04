"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import ProductRecommendations from "./chitietsp/ProductRecommendations";
import RecentViewed from "./chitietsp/RecentViewed.jsx";
import ProductReviews from "./chitietsp/ProductReviews.jsx";

export default function ChiTietSanPham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  // UI-only: lỗi theo field
  const [errors, setErrors] = useState({ color: "", size: "" });

  //  NEW: gợi ý sản phẩm + sản phẩm đã xem

  const BASE_URL = "http://localhost:5000";

  /* ======  Hàm thêm sản phẩm vào giỏ hàng ====== */
  const handleAddToCart = () => {
    try {
      // Kiểm tra đăng nhập
      const user = localStorage.getItem("userinfo");
      if (!user) {
        Swal.fire({
          title: "Bạn chưa đăng nhập!",
          text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy",
        });
        return;
      }

      // Tiếp tục nếu đã đăng nhập
      const variant = variants.find(
        (v) => v.tenmausac === selectedColor && v.tenkichthuoc === selectedSize
      );
      if (Number(variant?.soluongton ?? 0) <= 0) {
        setErrors({ color: "", size: "Sản phẩm này đã hết hàng." });
        return;
      }

      if (quantity > Number(variant.soluongton)) {
        setErrors({
          color: "",
          size: `Chỉ còn ${variant.soluongton} sản phẩm.`,
        });
        return;
      }
      const newErrors = { color: "", size: "" };
      if (!selectedColor) newErrors.color = "Vui lòng chọn màu.";
      if (!selectedSize) newErrors.size = "Vui lòng chọn size.";
      if (!variant) {
        newErrors.size =
          newErrors.size || "Size này không có sẵn cho màu bạn chọn.";
      }
      setErrors(newErrors);
      if (!variant) return;

      const uid = localStorage.getItem("activeUserId");
      const cartKey = uid ? `cart_${uid}` : "cart_guest";
      const stored = JSON.parse(localStorage.getItem(cartKey)) || [];

      const newItem = {
        masanpham: product.masanpham,
        mabienthe: variant.mabienthe,
        tensanpham: product.tensanpham,
        giagoc: Number(variant.giaban),
        giakhuyenmai: Number(variant.giaban),
        soluong: quantity,
        mausac: variant.tenmausac,
        size: variant.tenkichthuoc,
        hinhanh: variant.hinhanh?.[0] || product.anhdaidien,
        sku: variant.sku,
      };

      const existing = stored.find((i) => i.mabienthe === newItem.mabienthe);
      if (existing) existing.soluong += quantity;
      else stored.push(newItem);

      localStorage.setItem(cartKey, JSON.stringify(stored));
      window.dispatchEvent(new Event("cartUpdated"));

      const toast = document.createElement("div");
      toast.className = `
      fixed z-[9999] top-[90px] right-[20px]
      bg-white border border-slate-200 shadow-xl
      rounded-2xl p-4 w-[340px]
      flex items-center gap-3
      animate-fadeIn
    `;
      toast.innerHTML = `
      <img src="${newItem.hinhanh}" class="w-14 h-14 rounded-xl object-cover border border-slate-200" />
      <div class="flex-1">
        <p class="text-sm font-semibold text-slate-900">Đã thêm vào giỏ hàng</p>
        <p class="text-xs text-slate-500 mt-0.5">${product.tensanpham} • ${newItem.mausac}, ${newItem.size}</p>
      </div>
    `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  //Lấy chi tiết sản phẩm + biến thể
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sanpham/${id}`);
        setProduct(res.data.sanpham);
        setVariants(res.data.bienthe);

        if (res.data.bienthe.length > 0) {
          setSelectedColor(res.data.bienthe[0].tenmausac);
          setSelectedSize(res.data.bienthe[0].tenkichthuoc);
        }
      } catch (err) {
        console.error(" Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ====== Dữ liệu UI hợp lệ theo variants ======
  const colorList = useMemo(
    () => [...new Set(variants.map((v) => v.tenmausac))],
    [variants]
  );

  const sizeList = useMemo(
    () => [...new Set(variants.map((v) => v.tenkichthuoc))],
    [variants]
  );

  const availableSizesForColor = useMemo(() => {
    if (!selectedColor) return new Set();
    return new Set(
      variants
        .filter((v) => v.tenmausac === selectedColor)
        .map((v) => v.tenkichthuoc)
    );
  }, [variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    return variants.find(
      (v) => v.tenmausac === selectedColor && v.tenkichthuoc === selectedSize
    );
  }, [variants, selectedColor, selectedSize]);
  const stock = Number(selectedVariant?.soluongton ?? 0);
  const outOfStock = stock <= 0;

  const currentVariantByColor = variants.find(
    (v) => v.tenmausac === selectedColor
  );
  const currentImages = currentVariantByColor?.hinhanh || [];

  useEffect(() => {
    setErrors({ color: "", size: "" });
    setQuantity(1);
    if (!selectedColor && variants.length > 0) {
      setSelectedColor(""); // Đảm bảo không chọn màu mặc định
    }
    if (!selectedSize && variants.length > 0) {
      setSelectedSize(""); // Đảm bảo không chọn kích cỡ mặc định
    }
    if (currentImages.length > 0) setMainImage(currentImages[0]);
    else setMainImage(product?.anhdaidien || "");
  }, [selectedColor, variants]); // eslint-disable-line

  //  NEW: gợi ý sản phẩm (fallback an toàn: thử gọi list, fail thì bỏ trống)

  if (loading)
    return (
      <div className="pt-[150px] text-center text-slate-600">
        Đang tải sản phẩm...
      </div>
    );

  if (!product)
    return (
      <div className="pt-[150px] text-center text-slate-600">
        Không tìm thấy sản phẩm
      </div>
    );

  const priceToShow = Number(
    selectedVariant?.giaban || variants?.[0]?.giaban || 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[120px] pb-16">
      <div className="container mx-auto px-4 md:px-10 lg:px-16">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <ChevronLeft size={18} /> Quay lại
          </button>

          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 hidden md:flex items-center gap-1">
            <Link to="/" className="hover:text-slate-900 transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/all" className="hover:text-slate-900 transition">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-bold line-clamp-1">
              {product.tensanpham}
            </span>
          </nav>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.08)] rounded-3xl p-5 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* ===== ẢNH ===== */}
            <div className="space-y-4">
              <div className="w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={mainImage || product.anhdaidien}
                  alt={product.tensanpham}
                  className="w-full max-h-[560px] object-contain"
                />
              </div>

              {/* Thumbnail */}
              {currentImages.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {currentImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`h-20 w-20 rounded-2xl border overflow-hidden transition-all
                        ${
                          mainImage === img
                            ? "border-slate-900 ring-2 ring-slate-900/10"
                            : "border-slate-200 hover:border-slate-400"
                        }
                      `}
                      title="Xem ảnh"
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <TrustItem
                  icon={<ShieldCheck size={18} />}
                  title="Chính hãng"
                  desc="Cam kết chất lượng"
                />
                <TrustItem
                  icon={<Truck size={18} />}
                  title="Giao nhanh"
                  desc="2–4 ngày toàn quốc"
                />
                <TrustItem
                  icon={<RefreshCcw size={18} />}
                  title="Đổi trả"
                  desc="7 ngày nếu lỗi"
                />
              </div>
            </div>

            {/* ===== THÔNG TIN ===== */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {product.tensanpham}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {product.thuonghieu}
                </p>

                <div className="mt-3 flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                  <span className="text-slate-500 text-sm ml-2">
                    (45 đánh giá)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Giá bán</p>
                <p className="mt-1 text-3xl font-extrabold text-rose-600">
                  {priceToShow.toLocaleString("vi-VN")}₫
                </p>
                {selectedVariant?.sku && (
                  <p className="mt-2 text-xs text-slate-500">
                    SKU:{" "}
                    <span className="font-mono text-slate-700">
                      {selectedVariant.sku}
                    </span>
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                {outOfStock ? (
                  <p className="text-sm font-semibold text-rose-600">
                    Hết hàng
                  </p>
                ) : (
                  <p className="text-sm text-slate-700">
                    Còn <span className="font-bold">{stock}</span> sản phẩm
                  </p>
                )}
              </div>

              {/* Color */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Màu sắc</h4>
                  {selectedColor && (
                    <span className="text-sm text-slate-500">
                      {selectedColor}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-3 flex-wrap">
                  {colorList.map((color) => {
                    const colorHex = variants.find(
                      (v) => v.tenmausac === color
                    )?.hexcode;

                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center
          ${
            selectedColor === color
              ? "border-[rgb(60,110,190)] ring-2 ring-[rgba(60,110,190,0.35)]"
              : "border-slate-300 hover:border-[rgb(60,110,190)]"
          }
          `}
                      >
                        <span
                          className="w-6 h-6 rounded-full"
                          style={{
                            background: colorHex?.startsWith("linear")
                              ? colorHex
                              : colorHex || "#CBD5E1",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                {errors.color && (
                  <p className="mt-2 text-xs text-rose-600">{errors.color}</p>
                )}
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Kích cỡ</h4>

                  <button
                    onClick={() => setOpenSizeGuide(true)}
                    className="text-sm text-[rgb(96,148,216)] hover:underline font-medium"
                  >
                    Hướng dẫn chọn size
                  </button>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {sizeList.map((size) => {
                    const enabled =
                      !selectedColor || availableSizesForColor.has(size);
                    return (
                      <button
                        key={size}
                        onClick={() => enabled && setSelectedSize(size)}
                        disabled={!enabled}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition
          ${
            selectedSize === size
              ? "bg-[rgb(96,148,216)] text-white border-[rgb(60,110,190)] ring-2 ring-[rgba(60,110,190,0.35)] font-bold"
              : "bg-white text-slate-800 border-slate-300 hover:border-[rgb(60,110,190)]"
          }
          ${
            !enabled
              ? "opacity-40 cursor-not-allowed hover:border-slate-200"
              : ""
          }
          `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {errors.size && (
                  <p className="mt-2 text-xs text-rose-600">{errors.size}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Số lượng</h4>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-slate-100 transition"
                    aria-label="Giảm số lượng"
                  >
                    –
                  </button>

                  <span className="w-10 text-center font-semibold text-slate-900">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) => {
                        if (outOfStock) return 1;
                        return Math.min(stock, q + 1);
                      })
                    }
                    disabled={outOfStock}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="
  flex items-center justify-center gap-2
  bg-[rgb(96,148,216)] text-white
  border border-[rgb(60,110,190)]
  py-4 w-full rounded-2xl font-semibold
  hover:bg-[rgb(72,128,204)]
  transition
  shadow-[0_14px_32px_rgba(15,23,42,0.25)]
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
"
              >
                <ShoppingBag size={20} />
                {outOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </button>

              {/* Mô tả */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Mô tả sản phẩm
                </h4>
                <p className="text-slate-700 leading-relaxed">{product.mota}</p>
                {product.chatlieu && (
                  <p className="text-slate-600 text-sm mt-2">
                    Chất liệu:{" "}
                    <span className="font-semibold text-slate-800">
                      {product.chatlieu}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*  Gợi ý sản phẩm */}
        <ProductRecommendations
          BASE_URL={BASE_URL}
          product={product}
          currentId={id}
        />
        <ProductReviews
          BASE_URL={BASE_URL}
          productId={id}
          productName={product.tensanpham}
        />
        <RecentViewed
          currentId={id}
          currentProduct={product}
          currentPrice={priceToShow}
        />
      </div>
      {openSizeGuide && (
        <SizeGuideModal onClose={() => setOpenSizeGuide(false)} />
      )}
    </div>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-slate-700">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
        </div>
      </div>
    </div>
  );
}
function SizeGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">
            Hướng dẫn chọn size
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* ===== QUẦN ===== */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">
              Quần (All-day Pant)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left">Size</th>
                    <th className="p-2">S</th>
                    <th className="p-2">M</th>
                    <th className="p-2">L</th>
                    <th className="p-2">XL</th>
                    <th className="p-2">2XL</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="border-t">
                    <td className="p-2 text-left font-medium">Cân nặng (kg)</td>
                    <td>48–55</td>
                    <td>55–62</td>
                    <td>62–69</td>
                    <td>69–76</td>
                    <td>76–85</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="p-2 text-left font-medium">
                      Chiều cao (cm)
                    </td>
                    <td>155–160</td>
                    <td>160–165</td>
                    <td>165–172</td>
                    <td>172–177</td>
                    <td>177–183</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== ÁO ===== */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Áo / Hoodie</h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left">Size</th>
                    <th className="p-2">S</th>
                    <th className="p-2">M</th>
                    <th className="p-2">L</th>
                    <th className="p-2">XL</th>
                    <th className="p-2">2XL</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="border-t">
                    <td className="p-2 text-left font-medium">
                      Chiều cao (cm)
                    </td>
                    <td>155–160</td>
                    <td>160–165</td>
                    <td>165–172</td>
                    <td>172–177</td>
                    <td>177–183</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="p-2 text-left font-medium">Cân nặng (kg)</td>
                    <td>48–55</td>
                    <td>55–62</td>
                    <td>62–69</td>
                    <td>69–76</td>
                    <td>76–85</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              * Thông số mang tính tham khảo, có thể chênh lệch do chất liệu vải
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   UI BLOCKS: Less is more
========================= */

/* =========================
   REVIEWS: UI shell (logic làm sau)
========================= */
