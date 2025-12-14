import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductRecommendations({ BASE_URL, currentProductId }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1️⃣ Lấy danh sách sản phẩm
        const res = await axios.get(`${BASE_URL}/api/sanpham`);
        let list = res.data?.data || [];

        // 2️⃣ Loại bỏ sản phẩm đang xem
        list = list.filter((p) => p.masanpham !== Number(currentProductId));

        // 3️⃣ Lấy 4 sản phẩm đầu (gợi ý đơn giản)
        const picked = list.slice(0, 4);

        setProducts(picked);

        // 4️⃣ Lấy giá cho từng sản phẩm
        const priceTemp = {};
        await Promise.all(
          picked.map(async (p) => {
            try {
              const detail = await axios.get(
                `${BASE_URL}/api/sanpham/${p.masanpham}`
              );
              const variants = detail.data?.bienthe || [];
              if (variants.length > 0) {
                priceTemp[p.masanpham] = Number(variants[0].giaban);
              }
            } catch {}
          })
        );

        setPriceMap(priceTemp);
      } catch (err) {
        console.error("Lỗi load gợi ý:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [BASE_URL, currentProductId]);

  if (loading) return null;
  if (products.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-gray-500">Chưa có gợi ý</div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Gợi ý sản phẩm</h2>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div
            key={p.masanpham}
            onClick={() => navigate(`/product/${p.masanpham}`)}
            className="min-w-[260px] max-w-[260px] group cursor-pointer"
          >
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-[4/5] bg-slate-50">
                <img
                  src={p.anhdaidien}
                  alt={p.tensanpham}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold text-slate-900 line-clamp-2">
                  {p.tensanpham}
                </p>

                {priceMap[p.masanpham] ? (
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {priceMap[p.masanpham].toLocaleString("vi-VN")}₫
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">Đang tải giá…</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
