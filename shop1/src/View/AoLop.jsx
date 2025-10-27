"use client";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/** Dùng tạm các ảnh sẵn có trong assets của bạn */
import Aothunbasic from "../assets/aothunbasic.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aokhoac from "../assets/aokhoac.jpg";
import Quanjean from "../assets/quanjean.jpg";
import QuanjoogerTrang from "../assets/quanjoogertrang.png";
import Aosomi from "../assets/aosomi.jpg";
import AolopBanner from "../assets/aolop-banner.jpg";
import AIChatbox from "../components/AIChatbox";
/** Hero (banner) */
/** Hero (banner bố cục 1/3 – 2/3 cực cân đối) */
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[450px] flex items-center justify-start overflow-hidden rounded-2xl shadow-md mt-8">
      {/* Ảnh nền full */}
      <img
        src={AolopBanner}
        alt="Banner áo lớp & kỷ yếu"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay xanh mint nhẹ (làm tối 1/3 trái để chữ nổi hơn) */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/75 via-cyan-700/40 to-transparent"></div>

      {/* Nội dung chiếm 1/3 bên trái */}
      <div className="relative z-10 w-full max-w-[70%] pl-[6%] text-white">
        {/* Tiêu đề chính */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight uppercase text-left drop-shadow-lg">
          Áo Lớp & Kỷ Yếu <br />
          <span className="bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-200 bg-clip-text text-transparent">
            Theo Phong Cách Của Bạn
          </span>
        </h1>

        {/* Mô tả */}
        <p className="mt-3 text-sm md:text-base text-gray-100 leading-relaxed max-w-[70%] text-left drop-shadow-md">
          Chọn form – phối màu – thêm logo/slogan – duyệt mẫu nhanh trong 24h.
          Biến ý tưởng lớp bạn thành hiện thực với phong cách riêng.
        </p>

        {/* Nút hành động */}
        <div className="mt-5 flex flex-row gap-3 justify-start">
          <a
            href="#bang-gia"
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
    </section>
  );
};

/** Dữ liệu demo */
const FORMS = [
  { id: "tee", name: "Áo thun (T-shirt)", img: Aothunbasic, tag: "Áo thun" },
  { id: "polo", name: "Áo Polo", img: Aopolo, tag: "Polo" },
  { id: "hoodie", name: "Áo Hoodie/Nỉ", img: Aokhoac, tag: "Hoodie" },
  { id: "sweat", name: "Áo khoác/sweatshirt", img: Aokhoac, tag: "Khoác" },
  { id: "jogger", name: "Quần Jogger", img: QuanjoogerTrang, tag: "Quần" },
  { id: "jean", name: "Quần Jeans", img: Quanjean, tag: "Quần" },
];

const COLORS = [
  "Trắng",
  "Đen",
  "Xanh navy",
  "Vàng đồng",
  "Tím mộng mơ",
  "Xám khói",
];
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

/** Thẻ chip */
const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={
      "px-4 py-2 rounded-full text-sm font-medium border transition " +
      (active
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-800 border-gray-300 hover:border-gray-400")
    }
  >
    {children}
  </button>
);

/** Lưới mẫu & bộ lọc */
const MauSection = () => {
  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState("Tất cả");

  const filtered = useMemo(() => {
    return FORMS.filter((f) => {
      const hitKw =
        !keyword ||
        f.name.toLowerCase().includes(keyword.toLowerCase()) ||
        f.tag.toLowerCase().includes(keyword.toLowerCase());
      const hitTag = tag === "Tất cả" || f.tag === tag;
      return hitKw && hitTag;
    });
  }, [keyword, tag]);

  return (
    <section className="container mx-auto px-6 py-12" id="mau">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Chọn mẫu & form dáng
          </h2>
          <p className="text-gray-600 mt-2">
            Chọn loại áo/quần phù hợp, bạn có thể tuỳ biến màu – logo – slogan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm: Áo thun, Polo..."
            className="h-11 w-64 max-w-full rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Filter tags */}
      <div className="mt-6 flex flex-wrap gap-3">
        {["Tất cả", "Áo thun", "Polo", "Hoodie", "Khoác", "Quần"].map((t) => (
          <Chip key={t} active={t === tag} onClick={() => setTag(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {/* Grid mẫu */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition"
          >
            <div className="h-48 bg-gray-50">
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <p className="font-semibold">{m.name}</p>
              <p className="text-xs text-gray-500 mt-1">{m.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/** Bảng giá */
const BangGia = () => {
  const plans = [
    {
      name: "Gói Basic",
      desc: "In 1 mặt, 1 màu. Vải cotton 65/35",
      price: "119k - 149k",
      features: ["Thiết kế nhanh 24h", "Tối đa 1 màu in", "Min 20 áo"],
      cta: "Chọn gói Basic",
      highlight: false,
    },
    {
      name: "Gói Pro",
      desc: "In 2 mặt, 2–4 màu. Vải cotton 100%/polo cá sấu",
      price: "159k - 219k",
      features: [
        "Thiết kế kèm mockup 3D",
        "2–4 màu in",
        "Min 20 áo",
        "Tặng file in khẩu hiệu",
      ],
      cta: "Chọn gói Pro",
      highlight: true,
    },
    {
      name: "Gói Premium",
      desc: "Thêu/in chuyển nhiệt, phối màu theo lớp",
      price: "239k - 329k",
      features: [
        "Thiết kế logo độc quyền",
        "Chất liệu cao cấp",
        "Không giới hạn màu",
        "Ưu tiên tiến độ",
      ],
      cta: "Chọn gói Premium",
      highlight: false,
    },
  ];

  return (
    <section className="bg-gray-50" id="bang-gia">
      <div className="container mx-auto px-6 py-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
          Bảng giá tham khảo
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Giá thực tế tuỳ số lượng, chất liệu và kỹ thuật in/thêu.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                "rounded-2xl border bg-white p-6 flex flex-col " +
                (p.highlight
                  ? "border-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                  : "border-gray-200")
              }
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-gray-600 mt-1">{p.desc}</p>
                <p className="text-3xl font-extrabold mt-4">{p.price}</p>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-900" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={
                  "mt-6 rounded-full px-6 py-3 font-semibold transition " +
                  (p.highlight
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white")
                }
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Quy trình làm việc */
const QuyTrinh = () => {
  const steps = [
    { t: "1. Tư vấn & chốt form", d: "Chọn chất liệu, màu, size và số lượng." },
    {
      t: "2. Thiết kế & duyệt mẫu",
      d: "Gửi demo/3D trong 24h, sửa miễn phí 2 lần.",
    },
    { t: "3. Sản xuất", d: "In/thêu theo kỹ thuật đã chốt, QC từng lô." },
    { t: "4. Giao hàng", d: "Giao tận nơi, hỗ trợ đổi size trong 3 ngày." },
  ];
  return (
    <section className="container mx-auto px-6 py-14" id="quy-trinh">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
        Quy trình 4 bước
      </h2>
      <div className="mt-10 grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="rounded-2xl border bg-white p-6">
            <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
            <p className="text-gray-600 mt-1">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/** Gallery */
const Gallery = () => {
  const imgs = [
    Aothunbasic,
    Aopolo,
    Aokhoac,
    Quanjean,
    QuanjoogerTrang,
    Aosomi,
  ];
  return (
    <section className="container mx-auto px-6 py-14" id="gallery">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
        Tham khảo thành phẩm
      </h2>
      <p className="text-gray-600 text-center mt-2">
        Một vài mẫu gần đây từ khách lớp/đoàn trường.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {imgs.map((src, idx) => (
          <figure
            key={idx}
            className="rounded-2xl overflow-hidden border bg-white"
          >
            <img
              src={src}
              alt={`gallery-${idx}`}
              className="w-full h-40 md:h-44 object-cover hover:scale-105 transition-transform duration-300"
            />
          </figure>
        ))}
      </div>
    </section>
  );
};

/** Form yêu cầu báo giá */
const QuoteForm = () => {
  const [state, setState] = useState({
    tenLop: "",
    soLuong: 30,
    mauSac: COLORS[0],
    form: FORMS[0].name,
    sizes: [],
    ghiChu: "",
    lienHe: "",
  });

  const toggleSize = (sz) => {
    setState((s) => ({
      ...s,
      sizes: s.sizes.includes(sz)
        ? s.sizes.filter((x) => x !== sz)
        : [...s.sizes, sz],
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    alert("Đã gửi yêu cầu báo giá! Chúng tôi sẽ liên hệ sớm.");
  };

  return (
    <section className="bg-gray-50" id="bao-gia">
      <div className="container mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Yêu cầu báo giá nhanh
            </h2>
            <p className="text-gray-600 mt-2">
              Điền thông tin cơ bản, chúng tôi báo giá & tư vấn thiết kế trong
              24h.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp
                  </label>
                  <input
                    required
                    value={state.tenLop}
                    onChange={(e) =>
                      setState({ ...state, tenLop: e.target.value })
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="12A1, CNTT K46..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng dự kiến
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={state.soLuong}
                    onChange={(e) =>
                      setState({ ...state, soLuong: +e.target.value })
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form
                  </label>
                  <select
                    value={state.form}
                    onChange={(e) =>
                      setState({ ...state, form: e.target.value })
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {FORMS.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu chủ đạo
                  </label>
                  <select
                    value={state.mauSac}
                    onChange={(e) =>
                      setState({ ...state, mauSac: e.target.value })
                    }
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {COLORS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn size
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={
                        "px-4 py-2 rounded-xl border text-sm font-semibold transition " +
                        (state.sizes.includes(sz)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-400")
                      }
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={4}
                  value={state.ghiChu}
                  onChange={(e) =>
                    setState({ ...state, ghiChu: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Logo/slogan, deadline dự kiến, kỹ thuật in thêu mong muốn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại / Email
                </label>
                <input
                  required
                  value={state.lienHe}
                  onChange={(e) =>
                    setState({ ...state, lienHe: e.target.value })
                  }
                  className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="090..., email@..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                >
                  Gửi yêu cầu
                </button>
                <Link
                  to="/lienhe"
                  className="rounded-full px-6 py-3 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition"
                >
                  Tư vấn miễn phí
                </Link>
              </div>
            </form>
          </div>

          {/* Card thông tin nhanh */}
          <div className="rounded-2xl border bg-white p-6 h-fit">
            <h3 className="text-xl font-bold">Thông tin nhanh</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li>• Thiết kế & duyệt trong 24–48h</li>
              <li>• Miễn phí 2 lần chỉnh sửa mẫu</li>
              <li>• Áp dụng giảm theo số lượng</li>
              <li>• Giao hàng toàn quốc</li>
              <li>• Hỗ trợ đổi size trong 3 ngày</li>
            </ul>
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="font-semibold">Ưu đãi tháng này</p>
              <p className="text-gray-600 mt-1">
                Tặng file banner lớp + template avatar khi đặt từ 30 áo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** FAQ */
const FAQ = () => {
  const items = [
    {
      q: "Tối thiểu bao nhiêu áo?",
      a: "Từ 20 áo trở lên. Đặt số lượng lớn sẽ có giá tốt hơn.",
    },
    {
      q: "Mất bao lâu để có mẫu thiết kế?",
      a: "Trong 24–48h sau khi chốt thông tin, chúng tôi gửi mẫu/3D để bạn duyệt.",
    },
    {
      q: "Có hỗ trợ thiết kế logo/slogan không?",
      a: "Có. Gói Pro/Premium bao gồm thiết kế logo độc quyền và tinh chỉnh slogan.",
    },
    {
      q: "Giao hàng thế nào?",
      a: "Giao tận nơi trên toàn quốc, miễn phí nội thành với đơn > 50 áo.",
    },
  ];
  return (
    <section className="container mx-auto px-6 py-14" id="faq">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
        Câu hỏi thường gặp
      </h2>
      <div className="mt-8 divide-y rounded-2xl border bg-white">
        {items.map((it, i) => (
          <details key={i} className="p-6 group">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-semibold text-gray-900">{it.q}</span>
              <span className="text-gray-400 group-open:rotate-180 transition">
                ⌄
              </span>
            </summary>
            <p className="mt-3 text-gray-600">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default function AoLopKyYeuPage() {
  return (
    <main className="bg-white">
      <Hero />
      <MauSection />
      <BangGia />
      <QuyTrinh />
      <Gallery />
      <QuoteForm />
      <FAQ />
      <AIChatbox />

      {/* CTA cuối trang */}
      <section className="container mx-auto px-6 py-14 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Sẵn sàng lên ý tưởng cho lớp bạn?
        </h3>
        <p className="text-gray-600 mt-2">
          Chúng tôi sẽ đồng hành từ khâu thiết kế đến khi nhận áo tận tay.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <a
            href="#bao-gia"
            className="rounded-full px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
          >
            Gửi yêu cầu báo giá
          </a>
          <Link
            to="/lienhe"
            className="rounded-full px-6 py-3 border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition"
          >
            Liên hệ
          </Link>
        </div>
      </section>
    </main>
  );
}
