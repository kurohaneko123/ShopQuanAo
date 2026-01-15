"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuickAddModal from "./QuickAddModal.jsx";
import { ShoppingBag } from "lucide-react";

/* ====== Import ảnh mẫu (tạm) ====== */
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aocottonden from "../assets/aothuncottonden1.jpg";
import Aocottontrang from "../assets/aothuncottontrang1.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";
import QuanjoogerTrang from "../assets/quanjoogertrang.png";
import Quanshort from "../assets/quan-short.jpg";
import Bannermacthuongngay from "../assets/banner_mac.jpg";
import Bannergoiy from "../assets/banner_goiy2.webp";
import Swal from "sweetalert2";

//
// Vì đây chỉ là CSS + vị trí tuyệt đối (absolute), đổi className là xong.
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
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState("nam");
  const [dailyProducts, setDailyProducts] = useState([]);
  const [highlightProducts, setHighlightProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState({ nam: [], nu: [] });
  const [openQuickAdd, setOpenQuickAdd] = useState(false);
  const [quickProduct, setQuickProduct] = useState(null);
  const [quickVariants, setQuickVariants] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  // Hàm chuyển đến trang chi tiết sản phẩm
  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };
  // Lấy key giỏ hàng dựa trên user hiện tại
  const getCartKey = () => {
    const uid = localStorage.getItem("activeUserId");
    return uid ? `cart_${uid}` : "cart_guest";
  };

  /* ====== Cấu hình slider ====== */
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },

      // tablet
      { breakpoint: 768, settings: { slidesToShow: 2 } },

      // mobile
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, //tắt hiển thị 2 sản phẩm
          slidesToScroll: 1,
          arrows: false, //ẩn nút điều hướng
        },
      },
    ],
  };

  /* ====== Ưu đãi nổi bật ====== */
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/voucher");
        setVouchers(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải voucher:", error);
      }
    };
    fetchVouchers();
  }, []);
  //Nút coppy
  const copyVoucher = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Đã copy mã!",
          text: `Đã copy mã: ${code}`,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Copy thất bại!",
          text: "Lỗi,Không thể copy mã voucher.",
        });
      });
  };

  /* ====== Gọi API ====== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, voucherRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sanpham"),
          axios.get("http://localhost:5000/api/voucher"),
        ]);

        const apiData = productRes.data.data || [];
        const mapped = apiData.map((item) => ({
          id: item.masanpham,
          name: item.tensanpham,
          img: item.anhdaidien || "",
          brand: item.thuonghieu,
          mota: item.mota,
          categoryId: item.madanhmuc,
        }));

        setDailyProducts(mapped.slice(0, 6));
        setVouchers(voucherRes.data.data || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  /* ====== Lấy giá sản phẩm ====== */
  const categoryNameMap = {
    aothun: "Áo Thun",
    somi: "Áo Sơ Mi",
    quanjean: "Quần Jean",
    khoac: "Áo Khoác",
    polo: "Áo Polo",
    dam: "Đầm",
    vay: "Váy",
    quantay: "Quần Tây",
    quanshort: "Quần Short",
    quanhogi: "Quần Jogger",
    khac: "Khác",
  };
  // Tập hợp tất cả sản phẩm trên homepage để lấy giá
  const allHomeProducts = React.useMemo(() => {
    const map = new Map();
    [...dailyProducts, ...highlightProducts].forEach((p) => {
      if (p?.id) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [dailyProducts, highlightProducts]);
  // Lấy giá cho tất cả sản phẩm trên homepage
  useEffect(() => {
    if (allHomeProducts.length === 0) return;

    const fetchPrices = async () => {
      const map = {};

      await Promise.all(
        allHomeProducts.map(async (p) => {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/sanpham/${p.id}`
            );
            const variants = res.data.bienthe || [];

            if (variants.length > 0) {
              const preferredVariant =
                variants.find(
                  (v) => String(v.tenkichthuoc || "").toUpperCase() === "M"
                ) || variants[0];

              const basePrice = Number(preferredVariant?.giaban);

              if (Number.isFinite(basePrice)) {
                map[p.id] = basePrice;
              }
            }
          } catch (err) {
            console.error("Lỗi lấy giá:", err);
          }
        })
      );

      setPriceMap(map);
    };

    fetchPrices();
  }, [allHomeProducts]);

  // Lấy danh mục từ ảnh đại diện
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sanpham");
        const data = res.data.data || [];

        const male = {};
        const female = {};

        data.forEach((item) => {
          const name = item.tensanpham.toLowerCase();
          const url = item.anhdaidien?.toLowerCase() || "";

          const isMale = url.includes("/nam/");
          const isFemale = url.includes("/nu/");

          if (!isMale && !isFemale) return;

          let key = "";

          if (name.includes("áo thun")) key = "aothun";
          else if (name.includes("sơ mi") || name.includes("som i"))
            key = "somi";
          else if (name.includes("jean")) key = "quanjean";
          else if (name.includes("khoác") || name.includes("khoac"))
            key = "khoac";
          else if (name.includes("polo")) key = "polo";
          else if (name.includes("đầm") || name.includes("dam")) key = "dam";
          else if (name.includes("váy") || name.includes("vay")) key = "vay";
          else if (name.includes("quần tây") || name.includes("quan tay"))
            key = "quantay";
          else if (name.includes("short")) key = "quanshort";
          else if (name.includes("jogger")) key = "quanjogger";
          else key = "khac";

          const displayName = categoryNameMap[key] || "Khác";

          const entry = {
            name: displayName,
            img: item.anhdaidien,
            slug: key,
            productId: item.masanpham,
          };

          if (isMale) male[displayName] = entry;
          if (isFemale) female[displayName] = entry;
        });

        setCategories({
          nam: Object.values(male),
          nu: Object.values(female),
        });
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };

    fetchCategories();
  }, []);
  /* ====== SẢN PHẨM NỔI BẬT (BÁN CHẠY) ====== */
  useEffect(() => {
    const fetchHighlightProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/donhang/sanphamnoibat?limit=6"
        );

        const data = res.data.data || [];

        const mapped = data.map((item) => ({
          id: item.masanpham,
          name: item.tensanpham,
          img: item.anhdaidien || "",
          brand: item.thuonghieu,
          mota: item.mota,
        }));

        setHighlightProducts(mapped);
      } catch (err) {
        console.error("Lỗi tải sản phẩm nổi bật:", err);
      }
    };

    fetchHighlightProducts();
  }, []);

  /* ====== thêm nhanh vào giỏ hàng từ Homepage — ====== */
  const handleAddToCart = async (p) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sanpham/${p.id}`);

      const variants = res.data.bienthe || [];

      if (variants.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Sản phẩm hiện không có biến thể để thêm vào giỏ hàng.",
        });

        return;
      }

      setQuickProduct(p);
      setQuickVariants(variants);
      setOpenQuickAdd(true);
    } catch (err) {
      console.error("Lỗi mở popup thêm nhanh:", err);
    }
  };

  const gridCategories =
    selectedGender === "nam" ? categories.nam : categories.nu;

  /* ====== Loading & Error ====== */
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

  /* ====== Render ====== */
  return (
    <main className="bg-white">
      <div className="container mx-auto px-6">
        {/* ===== Bộ lọc giới tính =====
        // Vì đang dùng flex + gap, muốn đưa sang trái/phải chỉ cần justify-between hoặc justify-end.
        // Muốn đổi thành dropdown cũng được → sửa UI thôi. */}

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
            {gridCategories.map((cat, index) => (
              <div
                key={cat.slug || index}
                className="group flex flex-col items-center"
              >
                <Link to={`/product/${cat.productId}`}>
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

        {/* ===== Sản phẩm Mặc hằng ngày ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-6">Sản phẩm mặc hằng ngày</h2>
        </div>
        {/* ===== Slider sản phẩm ====== */}
        <section className="relative overflow-visible pb-20">
          <Slider {...settings}>
            {dailyProducts.map((p) => (
              <div key={p.id} className="px-3">
                <div
                  onClick={() => goToDetail(p.id)}
                  className="relative group bg-white border rounded-2xl overflow-hidden 
             shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  <div className="bg-gray-50 h-44 sm:h-56 md:h-72">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 sm:p-4 text-center">
                    <h3 className="font-semibold text-[13px] sm:text-base line-clamp-2">
                      {p.name}
                    </h3>
                    {priceMap[p.id] ? (
                      <p className="text-red-600 font-bold text-sm sm:text-[15px] mt-0.5">
                        {priceMap[p.id].toLocaleString("vi-VN")}đ
                      </p>
                    ) : (
                      <p className="text-slate-400 text-sm">Đang tải giá…</p>
                    )}
                  </div>
                  <div
                    className="
  absolute top-3 right-3
  opacity-100 sm:opacity-0 sm:group-hover:opacity-100
  transition-all duration-300
"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="
  w-9 h-9 sm:w-11 sm:h-11
 rounded-full
  bg-white text-[rgb(96,148,216)]
  border border-slate-200
  flex items-center justify-center
  shadow-md
  hover:bg-[rgb(96,148,216)] hover:text-white hover:[rgb(60,110,190)]
 hover:scale-105
    transition-all duration-300
"
                      aria-label="Thêm vào giỏ hàng"
                    >
                      <ShoppingBag size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* ===== Banner Gợi ý ===== */}
        <section className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-16">
          <img
            src={Bannergoiy}
            alt="Banner Gợi Ý"
            className="w-full h-full object-cover"
          />
        </section>
        {/* ===== Sản phẩm nổi bật ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-6">Sản phẩm nổi bật</h2>
        </div>
        {/* ===== Slider sản phẩm ====== */}
        <section className="relative overflow-visible pb-20">
          <Slider {...settings}>
            {highlightProducts.map((p) => (
              <div key={p.id} className="px-3">
                <div
                  onClick={() => goToDetail(p.id)}
                  className="relative group bg-white border rounded-2xl overflow-hidden 
             shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  <div className="bg-gray-50 h-48 sm:h-60 md:h-72">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                      {p.name}
                    </h3>
                    {priceMap[p.id] ? (
                      <p className="text-red-600 font-bold text-[15px]">
                        {priceMap[p.id].toLocaleString("vi-VN")}đ
                      </p>
                    ) : (
                      <p className="text-slate-400 text-sm">Đang tải giá…</p>
                    )}
                  </div>
                  <div
                    className="
  absolute top-3 right-3
  opacity-0 group-hover:opacity-100
  transition-all duration-300
"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="
  w-11 h-11 rounded-full
  bg-white text-[rgb(96,148,216)]
  border border-slate-200
  flex items-center justify-center
  shadow-md
  hover:bg-[rgb(96,148,216)] hover:text-white hover:[rgb(60,110,190)]
 hover:scale-105
    transition-all duration-300
"
                      aria-label="Thêm vào giỏ hàng"
                    >
                      <ShoppingBag size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        {/* ===== Ưu đãi nổi bật ===== */}
        <section className="pb-28">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Ưu đãi nổi bật
            </h2>
          </div>

          {vouchers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {vouchers.map((v) => (
                <div
                  key={v.magiamgia}
                  className="relative overflow-hidden rounded-3xl border border-blue-200 shadow-sm 
              bg-gradient-to-br from-blue-50 via-white to-blue-100
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Mép rách kiểu phiếu giảm giá */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 rounded-l-3xl"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-blue-200 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-blue-200 rounded-full"></div>

                  {/* Nội dung voucher */}
                  <div className="px-8 py-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                      {v.tenvoucher}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{v.mota}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl font-extrabold text-red-500 drop-shadow-sm">
                        {v.loaikhuyenmai === "%"
                          ? `${v.giatrigiam}%`
                          : `${v.giatrigiam.toLocaleString("vi-VN")}đ`}
                      </span>
                      <span className="text-gray-500 text-sm mt-2">
                        {v.loaikhuyenmai === "%" ? "giảm giá" : "giảm tiền mặt"}
                      </span>
                    </div>
                    {/* Hạn sử dụng và nút Sử dụng ngay */}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-600">
                        HSD:{" "}
                        <span className="font-semibold text-gray-900">
                          {new Date(v.ngayketthuc).toLocaleDateString("vi-VN")}
                        </span>
                      </span>
                      {/* Nút Sử dụng ngay */}
                      <button
                        onClick={() => copyVoucher(v.magiamgia)} // ← thêm dòng này
                        className="bg-[rgb(96,148,216)] border border-[rgb(60,110,190)] text-white px-5 py-2 rounded-lg hover:bg-[rgb(72,128,204)] transition font-semibold"
                      >
                        Sử dụng ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              Hiện chưa có ưu đãi nào
            </p>
          )}
        </section>
      </div>
      <QuickAddModal
        open={openQuickAdd}
        onClose={() => setOpenQuickAdd(false)}
        product={quickProduct}
        variants={quickVariants}
        onConfirm={({ variant, qty }) => {
          const key = getCartKey();
          const stored = JSON.parse(localStorage.getItem(key)) || [];

          const item = {
            mabienthe: variant.mabienthe,
            tensanpham: quickProduct.name,
            giagoc: Number(variant.giaban),
            giakhuyenmai: Number(variant.giaban),
            soluong: qty,
            mausac: variant.tenmausac,
            size: variant.tenkichthuoc,
            hinhanh: variant.hinhanh?.[0] || quickProduct.img,
            sku: variant.sku,
          };
          {
            /* Kiểm tra nếu biến thể đã tồn tại trong giỏ hàng thì chỉ tăng số lượng */
          }
          const exist = stored.find((i) => i.mabienthe === item.mabienthe);
          if (exist) exist.soluong += qty;
          else stored.push(item);

          localStorage.setItem(key, JSON.stringify(stored));
          window.dispatchEvent(new Event("cartUpdated"));

          setOpenQuickAdd(false);
        }}
      />
    </main>
  );
}
