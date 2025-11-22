export default function EditVoucherModal({
  open,
  onClose,
  data,
  setData,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa voucher</h3>

        <div className="space-y-3">
          {/* Hiện mã voucher (chỉ xem) */}
          <input
            className="border p-2 w-full rounded bg-gray-100 text-gray-500"
            value={data.mavoucher || ""}
            disabled
          />

          {/* Mã giảm giá */}
          <input
            className="border p-2 w-full rounded"
            value={data.magiamgia || ""}
            disabled
          />

          {/* Mô tả */}
          <textarea
            className="border p-2 w-full rounded h-20"
            value={data.mota || ""}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />

          {/* Loại */}
          <select
            className="border p-2 w-full rounded"
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
            className="border p-2 w-full rounded"
            value={data.giatrigiam || ""}
            onChange={(e) => setData({ ...data, giatrigiam: e.target.value })}
          />

          {/* Giảm tối đa */}
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.giantoida || 0}
            onChange={(e) => setData({ ...data, giantoida: e.target.value })}
          />

          {/* Đơn tối thiểu */}
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={data.dontoithieu || 0}
            onChange={(e) => setData({ ...data, dontoithieu: e.target.value })}
          />

          {/* Áp dụng */}
          <select
            className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
              value={data.ngaybatdau?.split("T")[0] || ""}
              onChange={(e) => setData({ ...data, ngaybatdau: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 w-full rounded"
              value={data.ngayketthuc?.split("T")[0] || ""}
              onChange={(e) =>
                setData({ ...data, ngayketthuc: e.target.value })
              }
            />
          </div>

          {/* Trạng thái */}
          <select
            className="border p-2 w-full rounded"
            value={data.trangthai || "hoạt động"}
            onChange={(e) => setData({ ...data, trangthai: e.target.value })}
          >
            <option value="hoạt động">Hoạt động</option>
            <option value="hết hạn">Hết hạn</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Hủy
            </button>

            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
