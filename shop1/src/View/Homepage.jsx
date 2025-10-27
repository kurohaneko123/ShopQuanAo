"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ====== Import ảnh ====== */
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";
import QuanjoogerTrang from "../assets/quanjoogertrang.png";
import Quanshort from "../assets/quan-short.jpg";
import Bannermacthuongngay from "../assets/banner_mac.jpg";
import Bannergoiy from "../assets/banner_goiy2.webp"; //

/* ====== 2 nút trái và phải cho slider ====== */
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

  /* ===== 6 ô danh mục ===== */
  const maleCategories = [
    { id: "m-1", name: "ÁO THUN", img: Aothunbasic, slug: "ao-thun-nam" },
    { id: "m-2", name: "ÁO POLO", img: Aopolo, slug: "ao-polo-nam" },
    { id: "m-3", name: "Quần Short", img: Quanshort, slug: "quan-short" },
    { id: "m-4", name: "Quần Jean", img: Quanjean, slug: "quan-jean" },
    { id: "m-5", name: "Áo Khoác", img: Aokhoac, slug: "ao-khoac" },
    {
      id: "m-6",
      name: "Quần Jogger",
      img: QuanjoogerTrang,
      slug: "quan-jogger",
    },
  ];

  const femaleCategories = [
    { id: "f-1", name: "ÁO THUN", img: Aopolo, slug: "ao-thun-nu" },
    { id: "f-2", name: "VÁY", img: Aosomi, slug: "vay" },
    { id: "f-3", name: "QUẦN TÂY", img: Quanjean, slug: "quan-tay" },
    { id: "f-4", name: "QUẦN JEAN", img: Quanjean, slug: "quan-jean" },
    { id: "f-5", name: "Quần Jogger", img: Quanjooger, slug: "quan-jogger" },
    { id: "f-6", name: "Quần Short", img: Aokhoac, slug: "quan-short" },
  ];

  const gridCategories =
    selectedGender === "nam" ? maleCategories : femaleCategories;

  /* ===== sản phẩm mặc hằng ngày ===== */
  const products = [
    { id: 1, name: "Áo Thun Basic", price: 199000, img: Aothunbasic },
    { id: 2, name: "Quần Jogger", price: 299000, img: QuanjoogerTrang },
    { id: 3, name: "Áo Polo", price: 249000, img: Aopolo },
    { id: 4, name: "Áo Khoác", price: 399000, img: Aokhoac },
    { id: 5, name: "Quần Jeans", price: 349000, img: Quanjean },
    { id: 6, name: "Áo Sơ Mi", price: 279000, img: Aosomi },
  ];

  const suggestionProducts = [
    { id: 7, name: "Áo Khoác", price: 329000, img: Aokhoac },
    { id: 8, name: "Áo Sơ Mi Trắng", price: 299000, img: Aosomi },
    { id: 9, name: "Áo Polo Đen", price: 259000, img: Aopolo },
    { id: 10, name: "Quần Jean", price: 359000, img: Quanjean },
    { id: 11, name: "Áo Thun Cotton", price: 189000, img: Aothunbasic },
    { id: 12, name: "Quần Jogger Xám", price: 279000, img: Quanjooger },
  ];

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

  return (
    <main className="bg-white">
      <div className="container mx-auto px-6">
        {/* ===== Filter Nam/Nữ ===== */}
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
                <a
                  href={`/all/${selectedGender}/${cat.slug
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
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 🆕 Banner MẶC HÀNG NGÀY ===== */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16">
          <img
            src={Bannermacthuongngay}
            alt="Banner Mặc Hằng Ngày"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-10 md:px-20 lg:px-32">
            <div className="max-w-xl">
              <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                MẶC HÀNG NGÀY
              </h2>
              <p className="text-white text-lg mb-6">
                Nhập <span className="font-bold">COOLNEW</span> Giảm 50K đơn đầu
                tiên từ 299K
              </p>
              <Link
                to="/all/nam/ao-thun"
                className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                MUA NGAY
              </Link>
            </div>
          </div> */}
        </section>

        {/* ===== Sản phẩm mặc hằng ngày ===== */}
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
            {products.map((p) => (
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
        {/* ===== 🆕 Banner Sản phẩm nổi bật  ===== */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16">
          <img
            src={Bannergoiy}
            alt="Banner Gợi Ý"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-10 md:px-20 lg:px-32">
            <div className="max-w-xl">
              <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight"></h2>
              <p className="text-white text-lg mb-6">
                <span className="font-bold"></span>
              </p>
              <Link
                to="/all/nam/ao-thun"
                className="absolute bottom-10 right-20 bg-white text-black font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
              ></Link>
            </div>
          </div> */}
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
            {suggestionProducts.map((p) => (
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
