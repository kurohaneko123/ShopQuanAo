import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

// Ảnh hero
import heroMen from "../assets/banner_logo7.webp";
import heroSale from "../assets/banner_mac.jpg";
import heroNew from "../assets/banner_goiy2.webp";

// Danh sách slide
const SLIDES = [
  {
    id: "men",
    title: "",
    desc: "",
    img: heroMen,
    alt: "",
  },
  {
    id: "sale",
    title: "",
    desc: "",
    img: heroSale,
    alt: "",
  },
  {
    id: "new",
    title: "",
    desc: "",
    img: heroNew,
    alt: "",
  },
];

export default function HeroCarousel() {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    lazyLoad: "ondemand",
    accessibility: true,
  };

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh]">
      <Slider {...settings} className="w-full">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            onClick={() => navigate("/all")}
            className="cursor-pointer"
            aria-label={`Slide ${i + 1}: ${s.title}`}
          >
            {/* Hình nền */}
            <div
              className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-between transition-all duration-500"
              style={{
                backgroundImage: `url(${s.img})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "cover",
                filter: "brightness(1.05) contrast(1.05)",
              }}
            >
              {/* Overlay nhẹ */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

              {/* Vùng chữ */}
              <div className="relative z-10 flex items-center w-full md:w-1/2 px-6 md:px-12 lg:px-20 py-12">
                <div className="text-white drop-shadow-lg">
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    {s.title}
                  </h1>
                  <p className="text-base md:text-lg text-gray-100 opacity-95">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Khoảng trống bên phải */}
              <div className="hidden md:block w-1/2" />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
