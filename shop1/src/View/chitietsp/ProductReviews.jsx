import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReviewFilters from "../review/ReviewFilters.jsx";
import ReviewItem from "../review/ReviewItem.jsx";
import ReviewPagination from "../review/ReviewPagination.jsx";
import ReviewAI from "../review/ReviewAI.jsx";
import { normalizeReviews, buildStats } from "../utils/review.utils.js";
import ReviewForm from "../review/ReviewForm.jsx";
export default function ProductReviews({ BASE_URL, productId }) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(true);

  // filter/sort UI state
  const [q, setQ] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]); // [5,4,...]
  const [sort, setSort] = useState("newest"); // newest | highest | lowest
  const [onlyHasImages, setOnlyHasImages] = useState(false);
  const [onlyReplied, setOnlyReplied] = useState(false);

  // paging
  const [page, setPage] = useState(1);
  const pageSize = 5;

  //  1) LOAD API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/danhgia/sanpham/${productId}`
      );
      const normalized = normalizeReviews(res.data?.danhgia || []);
      setRaw(normalized);
      setBackendReady(true);
    } catch (e) {
      if (e.response?.status === 404) {
        setBackendReady(false);
        setRaw([]);
      } else {
        console.error("Load reviews error:", e);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (productId) fetchReviews();
  }, [BASE_URL, productId]);

  // 2) FILTER + SORT (chạy ở FE cho chắc)
  const filtered = useMemo(() => {
    let list = [...raw];

    if (q.trim()) {
      const k = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.content || "").toLowerCase().includes(k) ||
          (r.userName || "").toLowerCase().includes(k)
      );
    }

    if (selectedRatings.length) {
      list = list.filter((r) => selectedRatings.includes(Number(r.rating)));
    }

    if (onlyHasImages) {
      list = list.filter((r) => Array.isArray(r.images) && r.images.length > 0);
    }

    if (onlyReplied) {
      list = list.filter((r) => !!r.adminReply);
    }

    if (sort === "highest")
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "lowest")
      list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    if (sort === "newest")
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

    return list;
  }, [raw, q, selectedRatings, sort, onlyHasImages, onlyReplied]);

  //  3) PAGINATION
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // reset page khi filter đổi
  useEffect(
    () => setPage(1),
    [q, selectedRatings, sort, onlyHasImages, onlyReplied]
  );

  //  thống kê
  const stats = useMemo(() => buildStats(raw), [raw]);

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.manguoidung || null;
    } catch {
      return null;
    }
  }
  const userId = getUserIdFromToken();
  const userReviewCount = useMemo(() => {
    if (!userId) return 0;

    return raw.filter((r) => String(r.userId) === String(userId)).length;
  }, [raw, userId]);
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Đánh giá sản phẩm
          </h2>
          <p className="text-sm text-slate-500 mt-1"></p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-3xl font-black text-slate-900">
            {stats.avg.toFixed(1)}
          </div>
          <div className="text-sm text-slate-600">
            / 5 • {stats.count} đánh giá
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Filters */}
        <div className="lg:col-span-1">
          <ReviewFilters
            q={q}
            setQ={setQ}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            sort={sort}
            setSort={setSort}
            onlyHasImages={onlyHasImages}
            setOnlyHasImages={setOnlyHasImages}
            onlyReplied={onlyReplied}
            setOnlyReplied={setOnlyReplied}
          />
        </div>

        {/* Right: List + AI */}
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
              Đang tải đánh giá...
            </div>
          ) : !backendReady ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
              Hệ thống đánh giá đang được phát triển. Dữ liệu sẽ hiển thị khi
              backend hoàn tất.
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
              Chưa có đánh giá cho sản phẩm này.
            </div>
          ) : (
            <div className="space-y-4">
              {pageItems.map((r) => (
                <ReviewItem key={r.reviewId} review={r} />
              ))}
            </div>
          )}
          <ReviewForm
            productId={productId}
            reviewCount={userReviewCount}
            onSuccess={fetchReviews}
          />

          <ReviewPagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
