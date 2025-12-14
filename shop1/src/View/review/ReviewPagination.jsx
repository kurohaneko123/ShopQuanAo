export default function ReviewPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold disabled:opacity-40"
      >
        Trước
      </button>

      <span className="px-3 py-2 text-sm text-slate-600">
        {page}/{totalPages}
      </span>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold disabled:opacity-40"
      >
        Sau
      </button>
    </div>
  );
}
