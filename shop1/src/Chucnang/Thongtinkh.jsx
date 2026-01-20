"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ThongTinKhachHang() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    hoTen: "",
    soDienThoai: "",
    diaChi: "",
  });
  const navigate = useNavigate();

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put("http://localhost:5000/api/nguoidung/capnhat", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Validate số điện thoại VN
      const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
      if (!phoneRegex.test(form.soDienThoai)) {
        Swal.fire("Lỗi", "Số điện thoại không hợp lệ ", "error");
        return;
      }
      const diaChiRegex = /^[a-zA-ZÀ-ỹ0-9\s,./-]+$/;
      if (!diaChiRegex.test(form.diaChi)) {
        Swal.fire(
          "Lỗi",
          "Địa chỉ chỉ được chứa chữ, số và các ký tự , . / -",
          "error",
        );
        return;
      }
      const updatedUser = {
        ...user,
        hoten: form.hoTen,
        sodienthoai: form.soDienThoai,
        diachi: form.diaChi,
      };

      // Lưu lại FE để dùng khi reload
      setUser(updatedUser);
      localStorage.setItem("userinfo", JSON.stringify(updatedUser));

      Swal.fire("Thành công!", "Cập nhật thông tin thành công!", "success");
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi cập nhật thông tin.", "error");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // hoặc navigate("/login") nếu anh có trang login riêng
          return;
        }

        // 1) Gọi API /thongtin để lấy ID từ token
        const res = await axios.get(
          "http://localhost:5000/api/nguoidung/thongtin",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const tokenUser = res.data.nguoidung; // id, email, vaitro

        // 2) Gọi API /danhsach để lấy danh sách đầy đủ từ DB
        const list = await axios.get(
          "http://localhost:5000/api/nguoidung/danhsach",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // 3) Lấy user đầy đủ theo ID
        const fullUser = list.data.nguoidung.find(
          (u) => u.manguoidung === tokenUser.id,
        );

        // 4) SET USER HOÀN CHỈNH TỪ DB
        setUser(fullUser);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin:", err);
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Đang tải thông tin...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium py-10">{error}</div>
    );

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      {/* MODAL CẬP NHẬT THÔNG TIN */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[450px]">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Cập Nhật Thông Tin
            </h3>

            <div className="space-y-4">
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Họ tên"
                value={form.hoTen}
                onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              />
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Số điện thoại"
                value={form.soDienThoai}
                onChange={(e) =>
                  setForm({ ...form, soDienThoai: e.target.value })
                }
              />
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Địa chỉ"
                value={form.diaChi}
                onChange={(e) => {
                  const raw = e.target.value;

                  // Chỉ cho phép chữ (có dấu), số, space và , . / -
                  const cleaned = raw
                    .replace(/[^a-zA-ZÀ-ỹ0-9\s,./-]/g, "")
                    .replace(/\s{2,}/g, " ");

                  setForm({ ...form, diaChi: cleaned });
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowEdit(false)}
              >
                Hủy
              </button>

              <button
                className="bg-[rgb(96,148,216)] hover:bg-[rgb(72,128,204)]
"
                onClick={handleUpdate}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 border border-gray-200 text-gray-800">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
          Thông Tin Khách Hàng
        </h2>

        <div className="space-y-6 text-lg">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[rgb(60,110,190)]" />

            <p>
              <span className="font-semibold">Họ tên:</span>{" "}
              {user.hoten || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-[rgb(60,110,190)]" />
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-[rgb(60,110,190)]" />
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {user.sodienthoai || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[rgb(60,110,190)]" />
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {user.diachi || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[rgb(60,110,190)]" />
            <p>
              <span className="font-semibold">Vai trò:</span>{" "}
              {user.vaitro === "admin" ? "Quản trị viên" : "Thành viên"}
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              setForm({
                hoTen: user.hoten || "",
                soDienThoai: user.sodienthoai || "",
                diaChi: user.diachi || "",
              });
              setShowEdit(true);
            }}
            className="
  px-10 py-3 text-lg
  bg-[rgb(96,148,216)] text-white
  font-semibold rounded-full
  hover:bg-[rgb(72,128,204)]
  transition shadow-lg
"
          >
            Cập Nhật Thông Tin
          </button>
        </div>
      </div>
    </section>
  );
}
