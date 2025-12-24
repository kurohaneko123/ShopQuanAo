import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Loader2, X } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../Pagination";
export default function QuanLyNguoiDungAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // popup state
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    hoten: "",
    sodienthoai: "",
    diachi: "",
    email: "",
    vaitro: "",
    trangthai: "",
  });

  const API = "http://localhost:5000/api/nguoidung/danhsach";
  const handleToggleStatus = async (user, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/nguoidung/admin/sua/${user.manguoidung}`,
        { ...user, trangthai: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.manguoidung === user.manguoidung ? { ...u, trangthai: status } : u
        )
      );
      if (selectedUser?.manguoidung === user.manguoidung) {
        setSelectedUser((prev) => ({ ...prev, trangthai: status }));
        setForm((prev) => ({ ...prev, trangthai: status }));
      }
    } catch (err) {
      console.error("Lỗi đổi trạng thái:", err);
      alert("Không đổi được trạng thái!");
    }
  };
  const NO_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9À-ỹ\s]+$/;

  const validateEdit = () => {
    const e = {};

    if (!form.hoten?.trim()) e.hoten = "Vui lòng nhập họ tên";
    if (!NO_SPECIAL_CHAR_REGEX.test(form.hoten)) {
      e.hoten = "Họ tên không được chứa ký tự đặc biệt";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!form.email?.trim()) e.email = "Vui lòng nhập email";
    if (form.email && !emailRegex.test(form.email)) {
      e.email = "Email không hợp lệ";
    }

    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!form.sodienthoai?.trim())
      e.sodienthoai = "Vui lòng nhập số điện thoại";
    else if (!phoneRegex.test(form.sodienthoai))
      e.sodienthoai = "Số điện thoại không hợp lệ";
    if (!NO_SPECIAL_CHAR_REGEX.test(form.sodienthoai)) {
      e.sodienthoai = "Số điện thoại không được chứa ký tự đặc biệt";
    }

    if (!form.diachi?.trim()) e.diachi = "Vui lòng nhập địa chỉ";

    if (!form.vaitro) e.vaitro = "Chọn vai trò";

    if (!form.trangthai) e.trangthai = "Chọn trạng thái";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ====== LẤY DANH SÁCH USER ========
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.nguoidung);
      } catch (err) {
        console.error("Lỗi lấy danh sách:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ====== MỞ POPUP SỬA ========
  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({
      hoten: user.hoten || "",
      sodienthoai: user.sodienthoai || "",
      diachi: user.diachi || "",
      email: user.email || "",
      vaitro: user.vaitro || "",
      trangthai: user.trangthai || "",
    });
    setShowEdit(true);
  };

  // ====== API UPDATE ADMIN ========
  const handleSave = async () => {
    if (!validateEdit()) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/nguoidung/admin/sua/${selectedUser.manguoidung}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Thành công", "Cập nhật người dùng thành công", "success");
      setShowEdit(false);

      setUsers((prev) =>
        prev.map((u) =>
          u.manguoidung === selectedUser.manguoidung ? { ...u, ...form } : u
        )
      );
    } catch (err) {
      Swal.fire("Lỗi", "Cập nhật thất bại", "error");
    }
  };
  useEffect(() => {
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    if (users.length === 0) setPage(1);
  }, [users.length]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-white">Quản Lý Người Dùng</h2>

      {/* TABLE */}
      <div className="bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-white/5 text-gray-400 uppercase tracking-wide">
              <th className="p-3 w-[70px] text-center">ID</th>
              <th className="p-3 w-[200px] text-left">Email</th>
              <th className="p-3 w-[160px] text-left">Họ tên</th>
              <th className="p-3 w-[130px] text-left">Số điện thoại</th>
              <th className="p-3 w-[180px] text-left">Địa chỉ</th>
              <th className="p-3 w-[100px] text-center">Vai trò</th>
              <th className="p-3 w-[110px] text-center">Trạng thái</th>
              <th className="p-3 w-[120px] text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr
                key={u.manguoidung}
                className="hover:bg-white/5 border-b border-white/5 transition"
              >
                <td className="p-3 text-center text-gray-300 font-semibold">
                  {u.manguoidung}
                </td>

                <td className="p-3">{u.email}</td>
                <td className="p-3 text-gray-300">{u.hoten || "—"}</td>
                <td className="p-3 text-gray-300">{u.sodienthoai || "—"}</td>
                <td className="p-3 text-gray-400">{u.diachi || "—"}</td>

                {/* Vai trò */}
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      u.vaitro === "admin"
                        ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
                        : "bg-blue-600/30 text-blue-300 border-blue-500/40"
                    }`}
                  >
                    {u.vaitro}
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      u.trangthai === "hoạt động"
                        ? "bg-green-600/30 text-green-300 border-green-500/40"
                        : "bg-red-600/30 text-red-300 border-red-500/40"
                    }`}
                  >
                    {u.trangthai}
                  </span>
                </td>

                {/* Button */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEdit(u)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white flex items-center gap-1 mx-auto shadow"
                  >
                    <Pencil size={16} /> Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={users.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ======== MODAL EDIT ======== */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#111] w-[440px] p-6 rounded-xl border border-white/10 shadow-2xl text-gray-200 relative">
            {/* Close */}
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowEdit(false)}
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-bold mb-4">Sửa người dùng</h3>

            <div className="space-y-3">
              <div>
                <input
                  className={`bg-[#1a1a1a] border w-full p-2 rounded-lg text-gray-200
      ${errors.hoten ? "border-red-500" : "border-white/10"}
    `}
                  value={form.hoten || ""}
                  onChange={(e) => {
                    setForm({ ...form, hoten: e.target.value });
                    setErrors((p) => ({ ...p, hoten: "" }));
                  }}
                  placeholder="Họ tên"
                />
                {errors.hoten && (
                  <p className="text-red-500 text-xs mt-1">{errors.hoten}</p>
                )}
              </div>
              <div>
                <input
                  className={`bg-[#1a1a1a] border w-full p-2 rounded-lg text-gray-200
      ${errors.sodienthoai ? "border-red-500" : "border-white/10"}
    `}
                  value={form.sodienthoai || ""}
                  onChange={(e) => {
                    setForm({ ...form, sodienthoai: e.target.value });
                    setErrors((p) => ({ ...p, sodienthoai: "" }));
                  }}
                  placeholder="Số điện thoại"
                />
                {errors.sodienthoai && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sodienthoai}
                  </p>
                )}
              </div>
              <div>
                <input
                  className={`bg-[#1a1a1a] border w-full p-2 rounded-lg text-gray-200
      ${errors.diachi ? "border-red-500" : "border-white/10"}
    `}
                  value={form.diachi || ""}
                  onChange={(e) => {
                    setForm({ ...form, diachi: e.target.value });
                    setErrors((p) => ({ ...p, diachi: "" }));
                  }}
                  placeholder="Địa chỉ (bắt buộc)"
                />
                {errors.diachi && (
                  <p className="text-red-500 text-xs mt-1">{errors.diachi}</p>
                )}
              </div>
              <div>
                <input
                  className={`bg-[#1a1a1a] border w-full p-2 rounded-lg text-gray-200
      ${errors.email ? "border-red-500" : "border-white/10"}
    `}
                  value={form.email || ""}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Vai trò */}
              <select
                className="bg-[#1a1a1a] border border-white/10 w-full p-2 rounded-lg"
                value={form.vaitro}
                onChange={(e) => setForm({ ...form, vaitro: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>

              {/* Trạng thái */}
              <select
                className="bg-[#1a1a1a] border border-white/10 w-full p-2 rounded-lg"
                value={form.trangthai}
                onChange={(e) =>
                  setForm({ ...form, trangthai: e.target.value })
                }
              >
                <option value="hoạt động">Hoạt động</option>
                <option value="bị khóa">Bị khóa</option>
              </select>
            </div>
            <button
              onClick={() =>
                handleToggleStatus(
                  selectedUser,
                  selectedUser.trangthai === "hoạt động"
                    ? "bị khóa"
                    : "hoạt động"
                )
              }
              className={`px-3 py-1 rounded-lg text-white ${
                selectedUser.trangthai === "hoạt động"
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {selectedUser.trangthai === "hoạt động" ? "Khóa" : "Mở"}
            </button>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 rounded-lg"
                onClick={() => setShowEdit(false)}
              >
                Hủy
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow"
                onClick={handleSave}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
