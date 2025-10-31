import React, { useState } from "react";
import { X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig.jsx";
import { API_URL } from "../config/app.js"; // 💡 import API backend

export default function AccountModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ✅ Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const role = user.email === "admin@gmail.com" ? "admin" : "user";

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          role,
        })
      );

      alert("Đăng nhập Google thành công!");
      onClose?.();
      if (role === "admin") window.location.href = "/admin";
      else window.location.reload();
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gửi request lên API backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password?.value?.trim();
    const name = e.target.hoten?.value?.trim();
    const phone = e.target.sodienthoai?.value?.trim();

    try {
      setLoading(true);

      if (mode === "login") {
        // 🟣 GỌI API ĐĂNG NHẬP
        const res = await fetch(`${API_URL}/dangnhap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, matkhau: password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.nguoidung));

        alert("Đăng nhập thành công!");
        onClose();
        window.location.reload();
      } else if (mode === "register") {
        // 🟢 GỌI API ĐĂNG KÝ
        const res = await fetch(`${API_URL}/dangky`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            matkhau: password,
            hoten: name,
            sodienthoai: phone,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

        alert("Đăng ký thành công! Vui lòng đăng nhập lại.");
        setMode("login");
      } else if (mode === "forgot") {
        // 🟠 GIẢ LẬP GỬI EMAIL RESET
        alert(`Link đặt lại mật khẩu đã gửi tới ${email}`);
        setMode("login");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white w-[420px] md:w-[480px] rounded-2xl shadow-2xl p-8 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-blue-700">COOL</span>
          <span className="bg-blue-700 text-white px-1 rounded">CLUB</span>
        </h2>

        <p className="text-center text-base text-gray-600 mb-5">
          {mode === "login"
            ? "Đăng nhập để nhận ưu đãi thành viên"
            : mode === "register"
            ? "Tạo tài khoản để nhận quà độc quyền"
            : "Nhập email để đặt lại mật khẩu"}
        </p>

        {/* Đăng nhập MXH */}
        {mode !== "forgot" && (
          <>
            <p className="text-center text-sm mb-2 font-medium">
              Đăng nhập bằng mạng xã hội
            </p>
            <div className="flex justify-center gap-3 mb-5">
              <button
                disabled={loading}
                onClick={handleGoogleLogin}
                className="border rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition disabled:opacity-60"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-5 h-5"
                />
                Google
              </button>
              <button
                className="border rounded-md px-4 py-2 flex items-center gap-2 opacity-50 cursor-not-allowed"
                disabled
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="facebook"
                  className="w-5 h-5"
                />
                Facebook
              </button>
            </div>
          </>
        )}

        {/* Gạch ngang */}
        <div className="relative mb-5">
          <hr />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
            Hoặc
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <div className="flex gap-2">
              <input
                name="hoten"
                type="text"
                placeholder="Họ và tên"
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                name="sodienthoai"
                type="text"
                placeholder="Số điện thoại"
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email của bạn"
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {mode !== "forgot" && (
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              required={mode !== "forgot"}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Đang xử lý..."
              : mode === "login"
              ? "ĐĂNG NHẬP"
              : mode === "register"
              ? "TẠO TÀI KHOẢN"
              : "GỬI YÊU CẦU"}
          </button>
        </form>

        {/* Liên kết chuyển chế độ */}
        <div className="flex justify-between text-sm mt-4">
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("register")}
                className="text-blue-600 hover:underline"
              >
                Đăng ký tài khoản mới
              </button>
              <button
                onClick={() => setMode("forgot")}
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu
              </button>
            </>
          )}

          {mode === "register" && (
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 hover:underline"
            >
              Quay lại đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
