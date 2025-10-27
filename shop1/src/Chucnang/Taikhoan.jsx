import React, { useState } from "react";
import { X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig.jsx"; // nếu file bạn là .jsx thì sửa lại cho đúng

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

      // xác định quyền (nếu email là admin thì cho vào /admin)
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

      if (role === "admin") {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white w-[420px] md:w-[480px] rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-2">
          <span className="text-blue-700">COOL</span>
          <span className="bg-blue-700 text-white px-1 rounded">CLUB</span>
        </h2>

        <p className="text-center text-base text-gray-600 mb-5">
          {mode === "login"
            ? "Đăng nhập để nhận ưu đãi thành viên"
            : mode === "register"
            ? "Tạo tài khoản để nhận quà độc quyền"
            : "Nhập email để đặt lại mật khẩu của bạn"}
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

        {/* Form đăng nhập cũ (giữ nguyên logic admin@gmail.com) */}
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1]?.value;

            if (mode === "login") {
              if (email === "admin@gmail.com" && password === "123456") {
                localStorage.setItem(
                  "user",
                  JSON.stringify({ email, role: "admin" })
                );
                alert("Đăng nhập admin thành công!");
                window.location.href = "/admin";
              } else {
                alert("Sai email hoặc mật khẩu!");
              }
            } else if (mode === "register") {
              alert("Đăng ký thành công! Vui lòng đăng nhập lại.");
              setMode("login");
            } else if (mode === "forgot") {
              alert(`Đã gửi liên kết đặt lại mật khẩu đến ${email}`);
              setMode("login");
            }
          }}
        >
          {mode === "register" && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Họ và tên"
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="border rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email của bạn"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Mật khẩu"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {mode === "login"
              ? "ĐĂNG NHẬP"
              : mode === "register"
              ? "TẠO TÀI KHOẢN"
              : "GỬI YÊU CẦU ĐẶT LẠI MẬT KHẨU"}
          </button>
        </form>

        {/* Chuyển chế độ */}
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
