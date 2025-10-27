"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import AolopBanner from "../assets/aolop-banner.jpg";

const ClassBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6">
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16 shadow-md">
        {/* Ảnh nền */}
        <img
          src={AolopBanner}
          alt="Banner Áo Lớp & Kỷ Yếu"
          className="w-full h-full object-cover"
        />

        {/* Overlay xanh mint nhẹ */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/70 via-cyan-700/40 to-transparent"></div>

        {/* Nội dung chữ bên trái */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 lg:px-32 text-white">
          <div className="max-w-xl">
            {/* Tag nhỏ */}
            {/* <span className="inline-block bg-cyan-500 text-white text-xs md:text-sm font-semibold py-1.5 px-4 rounded-full uppercase tracking-wider shadow">
              CLASS & YEARBOOK DESIGN
            </span> */}

            {/* Tiêu đề chính */}
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight uppercase">
              Áo Lớp & Kỷ Yếu <br />
              <span className="bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-200 bg-clip-text text-transparent">
                Theo Phong Cách Của Bạn
              </span>
            </h1>

            {/* Mô tả */}
            <p className="mt-3 text-sm md:text-base text-gray-100 leading-relaxed max-w-md">
              Chọn form – phối màu – thêm logo/slogan – duyệt mẫu nhanh trong
              24h. Biến ý tưởng lớp bạn thành hiện thực với phong cách riêng.
            </p>

            {/* Nút hành động */}
            <div className="mt-5 flex flex-row gap-3">
              <a
                href="/aolop-kyyeu"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-cyan-400 text-gray-900 font-semibold shadow hover:bg-cyan-300 transition-all duration-300"
              >
                Xem bảng giá
              </a>
              <button
                onClick={() => navigate("/lienhe")}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-cyan-400 text-cyan-300 font-semibold hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300"
              >
                Liên hệ nhanh
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassBanner;
