"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useSearchParams,
  useParams,
  Link,
  useLocation,
} from "react-router-dom";

/* ====== Import ảnh mẫu (tạm) ====== */
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";

/* ====== Dữ liệu bộ lọc ====== */
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = [
  { name: "Đen", code: "black" },
  { name: "Trắng", code: "white" },
  { name: "Đỏ", code: "red" },
  { name: "Xanh lam", code: "blue" },
  { name: "Xám", code: "gray" },
  { name: "Be", code: "#f5f5dc" },
];
const priceRanges = [
  { label: "0 - 200.000đ", min: 0, max: 200000 },
  { label: "200.000đ - 300.000đ", min: 200000, max: 300000 },
  { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
  { label: ">500.000đ", min: 500000, max: Infinity },
];
const genders = ["Nam", "Nữ"];

function formatCategoryName(slug) {
  const mapping = {
    "ao-thun": "Áo Thun",
    "ao-polo": "Áo Polo",
    "ao-khoac": "Áo Khoác",
    "ao-so-mi": "Áo Sơ Mi",
    "ao-hoodie": "Áo Hoodie",
    "quan-jean": "Quần Jean",
    "quan-jogger": "Quần Jogger",
  };
  return mapping[slug] || slug;
}

export default function TatCaSanPham() {
  const [searchParams] = useSearchParams();
  const { gender: genderParam, category } = useParams();
  const genderQuery = searchParams.get("gender");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";

  /* ===== STATE ===== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeColor, setActiveColor] = useState({});

  /* ✅ GỌI API */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sanpham");
        const apiProducts = res.data.data.map((item) => ({
          id: item.masanpham,
          name: item.tensanpham,
          brand: item.thuonghieu,
          description: item.mota,
          material: item.chatlieu,
          categoryId: item.madanhmuc,
          img: Aothunbasic, // tạm thời dùng ảnh mẫu
          price: Math.floor(Math.random() * 400000) + 150000, // random giá
          colors: ["black", "white", "red"],
          sizes: ["M", "L", "XL"],
          gender: "Nam",
        }));
        setProducts(apiProducts);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ===== FILTER LOGIC ===== */
  const toggleSize = (s) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleColor = (c) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedGender(null);
    setSelectedPrice(null);
    setVisibleCount(6);
  };

  const filteredProducts = products.filter((p) => {
    const matchSize =
      selectedSizes.length === 0 ||
      p.sizes.some((sz) => selectedSizes.includes(sz));
    const matchColor =
      selectedColors.length === 0 ||
      p.colors.some((col) => selectedColors.includes(col));
    const matchGender = !selectedGender || p.gender === selectedGender;
    const matchPrice =
      !selectedPrice ||
      (p.price >= selectedPrice.min && p.price <= selectedPrice.max);
    const matchSearch =
      !searchTerm || p.name.toLowerCase().includes(searchTerm);
    return matchSize && matchColor && matchGender && matchPrice && matchSearch;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* ===== RENDER ===== */
  if (loading)
    return (
      <div className="pt-[150px] text-center text-gray-600">
        Đang tải sản phẩm...
      </div>
    );

  if (error)
    return <div className="pt-[150px] text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white pt-[100px] container mx-auto px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* ===== SIDEBAR ===== */}
        <aside className="md:col-span-1">
          <div className="sticky top-[100px] z-40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="hidden md:inline-block text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
              >
                Bỏ lọc
              </button>
            </div>

            {/* Kích cỡ */}
            <div>
              <h4 className="font-medium mb-2">Kích cỡ</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      selectedSizes.includes(s)
                        ? "bg-black text-white border-black"
                        : "hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu sắc */}
            <div>
              <h4 className="font-medium mb-2">Màu sắc</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => toggleColor(c.code)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColors.includes(c.code) ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: c.code }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Giá */}
            <div>
              <h4 className="font-medium mb-2">Giá</h4>
              {priceRanges.map((r) => (
                <label
                  key={r.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPrice?.label === r.label}
                    onChange={() => setSelectedPrice(r)}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            {/* Giới tính */}
            <div>
              <h4 className="font-medium mb-2">Giới tính</h4>
              {genders.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === g}
                    onChange={() => setSelectedGender(g)}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ===== DANH SÁCH SẢN PHẨM ===== */}
        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              Không có sản phẩm phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <div className="relative w-full bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                      <div className="h-72 flex items-center justify-center overflow-hidden bg-gray-50">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4 text-center">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{p.brand}</p>
                        <div className="text-red-600 font-bold">
                          {p.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                        <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium">
                          Thêm vào giỏ hàng +
                        </button>
                      </div>
                    </div>

                    {/* Màu sắc chọn */}
                    <div className="flex justify-center gap-3 mt-3">
                      {p.colors.map((clr) => (
                        <button
                          key={clr}
                          onClick={() =>
                            setActiveColor({ ...activeColor, [p.id]: clr })
                          }
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            activeColor[p.id] === clr
                              ? "border-black scale-110"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: clr }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                  >
                    Xem thêm sản phẩm ↓
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
