"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ====== Import ảnh mẫu (tạm) ====== */
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";
import QuanjoogerTrang from "../assets/quanjoogertrang.png";
import Quanshort from "../assets/quan-short.jpg";
import Bannermacthuongngay from "../assets/banner_mac.jpg";
import Bannergoiy from "../assets/banner_goiy2.webp";

/* ====== Nút trái/phải cho slider ====== */
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous slide"
    className="absolute -left-8 top-1/2 -translate-y-1/2 z-30 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next slide"
    className="absolute -right-8 top-1/2 -translate-y-1/2 z-30 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

export default function HomePage() {
  const [selectedGender, setSelectedGender] = useState("nam");
  const [dailyProducts, setDailyProducts] = useState([]); // sản phẩm mặc hàng ngày
  const [highlightProducts, setHighlightProducts] = useState([]); // sản phẩm nổi bật
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ====== Cấu hình slider ====== */
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  /* ====== Gọi API lấy dữ liệu sản phẩm ====== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sanpham");
        const apiData = res.data.data || [];

        // 🌟 Chuyển đổi dữ liệu từ backend thành định dạng frontend hiểu được
        const mappedProducts = apiData.map((item) => ({
          id: item.masanpham,
          name: item.tensanpham,
          price: Math.floor(Math.random() * 400000) + 150000, // tạm random giá
          img: Aothunbasic, // TODO: sau này gắn ảnh thật từ Cloudinary backend trả về
          brand: item.thuonghieu,
          mota: item.mota,
          categoryId: item.madanhmuc,
        }));

        // 🌟 Chia sản phẩm thành 2 nhóm (demo)
        setDailyProducts(mappedProducts.slice(0, 6)); // 6 sản phẩm đầu tiên
        setHighlightProducts(mappedProducts.slice(6, 12)); // 6 sản phẩm tiếp theo
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm 😭");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ====== Danh mục tĩnh (chưa có API riêng) ====== */
  // TODO: sau này gắn API danh mục nam/nữ riêng (ví dụ /api/danhmuc?gender=nam)
  const maleCategories = [
    { id: "m-1", name: "ÁO THUN", img: Aothunbasic, slug: "ao-thun-nam" },
    { id: "m-2", name: "ÁO POLO", img: Aopolo, slug: "ao-polo-nam" },
    { id: "m-3", name: "QUẦN SHORT", img: Quanshort, slug: "quan-short" },
    { id: "m-4", name: "QUẦN JEAN", img: Quanjean, slug: "quan-jean" },
    { id: "m-5", name: "ÁO KHOÁC", img: Aokhoac, slug: "ao-khoac" },
    {
      id: "m-6",
      name: "QUẦN JOGGER",
      img: QuanjoogerTrang,
      slug: "quan-jogger",
    },
  ];

  const femaleCategories = [
    { id: "f-1", name: "ÁO THUN", img: Aopolo, slug: "ao-thun-nu" },
    { id: "f-2", name: "VÁY", img: Aosomi, slug: "vay" },
    { id: "f-3", name: "QUẦN TÂY", img: Quanjean, slug: "quan-tay" },
    { id: "f-4", name: "QUẦN JEAN", img: Quanjean, slug: "quan-jean" },
    { id: "f-5", name: "QUẦN JOGGER", img: Quanjooger, slug: "quan-jogger" },
    { id: "f-6", name: "QUẦN SHORT", img: Aokhoac, slug: "quan-short" },
  ];

  const gridCategories =
    selectedGender === "nam" ? maleCategories : femaleCategories;

  /* ====== Hiển thị ====== */
  if (loading)
    return (
      <div className="pt-[150px] text-center text-gray-600 text-lg">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  if (error)
    return (
      <div className="pt-[150px] text-center text-red-600 text-lg">{error}</div>
    );

  return (
    <main className="bg-white">
      <div className="container mx-auto px-6">
        {/* ===== Bộ lọc giới tính ===== */}
        <section className="pt-12 pb-6">
          <nav className="flex justify-start gap-4">
            <button
              onClick={() => setSelectedGender("nam")}
              className={`h-12 px-6 rounded-full font-semibold uppercase transition-all ${
                selectedGender === "nam"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              }`}
            >
              Nam
            </button>
            <button
              onClick={() => setSelectedGender("nu")}
              className={`h-12 px-6 rounded-full font-semibold uppercase transition-all ${
                selectedGender === "nu"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              }`}
            >
              Nữ
            </button>
          </nav>
        </section>

        {/* ===== Danh mục sản phẩm ===== */}
        <section className="pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {gridCategories.map((cat) => (
              <div key={cat.id} className="group flex flex-col items-center">
                <Link
                  to={`/all/${selectedGender}/${cat.slug
                    .replace("-nam", "")
                    .replace("-nu", "")}`}
                >
                  <figure className="w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </figure>
                  <p className="mt-3 text-center text-sm md:text-base font-semibold uppercase tracking-wide">
                    {cat.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Banner MẶC HẰNG NGÀY ===== */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16">
          <img
            src={Bannermacthuongngay}
            alt="Banner Mặc Hằng Ngày"
            className="w-full h-full object-cover"
          />
          {/* TODO: sau này có thể thêm nội dung động (khuyến mãi / sự kiện) */}
        </section>

        {/* ===== Sản phẩm Mặc hằng ngày ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-6">Sản phẩm mặc hằng ngày</h2>
          <Link
            to="/all"
            className="text-sm underline underline-offset-2 hover:text-blue-600"
          >
            Xem thêm
          </Link>
        </div>
        <section className="relative overflow-visible pb-20">
          <Slider {...settings}>
            {dailyProducts.map((p) => (
              <div key={p.id} className="px-3">
                <div className="relative group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="h-72 bg-gray-50">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-red-600 font-bold">
                      {p.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                    <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                      Thêm vào giỏ hàng +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* ===== Banner Gợi ý nổi bật ===== */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16">
          <img
            src={Bannergoiy}
            alt="Banner Gợi Ý"
            className="w-full h-full object-cover"
          />
          {/* TODO: sau này thêm nội dung banner động */}
        </section>

        {/* ===== Sản phẩm nổi bật ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-6">Sản phẩm nổi bật</h2>
          <Link
            to="/all"
            className="text-sm underline underline-offset-2 hover:text-blue-600"
          >
            Xem thêm
          </Link>
        </div>
        <section className="relative overflow-visible pb-20">
          <Slider {...settings}>
            {highlightProducts.map((p) => (
              <div key={p.id} className="px-3">
                <div className="relative group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="h-72 bg-gray-50">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-red-600 font-bold">
                      {p.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                    <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                      Thêm vào giỏ hàng +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
      </div>
    </main>
  );
}
