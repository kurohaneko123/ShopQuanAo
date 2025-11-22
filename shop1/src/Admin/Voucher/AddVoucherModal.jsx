export default function AddVoucherModal({
  open,
  onClose,
  data,
  setData,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[440px] rounded-xl shadow-xl p-6">
        <h3 className="text-lg font-bold mb-4">Thêm voucher</h3>

        <div className="space-y-3">
          {/* Mã voucher hệ thống */}
          <input
            placeholder="Mã voucher (hệ thống)"
            className="border p-2 w-full rounded bg-gray-100"
            value={data.mavoucher || ""}
            disabled
          />

          {/* Mã giảm giá */}
          <input
            placeholder="Mã giảm giá"
            className="border p-2 w-full rounded"
            value={data.magiamgia || ""}
            onChange={(e) => setData({ ...data, magiamgia: e.target.value })}
          />

          {/* Mô tả */}
          <textarea
            placeholder="Mô tả"
            className="border p-2 w-full rounded h-20"
            value={data.mota || ""}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />

          {/* Loại khuyến mãi */}
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
            placeholder="Giá trị giảm"
            type="number"
            className="border p-2 w-full rounded"
            value={data.giatrigiam || ""}
            onChange={(e) => setData({ ...data, giatrigiam: e.target.value })}
          />

          {/* Giảm tối đa */}
          <input
            placeholder="Giảm tối đa (đ)"
            type="number"
            className="border p-2 w-full rounded"
            value={data.giantoida || ""}
            onChange={(e) => setData({ ...data, giantoida: e.target.value })}
          />

          {/* Đơn tối thiểu */}
          <input
            placeholder="Đơn tối thiểu (đ)"
            type="number"
            className="border p-2 w-full rounded"
            value={data.dontoithieu || ""}
            onChange={(e) => setData({ ...data, dontoithieu: e.target.value })}
          />

          {/* Ngày áp dụng */}
          <div className="flex gap-2">
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={data.ngaybatdau || ""}
              onChange={(e) => setData({ ...data, ngaybatdau: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={data.ngayketthuc || ""}
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

          {/* Nút */}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Hủy
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
