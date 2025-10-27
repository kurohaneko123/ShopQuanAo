import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 1️⃣ Giới thiệu thương hiệu */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">HORIZON</h2>
          <p className="text-sm leading-relaxed mb-4">
            HORIZON mang đến trải nghiệm mua sắm thời trang tiện lợi, hiện đại
            và chất lượng. Chúng tôi hướng đến việc giúp bạn tự tin mỗi ngày!
          </p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-blue-500 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              Zalo
            </a>
          </div>
        </div>

        {/* 2️⃣ Thông tin liên hệ */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Liên hệ chúng tôi
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="text-blue-400 mt-1" />
              <span>
                180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={18} className="text-blue-400 mt-1" />
              <span>Hotline: 0901 234 567 – 0938 765 432</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={18} className="text-blue-400 mt-1" />
              <span>Email: support@HORIZON.vn</span>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Chính sách & hỗ trợ */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Hướng dẫn mua hàng
              </a>
            </li>
          </ul>
        </div>

        {/* 4️⃣ Đăng ký nhận tin */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Đăng ký nhận tin
          </h3>
          <p className="text-sm mb-3">
            Nhận thông tin ưu đãi, bộ sưu tập mới và tin tức độc quyền từ
            HORIZON.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="px-3 py-2 rounded-l-lg w-full outline-none text-gray-800"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* 5️⃣ Dòng bản quyền cuối trang */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} HORIZON- Đại học Công Nghệ Sài Gòn (STU).
        All rights reserved.
      </div>
    </footer>
  );
}
/* riêng không gộp */
