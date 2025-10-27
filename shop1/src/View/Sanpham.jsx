"use client";

import React, { useState, useEffect } from "react";
import {
  useSearchParams,
  useParams,
  Link,
  useLocation,
} from "react-router-dom";

/* ====== Import ảnh ====== */
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";

/* ====== Dữ liệu tĩnh ====== */
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

/* ====== Danh sách sản phẩm ====== */
const products = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 250000,
    type: "ao-thun",
    img: Aothunbasic,
    colors: ["red", "white", "black"],
    sizes: ["M", "L"],
    gender: "Nam",
  },
  {
    id: 2,
    name: "Quần Jogger",
    price: 299000,
    type: "quan-jogger",
    img: Quanjooger,
    colors: ["red", "white", "gray"],
    sizes: ["L", "XL"],
    gender: "Nam",
  },
  {
    id: 3,
    name: "Áo Polo Nam",
    price: 280000,
    type: "ao-polo",
    img: Aopolo,
    colors: ["white", "blue"],
    sizes: ["M"],
    gender: "Nam",
  },
  {
    id: 4,
    name: "Áo Khoác Nam",
    price: 600000,
    type: "ao-khoac",
    img: Aokhoac,
    colors: ["blue", "black"],
    sizes: ["XL"],
    gender: "Nam",
  },
  {
    id: 5,
    name: "Áo sơ mi",
    price: 320000,
    type: "ao-so-mi",
    img: Aosomi,
    colors: ["white", "blue"],
    sizes: ["L"],
    gender: "Nam",
  },
  {
    id: 6,
    name: "Quần Jean",
    price: 400000,
    type: "quan-jean",
    img: Quanjean,
    colors: ["black", "gray"],
    sizes: ["M", "L"],
    gender: "Nữ",
  },
  {
    id: 7,
    name: "Áo Hoodie",
    price: 450000,
    type: "ao-hoodie",
    img: Aokhoac,
    colors: ["black", "red"],
    sizes: ["M", "L", "XL"],
    gender: "Nam",
  },
  {
    id: 8,
    name: "Áo Khoác Gió",
    price: 500000,
    type: "ao-khoac",
    img: Aokhoac,
    colors: ["blue", "gray"],
    sizes: ["L", "XL"],
    gender: "Nam",
  },
  {
    id: 9,
    name: "Quần Short Nữ",
    price: 200000,
    type: "quan-short",
    img: Quanjean,
    colors: ["white", "beige"],
    sizes: ["S", "M"],
    gender: "Nữ",
  },
];

/* ====== Hàm hiển thị tên danh mục ====== */
function formatCategoryName(slug) {
  const mapping = {
    "ao-thun": "Áo Thun",
    "ao-polo": "Áo Polo",
    "ao-khoac": "Áo Khoác",
    "ao-so-mi": "Áo Sơ Mi",
    "ao-hoodie": "Áo Hoodie",
    "quan-jean": "Quần Jean",
    "quan-kaki": "Quần Kaki",
    "quan-jogger": "Quần Jogger",
    "quan-short": "Quần Short",
    " vay": "Váy ",
    "quan-tay": "Quần Tây",
  };
  return (
    mapping[slug] ||
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export default function TatCaSanPham() {
  const [searchParams] = useSearchParams();
  const { gender: genderParam, category } = useParams();
  const genderQuery = searchParams.get("gender");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";

  /* ✅ Tách giới tính và danh mục từ slug */
  const parseGenderAndCategory = (catSlug) => {
    let realCategory = catSlug;
    let genderFromSlug = null;
    if (catSlug?.endsWith("-nam")) {
      realCategory = catSlug.replace(/-nam$/, "");
      genderFromSlug = "Nam";
    } else if (catSlug?.endsWith("-nu")) {
      realCategory = catSlug.replace(/-nu$/, "");
      genderFromSlug = "Nữ";
    }
    return { realCategory, genderFromSlug };
  };

  const { realCategory, genderFromSlug } = parseGenderAndCategory(category);

  /* ✅ Xác định giới tính ưu tiên */
  const resolvedGender =
    genderQuery ??
    (genderParam === "nam" ? "Nam" : genderParam === "nu" ? "Nữ" : null) ??
    genderFromSlug ??
    null;

  /* ===== STATE ===== */
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGender, setSelectedGender] = useState(resolvedGender);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeColor, setActiveColor] = useState({});

  useEffect(() => {
    setSelectedGender(resolvedGender);
  }, [resolvedGender]);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedSizes, selectedColors, selectedGender, selectedPrice]);

  /* ===== HÀM LỌC ===== */
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
    setSelectedGender(resolvedGender);
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

    const matchCategory = !realCategory || p.type === realCategory;

    // ✅ Thêm dòng này: lọc theo từ khóa tìm kiếm (nếu có)
    const matchSearch =
      !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ Giữ nguyên các điều kiện cũ + thêm matchSearch
    return (
      matchSize &&
      matchColor &&
      matchGender &&
      matchPrice &&
      matchCategory &&
      matchSearch
    );
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* ===== BREADCRUMB ===== */
  const breadcrumb = [
    { name: "Trang chủ", path: "/" },
    selectedGender && {
      name: selectedGender,
      path: `/all?gender=${selectedGender}`,
    },
    realCategory && {
      name: formatCategoryName(realCategory),
      path: `/${genderParam || selectedGender}/${realCategory}`,
    },
  ].filter(Boolean);

  /* ===== RENDER ===== */
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

            {/* Bộ lọc */}
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
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <Link
                  to={b.path}
                  className="hover:text-blue-600 transition-colors"
                >
                  {b.name}
                </Link>
                {i < breadcrumb.length - 1 && <span>›</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Tiêu đề */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {searchTerm
                ? `Kết quả tìm kiếm cho "${searchTerm}"`
                : realCategory
                ? `${formatCategoryName(realCategory)} ${selectedGender || ""}`
                : selectedGender || "Tất cả sản phẩm"}
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={clearFilters}
                className="md:hidden text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
              >
                Bỏ lọc
              </button>
              <div className="text-sm text-gray-600">
                Hiển thị {visibleProducts.length}/{filteredProducts.length}
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-600 mb-4">Không có sản phẩm phù hợp.</p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-2 rounded-md"
              >
                Bỏ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <div className="relative w-full bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                      <div className="h-72 flex items-center justify-center overflow-hidden bg-gray-50">
                        <img
                          src={p.images?.[activeColor[p.id]] || p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4 text-center">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {p.gender} • {p.sizes.join(", ")}
                        </p>
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
