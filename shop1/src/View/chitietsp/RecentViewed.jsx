import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecentViewed({
  currentId,
  currentProduct,
  currentPrice,
}) {
  const [recentViewed, setRecentViewed] = useState([]);

  useEffect(() => {
    if (!currentProduct) return;

    try {
      const key = "recent_viewed_products";
      const raw = JSON.parse(localStorage.getItem(key)) || [];

      const item = {
        masanpham: currentProduct.masanpham || currentId,
        tensanpham: currentProduct.tensanpham,
        anhdaidien: currentProduct.anhdaidien,
        giaban: Number(currentPrice || 0),
      };

      const filtered = raw.filter(
        (p) => String(p.masanpham) !== String(item.masanpham)
      );

      const next = [item, ...filtered].slice(0, 8);

      localStorage.setItem(key, JSON.stringify(next));

      // loại chính nó ra khỏi list hiển thị
      setRecentViewed(
        next.filter((p) => String(p.masanpham) !== String(currentId))
      );
    } catch (e) {
      console.error("recent_viewed_products error:", e);
    }
  }, [currentProduct, currentId, currentPrice]);

  if (!recentViewed.length) {
    return (
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
        Chưa có sản phẩm đã xem.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
        Sản phẩm bạn đã xem
      </h2>
      <p className="text-sm text-slate-500 mt-1"></p>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {recentViewed.map((p) => (
          <Link
            to={`/product/${p.masanpham}`}
            key={p.masanpham}
            className="min-w-[260px] max-w-[260px] group"
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
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {Number(p.giaban || 0).toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
