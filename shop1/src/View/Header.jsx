"use client";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, LogOut } from "lucide-react";
import AccountModal from "../Chucnang/Taikhoan.jsx";
import bannerNam from "../assets/ao.jpg";
import bannerNu from "../assets/aonu.jpg";
import bannerSale from "../assets/khuyenmai.png";
import CartSidebar from "../Chucnang/Giohang.jsx";
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
import Logo from "../assets/logo_header/logo.png";
export default function Navbar() {
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null); //  lưu thông tin user đăng nhập
  const [isSearchOpen, setIsSearchOpen] = useState(false); //  Thêm để dùng ở icon mobile

  // Khi load trang: đọc localStorage để biết người dùng có đăng nhập không
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Đăng xuất thành công!");
    window.location.reload();
  };
  // ===================== THANH TÌM KIẾM =====================
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  // Dữ liệu tạm để test (sau này em fetch từ backend)
  const products = [
    { id: 1, name: "Áo thun ", price: 199000, img: Aothunbasic },
    { id: 2, name: "Quần jean ", price: 359000, img: Quanjean },
    { id: 3, name: "Quần Short", price: 299000, img: Quanshort },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/all?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Khi người dùng nhập → lọc sản phẩm gợi ý
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
    } else {
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(results);
    }
  }, [searchTerm]);
  return (
    <header className="w-full bg-white text-black shadow-sm fixed top-0 left-0 z-50">
      <div className="w-full h-20 flex items-center justify-between px-6 ">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center pl-12 gap-x-2 hover:opacity-90 transition"
        >
          <img
            src={Logo}
            alt="Horizon Logo"
            className="h-20 w-auto object-contain"
          />
          <span className="text-2xl font-bold tracking-wide text-gray-900">
            Horizon
          </span>
        </Link>

        {/* MENU CHÍNH */}
        <nav className="hidden md:flex flex-none items-center font-medium text-[18px] space-x-10 relative">
          <ul className="flex h-full items-center space-x-10 [&>li]:h-full">
            {/* ========== MENU NAM ========== */}
            <li className="group h-full flex items-center">
              <a
                href="/all?gender=Nam"
                className="group inline-flex h-full items-center relative
                  before:w-0 before:h-[5px] before:bg-blue-600
                  hover:before:w-full before:absolute before:bottom-0 before:left-0
                  before:transition-all before:duration-200
                  px-4 py-5 transition-colors font-semibold text-neutral-900"
              >
                Nam
              </a>

              {/* Mega Menu Nam */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3
  w-[90vw] md:w-[900px] bg-white shadow-lg border rounded-lg
  p-4 md:p-6 grid grid-cols-3 gap-4 md:gap-6 z-[45]
    opacity-0 invisible translate-y-3 
    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
    transition-all duration-300 ease-out"
              >
                <div>
                  <h4 className="font-bold mb-2">Áo Nam</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a
                        href="/all/nam/ao-thun"
                        className="hover:text-blue-600"
                      >
                        Áo thun
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/ao-polo"
                        className="hover:text-blue-600"
                      >
                        Áo Polo
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/ao-so-mi"
                        className="hover:text-blue-600"
                      >
                        Áo sơ mi
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/ao-khoac"
                        className="hover:text-blue-600"
                      >
                        Áo khoác
                      </a>
                    </li>
                    <Link
                      to="/all/nam"
                      className="inline-flex items-center text-neutral-900 hover:text-blue-600 font-bold mb-2"
                    >
                      Tất cả sản phẩm →
                    </Link>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Quần Nam</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a
                        href="/all/nam/quan-short"
                        className="hover:text-blue-600"
                      >
                        Quần Short
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/quan-jogger"
                        className="hover:text-blue-600"
                      >
                        Quần Jogger
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/quan-jean"
                        className="hover:text-blue-600"
                      >
                        Quần Jean
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nam/quan-kaki"
                        className="hover:text-blue-600"
                      >
                        Quần Kaki
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="flex-1">
                  <img
                    src={bannerNam}
                    alt="Banner Nam"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </li>

            {/* ========== MENU NỮ ========== */}
            <li className="group h-full flex items-center">
              <a
                href="/all?gender=Nữ"
                className="group inline-flex h-full items-center relative
                  before:w-0 before:h-[3px] before:bg-blue-600
                  hover:before:w-full before:absolute before:bottom-0 before:left-0
                  before:transition-all before:duration-200
                  px-4 py-5 transition-colors font-semibold text-neutral-900"
              >
                Nữ
              </a>

              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3
  w-[90vw] md:w-[900px] bg-white shadow-lg border rounded-lg
  p-4 md:p-6 grid grid-cols-3 gap-4 md:gap-6 z-[45]
    opacity-0 invisible translate-y-3 
    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
    transition-all duration-300 ease-out"
              >
                <div>
                  <h4 className="font-bold mb-2">Áo Nữ</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="/all/nu/ao-thun" className="hover:text-blue-600">
                        Áo thun
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nu/ao-croptop"
                        className="hover:text-blue-600"
                      >
                        Áo Croptop
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nu/ao-so-mi"
                        className="hover:text-blue-600"
                      >
                        Áo sơ mi
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nu/ao-khoac"
                        className="hover:text-blue-600"
                      >
                        Áo khoác
                      </a>
                    </li>
                    <Link
                      to="/all/nu"
                      className="inline-flex items-center text-neutral-900 hover:text-blue-600 font-bold mb-2"
                    >
                      Tất cả sản phẩm →
                    </Link>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Quần Nữ</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a
                        href="/all/nu/quan-short"
                        className="hover:text-blue-600"
                      >
                        Quần Short
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nu/quan-jean"
                        className="hover:text-blue-600"
                      >
                        Quần Jean
                      </a>
                    </li>
                    <li>
                      <a href="/all/nu/vay-nu" className="hover:text-blue-600">
                        Chân váy
                      </a>
                    </li>
                    <li>
                      <a
                        href="/all/nu/quan-jogger"
                        className="hover:text-blue-600"
                      >
                        Quần Jogger
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="flex-1">
                  <img src={bannerNu} alt="Banner Nữ" className="rounded-lg" />
                </div>
              </div>
            </li>

            {/* ========== MENU KHUYẾN MÃI ========== */}
            <li className="group h-full flex items-center">
              <a
                href="/sale"
                className="group inline-flex h-full items-center relative text-red-500
                  before:w-0 before:h-[3px] before:bg-red-500 
                  hover:before:w-full before:absolute before:bottom-0 before:left-0 
                  before:transition-all before:duration-200 
                  px-4 py-5 transition-colors font-semibold"
              >
                Khuyến mãi
              </a>
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                w-[800px] bg-white shadow-lg border rounded-lg 
                p-8 grid grid-cols-3 gap-8 z-50 
                opacity-0 invisible translate-y-3 
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
                transition-all duration-300 ease-out"
              >
                <div>
                  <h4 className="font-bold mb-2">Danh mục sale</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="/sale/ao-thun" className="hover:text-blue-600">
                        Áo thun giảm giá
                      </a>
                    </li>
                    <li>
                      <a href="/sale/quan" className="hover:text-blue-600">
                        Quần sale
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <img
                    src={bannerSale}
                    alt="Banner sale"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </li>

            {/* Menu Liên hệ */}
            <li className="h-full flex items-center">
              <a
                href="/lienhe"
                className="group inline-flex h-full items-center relative 
                  before:w-0 before:h-[3px] before:bg-blue-600 
                  hover:before:w-full before:absolute before:bottom-0 before:left-0 
                  before:transition-all before:duration-200 
                  px-4 py-5 transition-colors font-semibold text-neutral-900"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
        {/* ================= THANH TÌM KIẾM (Desktop) ================= */}
        <div className="flex-shrink-0 flex justify-end max-w-[320px] w-full relative mr-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full outline-none text-sm text-gray-800 
                 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 
                 shadow-inner transition-all duration-200"
            />
            <Search
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={handleSearch}
            />

            {/* Dropdown gợi ý */}
            {searchTerm && filteredResults.length > 0 && (
              <div className="absolute top-11 left-0 w-full bg-white border rounded-xl shadow-lg z-[60] max-h-60 overflow-y-auto">
                {filteredResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigate(`/all?search=${encodeURIComponent(p.name)}`);
                      setSearchTerm(""); // clear ô
                      setFilteredResults([]); // ẩn dropdown
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-800">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Icon Search*/}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 md:hidden"
        >
          <Search className="w-5 h-5 text-gray-800" />
        </button>

        {/* Icons  */}
        <div className="flex items-center gap-3 md:gap-4 pr-6">
          {/* Giỏ hàng */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <ShoppingBag className="w-5 h-5 text-gray-800 hover:text-blue-600" />
          </button>
          {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}

          {/* ✅ Nếu user chưa đăng nhập */}
          {!user ? (
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <User className="w-5 h-5 text-gray-800 hover:text-blue-600" />
            </button>
          ) : (
            // ✅ Nếu user đã đăng nhập
            <div className="relative group">
              <img
                src={
                  user.photo ||
                  "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                }
                alt="avatar"
                className="w-9 h-9 rounded-full border cursor-pointer hover:opacity-80"
              />
              {/* Menu dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            </div>
          )}

          {/* Modal tài khoản */}
          {isAccountOpen && (
            <AccountModal
              isOpen={isAccountOpen}
              onClose={() => setIsAccountOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
