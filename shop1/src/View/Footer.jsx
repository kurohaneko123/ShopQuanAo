import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0c0d0f] text-gray-300 pt-16 pb-10 mt-20 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* 1️⃣ GIỚI THIỆU */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 tracking-wide">
            HORIZON
          </h2>

          <p className="text-sm leading-relaxed mb-5 opacity-80">
            HORIZON mang đến trải nghiệm mua sắm thời trang tiện lợi, hiện đại
            và chất lượng. Chúng tôi giúp bạn tự tin mỗi ngày!
          </p>

          <div className="flex gap-4 text-gray-400">
            <a className="hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a className="hover:text-white transition">
              <Instagram size={20} />
            </a>
            <a className="hover:text-white transition">Zalo</a>
          </div>
        </div>

        {/* 2️⃣ LIÊN HỆ */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 tracking-wide">
            Liên hệ chúng tôi
          </h3>

          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-3">
              <MapPin size={18} className="text-indigo-400 mt-1" />
              <span>
                180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-indigo-400 mt-1" />
              <span>Hotline: 0901 234 567 – 0938 765 432</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-indigo-400 mt-1" />
              <span>Email: support@HORIZON.vn</span>
            </li>
          </ul>
        </div>

        {/* 3️⃣ HỖ TRỢ */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 tracking-wide">
            Hỗ trợ khách hàng
          </h3>

          <ul className="space-y-3 text-sm opacity-90">
            <li>
              <a className="hover:text-white transition">Chính sách đổi trả</a>
            </li>
            <li>
              <a className="hover:text-white transition">Chính sách bảo mật</a>
            </li>
            <li>
              <a className="hover:text-white transition">Điều khoản sử dụng</a>
            </li>
            <li>
              <a className="hover:text-white transition">Hướng dẫn mua hàng</a>
            </li>
          </ul>
        </div>
      </div>

      {/* 5️⃣ COPYRIGHT */}
      <div className="mt-12 text-center text-xs text-gray-500 border-t border-white/10 pt-6">
        © {new Date().getFullYear()} HORIZON – Đại học Công Nghệ Sài Gòn (STU).
        All rights reserved.
      </div>
    </footer>
  );
}
/* riêng không gộp */
