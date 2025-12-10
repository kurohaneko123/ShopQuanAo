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
    <div className="text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-white">Quản lý danh mục</h2>

        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition text-white"
        >
          <PlusCircle size={18} /> Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 rounded-xl shadow-xl p-6">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-white/5 text-gray-400 uppercase tracking-wider">
              <th className="p-3 border-b border-white/10 w-[80px] text-center">
                MÃ
              </th>

              <th className="p-3 border-b border-white/10 w-[220px] text-left">
                TÊN DANH MỤC
              </th>

              <th className="p-3 border-b border-white/10 w-[120px] text-center">
                GIỚI TÍNH
              </th>

              <th className="p-3 border-b border-white/10 w-[250px] text-left">
                SLUG
              </th>

              <th className="p-3 border-b border-white/10 w-[150px] text-center">
                NGÀY TẠO
              </th>

              <th className="p-3 border-b border-white/10 w-[120px] text-center">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr
                key={c.madanhmuc}
                className="hover:bg-white/5 transition-colors border-b border-white/5"
              >
                {/* MÃ */}
                <td className="p-3 text-center font-semibold text-gray-300">
                  {c.madanhmuc}
                </td>

                {/* TÊN DANH MỤC */}
                <td className="p-3 text-gray-200 font-medium">
                  {c.tendanhmuc}
                </td>

                {/* GIỚI TÍNH */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.gioitinh === "Nam"
                        ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                        : c.gioitinh === "Nu"
                        ? "bg-pink-600/30 text-pink-300 border border-pink-500/40"
                        : "bg-gray-600/30 text-gray-300 border border-gray-500/40"
                    }`}
                  >
                    {c.gioitinh || "Không"}
                  </span>
                </td>

                {/* SLUG */}
                <td className="p-3 text-gray-400 break-words">{c.slug}</td>

                {/* NGÀY TẠO */}
                <td className="p-3 text-center text-gray-500">
                  {c.ngaytao
                    ? new Date(c.ngaytao.replace(" ", "T")).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex justify-center gap-4">
                    {/* Sửa */}
                    <button
                      onClick={() => openEdit(c)}
                      className="text-yellow-400 hover:text-yellow-300 transition"
                    >
                      <Pencil size={20} />
                    </button>

                    {/* Xóa */}
                    <button
                      onClick={() => handleDelete(c.madanhmuc)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#111] border border-white/10 w-[420px] p-6 rounded-xl shadow-xl relative text-gray-200">
            {/* Close */}
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-white">
              {editMode ? "Sửa danh mục" : "Thêm danh mục"}
            </h3>

            <div className="space-y-4">
              {/* Tên */}
              <input
                type="text"
                placeholder="Tên danh mục"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full text-gray-200 placeholder-gray-500"
                value={form.tendanhmuc}
                onChange={(e) =>
                  setForm({ ...form, tendanhmuc: e.target.value })
                }
              />

              {/* Giới tính */}
              <select
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full text-gray-200"
                value={form.gioitinh}
                onChange={(e) => setForm({ ...form, gioitinh: e.target.value })}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>

              {/* Mô tả */}
              <textarea
                placeholder="Mô tả (Không bắt buộc)"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full min-h-[80px] text-gray-200 placeholder-gray-500"
                value={form.mota}
                onChange={(e) => setForm({ ...form, mota: e.target.value })}
              ></textarea>

              <button
                onClick={save}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg shadow-lg"
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
