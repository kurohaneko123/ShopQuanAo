import React, { useEffect, useMemo, useState } from "react";

export default function QuickAddModal({
  open,
  onClose,
  product,
  variants = [],
  onConfirm,
}) {
  const [mounted, setMounted] = useState(false); // để animation vào/ra mượt
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  // ===== Helpers =====
  const formatPrice = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0đ";
    return `${n.toLocaleString("vi-VN")}đ`;
  };

  // ===== Derive lists =====
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.tenmausac).filter(Boolean))],
    [variants]
  );

  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.tenkichthuoc).filter(Boolean))],
    [variants]
  );

  const availableSizesForColor = useMemo(() => {
    if (!color) return new Set();
    return new Set(
      variants
        .filter((v) => v.tenmausac === color)
        .map((v) => v.tenkichthuoc)
        .filter(Boolean)
    );
  }, [variants, color]);

  const selectedVariant = useMemo(() => {
    return variants.find(
      (v) => v.tenmausac === color && v.tenkichthuoc === size
    );
  }, [variants, color, size]);

  const heroImg =
    selectedVariant?.hinhanh?.[0] || product?.img || product?.anhdaidien || "";

  // ===== Open/Close animation =====
  useEffect(() => {
    if (open) {
      setMounted(true);
      // init default selection
      const first = variants[0];
      if (first) {
        setColor(first.tenmausac || "");
        setSize(first.tenkichthuoc || "");
        setQty(1);
      }
      // ESC to close
      const onEsc = (e) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", onEsc);
      return () => window.removeEventListener("keydown", onEsc);
    } else {
      // delay unmount for exit animation
      const t = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line
  }, [open]);

  // auto set size hợp lệ khi đổi màu
  useEffect(() => {
    if (!color) return;
    if (size && availableSizesForColor.has(size)) return;
    const firstSize =
      variants.find((v) => v.tenmausac === color)?.tenkichthuoc || "";
    setSize(firstSize);
    // eslint-disable-next-line
  }, [color]);

  const handleClose = () => onClose?.();

  const handleConfirm = () => {
    if (!selectedVariant) return;
    onConfirm?.({ variant: selectedVariant, qty });
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4
      ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl
  bg-white rounded-3xl
  shadow-[0_30px_90px_rgba(0,0,0,0.25)]
  transition-all duration-200
        ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-[0.98]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
              {product?.name || product?.tensanpham || "Sản phẩm"}
            </h3>
            <p className="mt-1 text-sm font-bold text-rose-600">
              {formatPrice(
                selectedVariant?.giaban ?? variants?.[0]?.giaban ?? 0
              )}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center"
            aria-label="Đóng"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 pb-6 pt-4">
          {/* Left: Image */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            {heroImg ? (
              <img
                src={heroImg}
                alt={product?.name || "product"}
                className="w-full h-[260px] sm:h-[340px] object-contain bg-white"
              />
            ) : (
              <div className="w-full h-[260px] sm:h-[340px] flex items-center justify-center text-slate-400">
                Không có ảnh
              </div>
            )}
            <div className="px-4 py-3 border-t border-slate-200 bg-white"></div>
          </div>

          {/* Right: Options */}
          <div className="space-y-4">
            {/* Color */}
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">Màu sắc</p>
                <span className="text-sm text-slate-500">{color || "-"}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c) => {
                  const active = c === color;
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition
                        ${
                          active
                            ? "border-[rgb(60,110,190)] ring-2 ring-[rgba(60,110,190,0.35)]"
                            : "border-slate-300 hover:border-[rgb(60,110,190)]"
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">Kích cỡ</p>
                <span className="text-sm text-slate-500">
                  {size ? `Đã chọn: ${size}` : "-"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const enabled = !color || availableSizesForColor.has(s);
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      onClick={() => enabled && setSize(s)}
                      disabled={!enabled}
                      className={`h-10 w-10 rounded-full border text-sm font-extrabold transition
                        ${
                          active
                            ? "bg-[rgb(96,148,216)] text-white border-[rgb(60,110,190)] ring-2 ring-[rgba(60,110,190,0.35)] font-bold"
                            : "bg-white text-slate-800 border-slate-300 hover:border-[rgb(60,110,190)]"
                        }
                        ${
                          !enabled
                            ? "opacity-40 cursor-not-allowed hover:border-slate-200"
                            : ""
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">Số lượng</p>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 rounded-full hover:bg-slate-100 transition font-extrabold"
                  aria-label="Giảm"
                >
                  –
                </button>
                <span className="w-10 text-center font-extrabold text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-9 w-9 rounded-full hover:bg-slate-100 transition font-extrabold"
                  aria-label="Tăng"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="h-px w-full bg-slate-100" />
            <button
              disabled={!selectedVariant}
              onClick={handleConfirm}
              className={`w-full rounded-2xl py-4 font-semibold transition-all
    ${
      selectedVariant
        ? "bg-[rgb(96,148,216)] text-white border border-[rgb(60,110,190)] hover:bg-[rgb(72,128,204)] shadow-[0_14px_32px_rgba(15,23,42,0.25)] active:scale-[0.98]"
        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
    }`}
            >
              Thêm vào giỏ hàng
            </button>

            {/* Small note */}
            <p className="text-xs text-slate-500"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
