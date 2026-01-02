"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  useSearchParams,
  useParams,
  Link,
  useLocation,
} from "react-router-dom";

/* ====== Import ảnh mẫu (tạm) ====== */
import Aothunbasic from "../assets/aothunbasic.jpg";

/* =========================
   MAPPING THEO API /bienthe/loc
   ========================= */
const sizeOptions = [
  { id: 2, label: "M" },
  { id: 3, label: "L" },
];

const colorOptions = [
  { id: 4, label: "Xanh Navy" },
  { id: 5, label: "Xám Tro" },
  // Nếu BE anh có thêm màu khác → add tiếp
];

const priceRanges = [
  { label: "0 - 200.000đ", min: 0, max: 200000 },
  { label: "200.000đ - 300.000đ", min: 200000, max: 300000 },
  { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
  { label: ">500.000đ", min: 500000, max: Infinity },
];

const genders = ["Nam", "Nữ"];

export default function TatCaSanPham() {
  const [searchParams] = useSearchParams();
  const { gender: genderParam, category } = useParams();
  const genderFromUrl = searchParams.get("gender"); // "Nam" | "Nữ" | null
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";
  /* ===== STATE ===== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // chọn filter theo ID để match API
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [priceMap, setPriceMap] = useState({});

  // reset page khi đổi filter/search
  useEffect(() => {
    setPage(1);
  }, [
    selectedSizeIds,
    selectedColorIds,
    selectedGender,
    selectedPrice,
    searchTerm,
  ]);

  const hasAnyFilter = useMemo(() => {
    return (
      selectedSizeIds.length > 0 ||
      selectedColorIds.length > 0 ||
      !!selectedGender ||
      !!selectedPrice
    );
  }, [selectedSizeIds, selectedColorIds, selectedGender, selectedPrice]);

  const toggleId = (id, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedSizeIds([]);
    setSelectedColorIds([]);
    setSelectedGender(null);
    setSelectedPrice(null);
    setPage(1);
  };

  // =========================
  // 1) FETCH PRODUCTS:
  // - Nếu có filter => gọi /api/bienthe/loc
  // - Nếu không => gọi /api/sanpham (danh sách thường)
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      //
      try {
        if (hasAnyFilter || genderFromUrl) {
          // Có filter: gọi /bienthe/loc
          const params = {};
          if (selectedSizeIds.length)
            params.kichthuoc = selectedSizeIds.join(",");
          if (selectedColorIds.length)
            params.mausac = selectedColorIds.join(",");
          if (selectedPrice) {
            params.giaTu = selectedPrice.min;
            params.giaDen =
              selectedPrice.max === Infinity ? undefined : selectedPrice.max;
          }
          if (selectedGender) params.gioitinh = selectedGender;

          const res = await axios.get("http://localhost:5000/api/bienthe/loc", {
            params,
          });

          const raw = Array.isArray(res.data?.dulieu) ? res.data.dulieu : [];

          // Normalize về format card (id, name, brand, img...)
          const mapById = new Map();

          raw.forEach((item) => {
            const pid = item.masanpham;
            const name = item.tensanpham;

            if (!pid) return;

            if (!mapById.has(pid)) {
              mapById.set(pid, {
                id: pid,
                name: name || `Sản phẩm #${pid}`,
                brand: item.thuonghieu || "",
                img: item.anhdaidien || Aothunbasic,
              });
            }
          });
          setProducts(Array.from(mapById.values()));
          const normalized = Array.from(mapById.values());

          const finalList = searchTerm
            ? normalized.filter((p) =>
                p.name.toLowerCase().includes(searchTerm)
              )
            : normalized;

          setProducts(finalList);
        } else {
          // Không filter: load list thường
          const res = await axios.get("http://localhost:5000/api/sanpham");
          const apiProducts = (res.data?.data || []).map((item) => ({
            id: item.masanpham,
            name: item.tensanpham,
            brand: item.thuonghieu,
            img: item.anhdaidien || Aothunbasic,
          }));

          const finalList = searchTerm
            ? apiProducts.filter((p) =>
                p.name.toLowerCase().includes(searchTerm)
              )
            : apiProducts;

          setProducts(finalList);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    hasAnyFilter,
    selectedSizeIds,
    selectedColorIds,
    selectedGender,
    selectedPrice,
    searchTerm,
  ]);
  useEffect(() => {
    if (genderFromUrl === "Nam" || genderFromUrl === "Nữ") {
      setSelectedGender(genderFromUrl);
    } else {
      setSelectedGender(null);
    }
  }, [genderFromUrl]);

  // =========================
  // 2) FETCH PRICE MAP
  // =========================
  useEffect(() => {
    if (products.length === 0) return;

    const fetchPrices = async () => {
      const map = {};

      await Promise.all(
        products.map(async (p) => {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/sanpham/${p.id}`
            );
            const variants = res.data?.bienthe || [];

            if (variants.length > 0) {
              const preferred =
                variants.find(
                  (v) => String(v.tenkichthuoc || "").toUpperCase() === "M"
                ) || variants[0];

              const basePrice = Number(preferred?.giaban);
              if (Number.isFinite(basePrice)) map[p.id] = basePrice;
            }
          } catch (err) {
            console.error("Lỗi lấy giá sản phẩm:", err);
          }
        })
      );

      setPriceMap(map);
    };

    fetchPrices();
  }, [products]);

  // =========================
  // 3) PAGINATION
  // =========================
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const visibleProducts = products.slice(start, start + pageSize);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <div
            className="sticky top-[110px] max-h-[calc(100vh-140px)]
                overflow-y-auto rounded-xl bg-gray-50
                p-6 space-y-6"
          >
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
                {sizeOptions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleId(s.id, setSelectedSizeIds)}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      selectedSizeIds.includes(s.id)
                        ? "bg-black text-white border-black"
                        : "hover:border-black"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2"></p>
            </div>

            {/* Màu sắc */}
            <div>
              <h4 className="font-medium mb-2">Màu sắc</h4>
              <div className="flex flex-col gap-2">
                {colorOptions.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColorIds.includes(c.id)}
                      onChange={() => toggleId(c.id, setSelectedColorIds)}
                    />
                    {c.label}
                  </label>
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

          {products.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              Không có sản phẩm phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <Link
                      to={`/product/${p.id}`}
                      className="relative w-full bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                    >
                      <div className="h-72 flex items-center justify-center overflow-hidden bg-gray-50">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4 text-center">
                        <h3 className="font-semibold">{p.name}</h3>
                        {p.brand && (
                          <p className="text-gray-600 text-sm mb-2">
                            {p.brand}
                          </p>
                        )}
                        <div className="text-red-600 font-bold">
                          {priceMap[p.id]
                            ? `${priceMap[p.id].toLocaleString("vi-VN")}đ`
                            : "Đang tải giá…"}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition
                    ${
                      safePage === 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }
                  `}
                  aria-label="Trang trước"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages })
                  .slice(0, 10)
                  .map((_, idx) => {
                    const pnum = idx + 1;
                    const active = pnum === safePage;
                    return (
                      <button
                        key={pnum}
                        onClick={() => goToPage(pnum)}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition
                          ${
                            active
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-50 border"
                          }
                        `}
                        aria-label={`Trang ${pnum}`}
                      >
                        {pnum}
                      </button>
                    );
                  })}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition
                    ${
                      safePage === totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }
                  `}
                  aria-label="Trang sau"
                >
                  ›
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
