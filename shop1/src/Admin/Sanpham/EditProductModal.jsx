import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateProduct, uploadProductAvatar } from "./productApi";

export default function EditProductModal({
  open,
  onClose,
  product,
  categories,
  onSuccess,
}) {
  const [form, setForm] = useState(product || {});
  const [saving, setSaving] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null); // ảnh mới
  const [preview, setPreview] = useState(""); // preview ảnh

  useEffect(() => {
    setForm(product || {});
    setPreview(product?.anhdaidien || "");
    setNewAvatar(null); // reset ảnh mới
  }, [product]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setPreview(URL.createObjectURL(file)); // hiển thị preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tensanpham || !form.madanhmuc) {
      return alert("Tên sản phẩm và danh mục là bắt buộc!");
    }

    try {
      setSaving(true);

      // ✔ BƯỚC 1: Gửi dữ liệu sửa sản phẩm trước
      await updateProduct(product.masanpham, {
        tensanpham: form.tensanpham,
        madanhmuc: form.madanhmuc,
        thuonghieu: form.thuonghieu,
        mota: form.mota,
        chatlieu: form.chatlieu,
        kieudang: form.kieudang,
        baoquan: form.baoquan,

        // ⭐ GIỮ ẢNH CŨ NẾU KHÔNG ĐỔI
        anhdaidien: product.anhdaidien,
      });

      // ✔ BƯỚC 2: Nếu có chọn avatar mới → upload
      if (newAvatar) {
        const uploadRes = await uploadProductAvatar(
          product.masanpham,
          newAvatar
        );

        console.log("Upload avatar result:", uploadRes);
      }

      alert("Cập nhật sản phẩm thành công!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật sản phẩm!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">Sửa sản phẩm</h3>
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* ================================================================== */}
          {/* FORM INPUT */}
          {/* ================================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tên sản phẩm *</label>
              <input
                name="tensanpham"
                value={form.tensanpham || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Danh mục *</label>
              <select
                name="madanhmuc"
                value={form.madanhmuc || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.madanhmuc} value={c.madanhmuc}>
                    {c.tendanhmuc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Thương hiệu</label>
              <input
                name="thuonghieu"
                value={form.thuonghieu || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Chất liệu</label>
              <input
                name="chatlieu"
                value={form.chatlieu || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kiểu dáng</label>
              <input
                name="kieudang"
                value={form.kieudang || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Bảo quản</label>
              <input
                name="baoquan"
                value={form.baoquan || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg mt-1"
              />
            </div>
          </div>

          {/* MÔ TẢ */}
          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              name="mota"
              value={form.mota || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1 min-h-[80px]"
            />
          </div>

          {/* ================================================================== */}
          {/*  ẢNH ĐẠI DIỆN  */}
          {/* ================================================================== */}
          <div className="mt-4">
            <label className="text-sm font-medium">
              Ảnh đại diện (có thể đổi)
            </label>

            <div className="flex items-center gap-4 mt-2">
              {/* ẢNH HIỆN TẠI */}
              <img
                src={preview || null}
                className="w-24 h-24 rounded-lg object-cover border bg-gray-100"
                alt="avatar"
              />

              {/* INPUT CHỌN ẢNH MỚI */}
              <input
                type="file"
                className="border p-2 rounded"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
