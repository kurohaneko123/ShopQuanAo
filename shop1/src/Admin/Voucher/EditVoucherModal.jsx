export default function EditVoucherModal({
  open,
  onClose,
  data,
  setData,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#111] w-[430px] p-6 rounded-xl border border-white/10 shadow-2xl text-gray-200">
        <h3 className="text-xl font-bold mb-4 text-white">Chỉnh sửa voucher</h3>

        <div className="space-y-3">
          {/* Mã voucher hệ thống */}
          <input
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-400"
            value={data.mavoucher || ""}
            disabled
          />

          {/* Mã giảm giá */}
          <input
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-400"
            value={data.magiamgia || ""}
            disabled
          />

          {/* Mô tả */}
          <textarea
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded h-20 text-gray-200"
            value={data.mota || ""}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />

          {/* Loại */}
          <select
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.loaikhuyenmai || "%"}
            onChange={(e) =>
              setData({ ...data, loaikhuyenmai: e.target.value })
            }
          >
            <option value="%">Phần trăm (%)</option>
            <option value="tiền">Tiền (VNĐ)</option>
          </select>

          {/* Giá trị giảm */}
          <input
            type="number"
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.giatrigiam || ""}
            onChange={(e) => setData({ ...data, giatrigiam: e.target.value })}
          />

          {/* Giảm tối đa */}
          <input
            type="number"
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.giantoida || 0}
            onChange={(e) => setData({ ...data, giantoida: e.target.value })}
          />

          {/* Đơn tối thiểu */}
          <input
            type="number"
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.dontoithieu || 0}
            onChange={(e) => setData({ ...data, dontoithieu: e.target.value })}
          />

          {/* Áp dụng */}
          <select
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.apdungtoanbo ?? 1}
            onChange={(e) =>
              setData({ ...data, apdungtoanbo: Number(e.target.value) })
            }
          >
            <option value={1}>Áp dụng toàn bộ</option>
            <option value={0}>Giới hạn theo SP / danh mục</option>
          </select>

          {/* Ngày */}
          <div className="flex gap-2">
            <input
              type="date"
              className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
              value={data.ngaybatdau?.split("T")[0] || ""}
              onChange={(e) => setData({ ...data, ngaybatdau: e.target.value })}
            />

            <input
              type="date"
              className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
              value={data.ngayketthuc?.split("T")[0] || ""}
              onChange={(e) =>
                setData({ ...data, ngayketthuc: e.target.value })
              }
            />
          </div>

          {/* Trạng thái */}
          <select
            className="bg-[#1a1a1a] border border-white/10 p-2 w-full rounded text-gray-200"
            value={data.trangthai || "hoạt động"}
            onChange={(e) => setData({ ...data, trangthai: e.target.value })}
          >
            <option value="hoạt động">Hoạt động</option>
            <option value="hết hạn">Hết hạn</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 border border-white/10 rounded text-gray-300 hover:bg-white/20 transition"
            >
              Hủy
            </button>

            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded shadow-lg transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
