import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryApi";
import { PlusCircle, X, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../Pagination";
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    tendanhmuc: "",
    gioitinh: "",
    mota: "",
  });

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // đang gõ lại thì xóa lỗi của field đó thôi
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const NO_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9À-ỹ\s]+$/;
  const validate = () => {
    const e = {};

    if (!form.tendanhmuc?.trim())
      e.tendanhmuc = "Tên danh mục không được để trống";

    if (!NO_SPECIAL_CHAR_REGEX.test(form.tendanhmuc)) {
      e.tendanhmuc = "Tên danh mục không được chứa ký tự đặc biệt";
    }
    if (!form.gioitinh) e.gioitinh = "Vui lòng chọn giới tính";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

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
    if (!validate()) return;

    // ===== SWAL LOADING =====
    Swal.fire({
      title: editMode ? "Đang cập nhật danh mục..." : "Đang thêm danh mục...",
      html: "Vui lòng chờ trong giây lát",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      if (editMode) {
        await updateCategory(form.madanhmuc, form);
      } else {
        await createCategory(form);
      }

      setOpen(false);
      setTouched({});
      setErrors({});
      await load();

      // ===== SWAL SUCCESS =====
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: editMode
          ? "Cập nhật danh mục thành công"
          : "Thêm danh mục thành công",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: err?.response?.data?.message || "Không thể lưu danh mục",
      });
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    Swal.fire({
      title: "Đang xóa danh mục...",
      html: "Vui lòng chờ",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await deleteCategory(deleteTarget.id);

      setOpenDelete(false);
      setDeleteTarget(null);
      await load();

      Swal.fire({
        icon: "success",
        title: "Đã xóa",
        text: "Danh mục đã được xóa thành công",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xóa danh mục",
      });
    }
  };
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-white">Quản lý danh mục</h2>

        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition text-white"
        >
          Thêm danh mục
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

              <th className="p-3 border-b border-white/10 w-[100px] text-left">
                TÊN DANH MỤC
              </th>

              <th className="p-3 border-b border-white/10 w-[150px] text-center">
                GIỚI TÍNH
              </th>

              <th className="p-3 border-b border-white/10 w-[170px] text-left">
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
            {paginatedCategories.map((c) => (
              <tr
                key={c.madanhmuc}
                className="hover:bg-white/5 transition-colors border-b border-white/5"
              >
                {/* MÃ */}
                <td className="p-3 text-center font-bold text-gray-300">
                  {c.madanhmuc}
                </td>

                {/* TÊN DANH MỤC */}
                <td className="p-3 text-gray-200 font-bold">{c.tendanhmuc}</td>

                {/* GIỚI TÍNH */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                      onClick={() => {
                        setDeleteTarget({
                          id: c.madanhmuc,
                          name: c.tendanhmuc,
                        });
                        setOpenDelete(true);
                      }}
                    >
                      <Trash2
                        size={20}
                        className="text-red-500 hover:text-red-400 transition"
                      />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[420px] rounded-2xl bg-[#161616] border border-white/10 p-6 relative">
            {/* Nút đóng */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>

            {/* Tiêu đề */}
            <h3 className="text-lg font-bold text-gray-100 mb-5">
              {editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            </h3>

            <div className="space-y-4">
              {/* TÊN DANH MỤC */}
              <div>
                <label className="text-sm text-gray-300">Tên danh mục</label>
                <input
                  type="text"
                  value={form.tendanhmuc}
                  onChange={(e) => setField("tendanhmuc", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, tendanhmuc: true }))}
                  className={`w-full px-3 py-2 rounded-lg
              bg-black/40 text-gray-200
              border ${
                errors.tendanhmuc ? "border-red-500/60" : "border-white/10"
              }
              focus:border-indigo-500 outline-none`}
                />
                {touched.tendanhmuc && errors.tendanhmuc && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.tendanhmuc}
                  </p>
                )}
              </div>

              {/* GIỚI TÍNH */}
              <div>
                <label className="text-sm text-gray-300">Giới tính</label>
                <select
                  value={form.gioitinh}
                  onChange={(e) => setField("gioitinh", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg
              bg-black/40 text-gray-200
              border border-white/10
              focus:border-indigo-500 outline-none`}
                >
                  <option value="">Không phân loại</option>
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nữ</option>
                </select>
              </div>

              {/* MÔ TẢ */}
              <div>
                <label className="text-sm text-gray-300">Mô tả</label>
                <textarea
                  value={form.mota}
                  onChange={(e) => setField("mota", e.target.value)}
                  placeholder="Mô tả ngắn cho danh mục"
                  className="w-full px-3 py-2 rounded-lg
              bg-black/40 text-gray-200
              border border-white/10
              focus:border-indigo-500 outline-none min-h-[80px]"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={save}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition"
              >
                {editMode ? "Lưu thay đổi" : "Thêm danh mục"}
              </button>
            </div>
          </div>
        </div>
      )}
      {openDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[420px] rounded-2xl bg-[#161616] border border-white/10 p-6 relative">
            <button
              onClick={() => {
                setOpenDelete(false);
                setDeleteTarget(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-100 mb-2">
              Xóa danh mục
            </h3>

            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Danh mục{" "}
              <span className="text-gray-200 font-bold">
                {deleteTarget?.name || "này"}
              </span>{" "}
              sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOpenDelete(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-200 py-2 rounded-lg transition border border-white/10"
              >
                Hủy
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
      <Pagination
        totalItems={categories.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
