"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function ThongTinKhachHang() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/nguoidung/thongtin",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data.nguoidung);
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
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
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 border border-gray-200 text-gray-800">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
          Thông Tin Khách Hàng
        </h2>

        <div className="space-y-6 text-lg">
          <div className="flex items-center gap-3">
            <User className="text-blue-500 w-6 h-6" />
            <p>
              <span className="font-semibold">Mã người dùng:</span> {user.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-blue-500 w-6 h-6" />
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-blue-500 w-6 h-6" />
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {user.sodienthoai || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500 w-6 h-6" />
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {user.diachi || "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-blue-500 w-6 h-6" />
            <p>
              <span className="font-semibold">Vai trò:</span>{" "}
              {user.vaitro === "admin" ? "Quản trị viên" : "Thành viên"}
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => alert("Chức năng cập nhật sắp ra mắt 💖")}
            className="px-10 py-3 text-lg bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
          >
            Cập Nhật Thông Tin
          </button>
        </div>
      </div>
    </section>
  );
}
