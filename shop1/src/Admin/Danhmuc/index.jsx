import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryApi";
import { PlusCircle, X, Pencil, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    tendanhmuc: "",
    gioitinh: "",
    mota: "",
  });

  const load = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditMode(false);
    setForm({ tendanhmuc: "", gioitinh: "", mota: "" });
    setOpen(true);
  };

  const openEdit = (cate) => {
    setEditMode(true);
    setForm(cate);
    setOpen(true);
  };

  const save = async () => {
    if (!form.tendanhmuc) return alert("Tên danh mục không được để trống!");

    try {
      if (editMode) {
        await updateCategory(form.madanhmuc, form);
      } else {
        await createCategory(form);
      }
      setOpen(false);
      load();
    } catch (err) {
      alert("Lỗi khi lưu danh mục!");
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    await deleteCategory(id);
    load();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>

        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 border">Mã</th>
              <th className="p-3 border">Tên danh mục</th>
              <th className="p-3 border">Giới tính</th>
              <th className="p-3 border">Slug</th>
              <th className="p-3 border">Ngày tạo</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c, index) => (
              <tr
                key={c.madanhmuc}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 border text-center font-semibold">
                  {c.madanhmuc}
                </td>

                <td className="p-3 border">{c.tendanhmuc}</td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      c.gioitinh === "Nam"
                        ? "bg-blue-500"
                        : c.gioitinh === "Nu"
                        ? "bg-pink-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {c.gioitinh || "Không"}
                  </span>
                </td>

                <td className="p-3 border text-gray-600">{c.slug}</td>

                <td className="p-3 border text-gray-500">
                  {c.ngaytao
                    ? new Date(c.ngaytao.replace(" ", "T")).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </td>

                <td className="p-3 border text-center flex justify-center gap-3">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(c.madanhmuc)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] p-6 rounded-xl shadow-lg relative">
            <button
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editMode ? "Sửa danh mục" : "Thêm danh mục"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên danh mục"
                className="border p-2 rounded w-full"
                value={form.tendanhmuc}
                onChange={(e) =>
                  setForm({ ...form, tendanhmuc: e.target.value })
                }
              />

              <select
                className="border p-2 rounded w-full"
                value={form.gioitinh}
                onChange={(e) => setForm({ ...form, gioitinh: e.target.value })}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>

              <textarea
                placeholder="Mô tả (Không bắt buộc)"
                className="border p-2 rounded w-full min-h-[80px]"
                value={form.mota}
                onChange={(e) => setForm({ ...form, mota: e.target.value })}
              ></textarea>

              <button
                onClick={save}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Lưu danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
