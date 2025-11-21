import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, User, Shield, Mail } from "lucide-react";

export default function Quanlyuser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API lấy thông tin cá nhân
  const API = "http://localhost:5000/api/nguoidung/thongtin";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.nguoidung);
      } catch (err) {
        console.error("Lỗi khi lấy người dùng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin mr-2" /> Đang tải thông tin...
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin người dùng</h2>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow">
            <User size={32} className="text-white" />
          </div>

          <div>
            <h3 className="text-xl font-semibold">Mã người dùng: #{user.id}</h3>
            <p className="text-gray-500">Thông tin tài khoản</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 mb-4">
          <Mail size={20} className="text-blue-600" />
          <p>
            <b>Email:</b> {user.email}
          </p>
        </div>

        {/* Vai trò */}
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-green-600" />
          <p>
            <b>Vai trò:</b>{" "}
            <span
              className={`px-3 py-1 rounded-lg text-white ${
                user.vaitro === "admin" ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {user.vaitro}
            </span>
          </p>
        </div>

        {/* Thời gian token */}
        <p className="text-gray-600 mt-4">
          <b>Token tạo lúc:</b>{" "}
          {new Date(user.iat * 1000).toLocaleString("vi-VN")}
        </p>
        <p className="text-gray-600">
          <b>Token hết hạn:</b>{" "}
          {new Date(user.exp * 1000).toLocaleString("vi-VN")}
        </p>
      </div>
    </div>
  );
}
