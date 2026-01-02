"use client";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ShoppingBag,
  User,
  LogOut,
  UserCircle,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import AccountModal from "../Chucnang/Taikhoan.jsx";
import bannerNam from "../assets/bannerdafix.jpg";
import bannerNu from "../assets/aonu.jpg";

import CartSidebar from "../Chucnang/Giohang.jsx";
import Logo from "../assets/logo_header/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [maleCategories, setMaleCategories] = useState([]);
  const [femaleCategories, setFemaleCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  /* ===== GỌI API DANH MỤC ===== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/danhmuc");
        const data = res.data.data || [];

        const males = data.filter((d) => d.slug.includes("nam"));
        const females = data.filter((d) => d.slug.includes("nu"));

        setCategories(data);
        setMaleCategories(males);
        setFemaleCategories(females);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===== ĐĂNG NHẬP & ĐĂNG XUẤT ===== */
  const clearLocalWhenLogout = () => {
    try {
      const uid = localStorage.getItem("activeUserId");

      //  xoá giỏ hàng theo user
      if (uid) {
        localStorage.removeItem(`cart_${uid}`);
      }

      // xoá giỏ guest
      localStorage.removeItem("cart_guest");

      // xoá dữ liệu checkout
      localStorage.removeItem("checkoutPayload");

      // xoá auth
      localStorage.removeItem("token");
      localStorage.removeItem("userinfo");
      localStorage.removeItem("activeUserId");

      //  xoá mấy key phụ nếu có
      localStorage.removeItem("lastOrderId");
      localStorage.removeItem("lastPaymentMethod");
      localStorage.removeItem("lastZaloOrderId");
    } catch (e) {
      console.error("Logout clear local error:", e);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userinfo");

    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAvatarClick = () => {
    if (user?.vaitro === "admin") {
      navigate("/admin"); // nếu admin thì nhảy thẳng vào dashboard admin
    } else {
      navigate("/thongtincanhan"); // user thường vẫn vào trang cá nhân
    }
  };
  //Xử lý giá
  // format tiền VNĐ
  const formatMoney = (value) => Number(value).toLocaleString("vi-VN") + "₫";

  // render giá (1 giá hoặc khoảng giá)
  const renderPrice = (item) => {
    const min = Number(item.giaban_min);
    const max = Number(item.giaban_max);

    if (!min && !max) return "";

    if (min === max) {
      return formatMoney(min);
    }

    return `${formatMoney(min)} - ${formatMoney(max)}`;
  };

  /* ===== THANH TÌM KIẾM ===== */
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const q = searchTerm.trim();

    if (!q) {
      setFilteredResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        //  gọi API lọc biến thể (đổi đúng URL API của em)
        const res = await axios.get("http://localhost:5000/api/bienthe/loc", {
          params: {
            search: q, //keyword gõ ở header
            // giữ các bộ lọc nếu em muốn (optional):
            // kichthuoc,
            // mausac,
            // giaTu,
            // giaDen,
            // gioitinh,
          },
        });

        // tuỳ backend trả về: res.data.dulieu
        const list = res.data?.dulieu || [];

        // giới hạn 8 gợi ý cho mượt
        setFilteredResults(list.slice(0, 8));
      } catch (err) {
        console.error("Lỗi search biến thể:", err);
        setFilteredResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    const keyword = searchTerm.trim();
    if (!keyword) return;

    navigate(`/all?search=${encodeURIComponent(keyword)}`);
    setSearchTerm("");
  };

  //================ GIỎ HÀNG ================
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const syncCart = () => {
      try {
        const uid = localStorage.getItem("activeUserId");
        const key = uid ? `cart_${uid}` : "cart_guest";
        const stored = JSON.parse(localStorage.getItem(key)) || [];
        const totalQty = stored.reduce(
          (s, item) => s + Number(item.soluong || 1),
          0
        );
        setCartCount(totalQty);
      } catch (err) {
        console.error("Lỗi khi đọc cart:", err);
      }
    };

    syncCart();
    window.addEventListener("cartUpdated", syncCart);

    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  return (
    <header
      className="fixed top-3 inset-x-0 mx-auto w-[95%] max-w-[1600px]
  bg-white/80 backdrop-blur-xl border border-white/40
  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
  rounded-2xl z-50 transition-all duration-300"
    >
      <div className="h-20 px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center pl-6 gap-x-2 hover:opacity-80 transition"
        >
          <img src={Logo} className="h-10 md:h-16 w-auto object-contain" />
          <span className="text-lg md:text-2xl font-semibold tracking-wide text-gray-900">
            Horizon
          </span>
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center font-medium text-[18px] space-x-10 relative">
          <ul className="flex h-full items-center space-x-10">
            {/* NAM */}
            <li className="group relative h-full flex items-center">
              <Link
                to="/all?gender=Nam"
                className="relative px-4 py-5 font-semibold text-neutral-900
                before:absolute before:bottom-0 before:left-0 before:h-[3px]
                before:w-0 before:bg-black before:transition-all before:duration-300
                hover:before:w-full"
              >
                Nam
              </Link>

              <div
                className="
    fixed left-1/2 -translate-x-1/2
    top-[90px]
    w-[min(1100px,95vw)]
    bg-white/95 backdrop-blur-xl
    shadow-xl border rounded-2xl
    p-8 grid grid-cols-3 gap-8
    z-[60]
    opacity-0 invisible translate-y-4
    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
    transition-all duration-300
  "
              >
                <div className="col-span-2">
                  <h4 className="font-bold mb-3 text-gray-900">Danh mục Nam</h4>
                  <ul className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    {maleCategories.length > 0 ? (
                      maleCategories.map((cat) => (
                        <li key={cat.madanhmuc}>
                          <Link
                            to={`/all?gender=Nam&category=${cat.slug.replace(
                              "-nam",
                              ""
                            )}`}
                          >
                            {cat.tendanhmuc}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        (Đang tải danh mục…)
                      </p>
                    )}
                  </ul>

                  <Link
                    to="/all?gender=Nam"
                    className="inline-block mt-4 font-semibold hover:text-black"
                  >
                    Tất cả sản phẩm →
                  </Link>
                </div>

                <img src={bannerNam} className="rounded-xl shadow-md" />
              </div>
            </li>

            {/* NỮ */}
            <li className="group relative h-full flex items-center">
              <Link
                to="/all?gender=Nữ"
                className="relative px-4 py-5 font-semibold text-neutral-900
                before:absolute before:bottom-0 before:left-0 before:h-[3px]
                before:w-0 before:bg-black before:transition-all before:duration-300
                hover:before:w-full"
              >
                Nữ
              </Link>

              <div
                className="
    fixed left-1/2 -translate-x-1/2
    top-[90px]
    w-[min(1100px,95vw)]
    bg-white/95 backdrop-blur-xl
    shadow-xl border rounded-2xl
    p-8 grid grid-cols-3 gap-8
    z-[60]
    opacity-0 invisible translate-y-4
    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
    transition-all duration-300
  "
              >
                <div className="col-span-2">
                  <h4 className="font-bold mb-3 text-gray-900">Danh mục Nữ</h4>

                  <ul className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    {femaleCategories.length > 0 ? (
                      femaleCategories.map((cat) => (
                        <li key={cat.madanhmuc}>
                          <Link
                            to={`/all?gender=Nữ&category=${cat.slug.replace(
                              "-nu",
                              ""
                            )}`}
                          >
                            {cat.tendanhmuc}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        (Đang tải danh mục…)
                      </p>
                    )}
                  </ul>

                  <Link
                    to="/all?gender=Nữ"
                    className="inline-block mt-4 font-semibold hover:text-black"
                  >
                    Tất cả sản phẩm →
                  </Link>
                </div>

                <img src={bannerNu} className="rounded-xl shadow-md" />
              </div>
            </li>

            {/* LIÊN HỆ */}
            <li className="group h-full flex items-center">
              <a
                href="/lienhe"
                className="relative px-4 py-5 font-semibold text-neutral-900
                before:absolute before:bottom-0 before:left-0 before:h-[3px]
                before:w-0 before:bg-black before:transition-all before:duration-300
                hover:before:w-full"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>

        {/* SEARCH */}
        <div className="hidden md:block flex-shrink-0 max-w-[320px] w-full relative mr-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm sản phẩm…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-full
              border border-gray-300 text-sm text-gray-800 placeholder-gray-500
              focus:ring-2 focus:ring-gray-400 transition"
            />

            <Search
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-600 cursor-pointer"
              onClick={handleSearch}
            />

            {searchTerm && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-xl border rounded-xl z-[60] max-h-60 overflow-y-auto">
                {searchLoading && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Đang tìm…
                  </div>
                )}

                {!searchLoading && filteredResults.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Không tìm thấy kết quả
                  </div>
                )}

                {!searchLoading &&
                  filteredResults.map((item, idx) => {
                    const ten =
                      item.tensanpham ||
                      item.ten ||
                      item.name ||
                      item.tensp ||
                      "Sản phẩm";
                    const giaText = renderPrice(item);
                    const image =
                      item.anhdaidien || item.image || "/no-image.png";

                    // nếu có masp / mabienthe thì điều hướng chi tiết, còn không thì search
                    const go = () => {
                      //  Option 1: nhảy qua trang all với keyword
                      navigate(`/all?search=${encodeURIComponent(ten)}`);
                      setSearchTerm("");
                      setFilteredResults([]);
                    };

                    return (
                      <button
                        key={item.mabienthe || item.id || idx}
                        onClick={go}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex flex-col transition"
                      >
                        <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 w-full">
                          {/* CỘT 1: ẢNH */}
                          <img
                            src={image}
                            alt={ten}
                            className="w-10 h-10 object-cover rounded-md border"
                          />

                          {/* CỘT 2: TÊN */}
                          <span className="text-gray-800 font-semibold truncate">
                            {ten}
                          </span>

                          {/* CỘT 3: GIÁ */}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {giaText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
        {/* MOBILE SEARCH BUTTON */}
        <button
          onClick={() => setIsMobileSearchOpen((v) => !v)}
          className="md:hidden p-2 rounded-full hover:bg-gray-200 transition"
          title="Tìm kiếm"
        >
          <Search className="w-5 h-5 text-gray-800" />
        </button>

        {/* ICONS */}
        <div className="flex items-center gap-4 pr-6">
          {/* GIỎ HÀNG */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ShoppingBag className="w-5 h-5 text-gray-800" />

            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-600 text-white
                text-[10px] font-bold w-5 h-5 flex items-center justify-center
                rounded-full shadow"
              >
                {cartCount}
              </span>
            )}
          </button>

          {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}

          {/*  ICON ĐƠN HÀNG – CHỈ KHI CÓ USER */}
          {user && (
            <button
              onClick={() => navigate("/donhang")}
              className="relative p-2 rounded-full hover:bg-gray-200 transition"
              title="Đơn hàng của bạn"
            >
              <ClipboardList className="w-5 h-5 text-gray-800" />
            </button>
          )}

          {/* ACCOUNT */}
          {!user ? (
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <UserCircle className="w-7 h-7 text-gray-800" />
            </button>
          ) : (
            <div className="relative group px-2 py-1">
              <UserCircle
                className="w-9 h-9 text-gray-800 cursor-pointer"
                onClick={handleAvatarClick}
              />

              <div
                className="
    absolute right-0 mt-3 w-56
    bg-white rounded-2xl shadow-2xl
    border border-gray-100
    opacity-0 invisible
    group-hover:opacity-100 group-hover:visible
    transition-all duration-300 ease-out
    z-50
  "
              >
                <div className="px-4 py-3 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.vaitro === "admin" ? "Quản trị viên" : "Thành viên"}
                  </p>
                </div>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={() => {
                    clearLocalWhenLogout();

                    Swal.fire({
                      icon: "success",
                      title: "Đã đăng xuất",
                      timer: 1200,
                      showConfirmButton: false,
                    }).then(() => {
                      window.location.href = "/";
                    });
                  }}
                  className="
    w-full flex items-center gap-3
    px-4 py-3 text-sm font-medium
    text-gray-700
    hover:bg-red-50 hover:text-red-600
    transition
  "
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {isAccountOpen && (
            <AccountModal
              isOpen={isAccountOpen}
              onClose={() => setIsAccountOpen(false)}
            />
          )}
        </div>
      </div>
      {/* MOBILE SEARCH BAR */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-xl rounded-full
        border border-gray-300 text-sm text-gray-800 placeholder-gray-500
        focus:ring-2 focus:ring-gray-400 transition"
            />
            <Search
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-600 cursor-pointer"
              onClick={handleSearch}
            />

            {/* Gợi ý search (tái dùng y chang desktop) */}
            {searchTerm && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-xl border rounded-xl z-[60] max-h-60 overflow-y-auto">
                {searchLoading && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Đang tìm…
                  </div>
                )}
                {!searchLoading && filteredResults.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Không tìm thấy kết quả
                  </div>
                )}
                {!searchLoading &&
                  filteredResults.map((item, idx) => {
                    const ten =
                      item.tensanpham ||
                      item.ten ||
                      item.name ||
                      item.tensp ||
                      "Sản phẩm";
                    const gia =
                      item.giakhuyenmai ??
                      item.giaban ??
                      item.giasanpham ??
                      item.gia ??
                      0;

                    const go = () => {
                      navigate(`/all?search=${encodeURIComponent(ten)}`);
                      setSearchTerm("");
                      setFilteredResults([]);
                      setIsMobileSearchOpen(false);
                    };

                    return (
                      <button
                        key={item.mabienthe || item.id || idx}
                        onClick={go}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex flex-col transition"
                      >
                        <span className="text-gray-800 font-semibold">
                          {ten}
                        </span>
                        <span className="text-xs text-gray-500">
                          {gia > 0
                            ? Number(gia).toLocaleString("vi-VN") + "₫"
                            : "Liên hệ"}
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
