export default function EditVoucherModal({
  open,
  onClose,
  data,
  setField,
  errors,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[440px] rounded-2xl bg-[#161616] border border-white/10 p-6 text-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-gray-100 mb-5">
          Chỉnh sửa voucher
        </h3>

        <div className="space-y-3">
          <input
            disabled
            className="w-full px-3 py-2 rounded-lg bg-black/20 text-gray-400 border border-white/10"
            value={data.mavoucher || ""}
          />

          <input
            disabled
            className="w-full px-3 py-2 rounded-lg bg-black/20 text-gray-400 border border-white/10"
            value={data.magiamgia || ""}
          />

          <textarea
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10 focus:border-indigo-500 outline-none min-h-[80px]"
            value={data.mota || ""}
            onChange={(e) => setField("mota", e.target.value)}
          />

          <select
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10"
            value={data.loaikhuyenmai || "%"}
            onChange={(e) => setField("loaikhuyenmai", e.target.value)}
          >
            <option value="%">Phần trăm (%)</option>
            <option value="tiền">Tiền (VNĐ)</option>
          </select>

          <input
            type="number"
            className={`w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200
              border ${
                errors?.giatrigiam ? "border-red-500/60" : "border-white/10"
              }
              focus:border-indigo-500 outline-none`}
            value={data.giatrigiam ?? ""}
            onChange={(e) => setField("giatrigiam", e.target.value)}
          />
          {errors?.giatrigiam && (
            <p className="text-xs text-red-400 mt-1">{errors.giatrigiam}</p>
          )}

          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10"
            value={data.giantoida ?? ""}
            onChange={(e) => setField("giantoida", e.target.value)}
          />

          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10"
            value={data.dontoithieu ?? ""}
            onChange={(e) => setField("dontoithieu", e.target.value)}
          />

          <select
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10"
            value={data.apdungtoanbo ?? 1}
            onChange={(e) => setField("apdungtoanbo", Number(e.target.value))}
          >
            <option value={1}>Áp dụng toàn bộ</option>
            <option value={0}>Giới hạn theo SP / danh mục</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              className={`flex-1 px-3 py-2 rounded-lg bg-black/40 text-gray-200
                border ${
                  errors?.ngaybatdau ? "border-red-500/60" : "border-white/10"
                }`}
              value={data.ngaybatdau || ""}
              onChange={(e) => setField("ngaybatdau", e.target.value)}
            />

            <input
              type="date"
              className={`flex-1 px-3 py-2 rounded-lg bg-black/40 text-gray-200
                border ${
                  errors?.ngayketthuc ? "border-red-500/60" : "border-white/10"
                }`}
              value={data.ngayketthuc || ""}
              onChange={(e) => setField("ngayketthuc", e.target.value)}
            />
          </div>
          {errors?.ngayketthuc && (
            <p className="text-xs text-red-400 mt-1">{errors.ngayketthuc}</p>
          )}

          <select
            className="w-full px-3 py-2 rounded-lg bg-black/40 text-gray-200 border border-white/10"
            value={data.trangthai || "hoạt động"}
            onChange={(e) => setField("trangthai", e.target.value)}
          >
            <option value="hoạt động">Hoạt động</option>
            <option value="hết hạn">Hết hạn</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Hủy
            </button>

            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
