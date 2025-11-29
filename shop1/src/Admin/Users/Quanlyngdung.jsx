import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Loader2 } from "lucide-react";

export default function QuanLyNguoiDungAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // popup state
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    hoten: "",
    sodienthoai: "",
    diachi: "",
    email: "",
    vaitro: "",
    trangthai: "",
  });

  const API = "http://localhost:5000/api/nguoidung/danhsach";

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
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/nguoidung/admin/sua/${selectedUser.manguoidung}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Cập nhật thành công!");
      setShowEdit(false);

      // FE tự cập nhật UI – KHÔNG reload
      setUsers((prev) =>
        prev.map((u) =>
          u.manguoidung === selectedUser.manguoidung ? { ...u, ...form } : u
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
      alert("Cập nhật thất bại!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản Lý Người Dùng (Admin)</h2>

      {/* TABLE */}
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">ID</th>
            <th className="p-3">Email</th>
            <th className="p-3">Họ tên</th>
            <th className="p-3">Số điện thoại</th>
            <th className="p-3">Địa chỉ</th>
            <th className="p-3">Vai trò</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.manguoidung} className="border-b">
              <td className="p-3">{u.manguoidung}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.hoten || "Chưa có"}</td>
              <td className="p-3">{u.sodienthoai || "Chưa có"}</td> {/* SĐT */}
              <td className="p-3">{u.diachi || "Chưa có"}</td>{" "}
              {/* 🆕 Địa chỉ */}
              <td className="p-3">{u.vaitro}</td>
              <td className="p-3">{u.trangthai}</td>
              <td className="p-3">
                <button
                  onClick={() => openEdit(u)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-1"
                >
                  <Pencil size={16} /> Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* -------- POPUP EDIT USER ---------- */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-[450px] p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Sửa Thông Tin Người Dùng</h3>

            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                value={form.hoten}
                onChange={(e) => setForm({ ...form, hoten: e.target.value })}
                placeholder="Họ tên"
              />
              <input
                className="w-full p-2 border rounded"
                value={form.sodienthoai}
                onChange={(e) =>
                  setForm({ ...form, sodienthoai: e.target.value })
                }
                placeholder="Số điện thoại"
              />
              <input
                className="w-full p-2 border rounded"
                value={form.diachi}
                onChange={(e) => setForm({ ...form, diachi: e.target.value })}
                placeholder="Địa chỉ"
              />
              <input
                className="w-full p-2 border rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />

              <select
                className="w-full p-2 border rounded"
                value={form.vaitro}
                onChange={(e) => setForm({ ...form, vaitro: e.target.value })}
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={form.trangthai}
                onChange={(e) =>
                  setForm({ ...form, trangthai: e.target.value })
                }
              >
                <option value="hoạt động">Hoạt động</option>
                <option value="bị khóa">Bị khóa</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEdit(false)}
              >
                Hủy
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
