import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateProduct, uploadProductAvatar } from "./productApi";
import Swal from "sweetalert2";
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
  const [editForm, setEditForm] = useState({
    tensanpham: "",
    madanhmuc: "",
  });

  const [editErrors, setEditErrors] = useState({});
  useEffect(() => {
    if (product) {
      setForm(product);
      setPreview(product?.anhdaidien || "");
      setNewAvatar(null);

      setEditForm({
        tensanpham: product.tensanpham || "",
        madanhmuc: product.madanhmuc || "",
      });

      setEditErrors({});
    }
  }, [product]);

  if (!open || !product) return null;
  const NO_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9À-ỹ\s]+$/;
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (editForm.hasOwnProperty(name)) {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setPreview(URL.createObjectURL(file)); // hiển thị preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tensanpham?.trim()) {
      e.tensanpham = "Tên sản phẩm không được trống";
    } else if (!NO_SPECIAL_CHAR_REGEX.test(form.tensanpham)) {
      e.tensanpham = "Tên sản phẩm không được chứa ký tự đặc biệt";
    }
    if (!form.madanhmuc) e.madanhmuc = "Danh mục không được trống";

    if (!form.thuonghieu?.trim()) {
      e.thuonghieu = "Thương hiệu không được trống";
    } else if (!NO_SPECIAL_CHAR_REGEX.test(form.thuonghieu)) {
      e.thuonghieu = "Thương hiệu không được chứa ký tự đặc biệt";
    }

    if (!form.giaban) e.giaban = "Giá không được trống";

    const errors = {};

    if (!editForm.tensanpham.trim()) {
      errors.tensanpham = "Tên sản phẩm không được để trống";
    }

    if (!editForm.madanhmuc) {
      errors.madanhmuc = "Vui lòng chọn danh mục";
    }

    setEditErrors(errors);

    if (Object.keys(errors).length > 0) return;
    if (!editForm.soluongton) e.soluongton = "Số lượng không được trống";
    setEditErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      setSaving(true);

      await updateProduct(product.masanpham, {
        tensanpham: form.tensanpham,
        madanhmuc: form.madanhmuc,
        thuonghieu: form.thuonghieu,
        mota: form.mota,
        chatlieu: form.chatlieu,
        kieudang: form.kieudang,
        baoquan: form.baoquan,
      });

      if (newAvatar) {
        await uploadProductAvatar(product.masanpham, newAvatar);
      }

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật sản phẩm thành công!",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi cập nhật sản phẩm!",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl text-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Sửa sản phẩm</h3>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-gray-300"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* INPUT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên */}
            <div>
              <label className="text-sm text-gray-300 font-bold">
                Tên sản phẩm *
              </label>
              <input
                name="tensanpham"
                value={form.tensanpham || ""}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-lg mt-1 text-gray-200"
              />
              {editErrors.tensanpham && (
                <p className="text-red-400 text-xs mt-1">
                  {editErrors.tensanpham}
                </p>
              )}
            </div>

            {/* Danh mục */}
            <div>
              <label className="text-sm text-gray-300 font-bold">
                Danh mục *
              </label>
              <select
                name="madanhmuc"
                value={form.madanhmuc || ""}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-lg mt-1 text-gray-200"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.madanhmuc} value={c.madanhmuc}>
                    {c.tendanhmuc}
                  </option>
                ))}
              </select>
              {editErrors.madanhmuc && (
                <p className="text-red-400 text-xs mt-1">
                  {editErrors.madanhmuc}
                </p>
              )}
            </div>

            {/* 4 input còn lại */}
            {[
              ["Thương hiệu", "thuonghieu"],
              ["Chất liệu", "chatlieu"],
              ["Kiểu dáng", "kieudang"],
              ["Bảo quản", "baoquan"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-sm text-gray-300 font-bold">
                  {label}
                </label>
                <input
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-lg mt-1 text-gray-200"
                />
              </div>
            ))}
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm text-gray-300 font-bold">Mô tả</label>
            <textarea
              name="mota"
              value={form.mota || ""}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-lg mt-1 min-h-[90px] text-gray-200"
            />
          </div>

          {/* Ảnh đại diện */}
          <div>
            <label className="text-sm text-gray-300 font-bold">
              Ảnh đại diện
            </label>

            <div className="flex items-center gap-4 mt-3">
              {preview ? (
                <img
                  src={preview}
                  className="w-24 h-24 rounded-lg object-cover border border-white/10 bg-[#222]"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center text-xs text-gray-500 border border-white/10 rounded-lg">
                  No Image
                </div>
              )}

              <input
                type="file"
                className="bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-lg text-gray-300"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 shadow-lg"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
