export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full
        border border-white/20 text-gray-300
        hover:bg-white/10 disabled:opacity-30 transition"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const active = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 rounded-full font-semibold text-sm transition-all
              ${
                active
                  ? "bg-indigo-600 text-white shadow-lg scale-110"
                  : "border border-white/20 text-gray-300 hover:bg-white/10"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full
        border border-white/20 text-gray-300
        hover:bg-white/10 disabled:opacity-30 transition"
      >
        ›
      </button>
    </div>
  );
}
