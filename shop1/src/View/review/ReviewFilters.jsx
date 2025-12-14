export default function ReviewFilters({
  q,
  setQ,
  selectedRatings,
  setSelectedRatings,
  sort,
  setSort,
  onlyHasImages,
  setOnlyHasImages,
  onlyReplied,
  setOnlyReplied,
}) {
  const toggleRating = (n) => {
    setSelectedRatings((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">Lọc đánh giá</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm theo nội dung / tên người đánh giá..."
        className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
      />

      <div className="mt-4">
        <p className="text-xs text-slate-500">Xếp hạng</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((n) => {
            const active = selectedRatings.includes(n);
            return (
              <button
                key={n}
                onClick={() => toggleRating(n)}
                className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white border-slate-200 hover:border-slate-400"
                }`}
              >
                {n} ★
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-500">Sắp xếp</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none"
        >
          <option value="newest">Mới nhất</option>
          <option value="highest">Điểm cao</option>
          <option value="lowest">Điểm thấp</option>
        </select>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyReplied}
            onChange={(e) => setOnlyReplied(e.target.checked)}
          />
          Đã phản hồi
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={onlyHasImages}
            onChange={(e) => setOnlyHasImages(e.target.checked)}
          />
          Có hình ảnh
        </label>
      </div>
    </div>
  );
}
