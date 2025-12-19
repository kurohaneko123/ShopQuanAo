import React, { useState } from "react";
import { X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig.jsx";
import { API_URL } from "../config/app.js"; //  import API backend
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_header/logo.png";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

export default function AccountModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Biến dành cho quên mật khẩu
  const [resetStep, setResetStep] = useState(1); // 1: nhập email, 2: nhập mã & mật khẩu mới
  const [resetEmail, setResetEmail] = useState("");

  if (!isOpen) return null;

  // ✅ Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const vaitro = user.email === "admin@gmail.com" ? "admin" : "user";

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          vaitro,
        })
      );
      const userId =
        data.nguoidung?.manguoidung ||
        data.nguoidung?.id ||
        data.nguoidung?.email ||
        email;

      localStorage.setItem("activeUserId", String(userId));

      // ✅ tránh dính dữ liệu checkout / form của user cũ
      localStorage.removeItem("checkoutPayload");

      alert("Đăng nhập Google thành công!");
      onClose?.();
      if (vaitro === "admin") window.location.href = "/admin";
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
    const email = e.target.email?.value.trim();
    const password = e.target.password?.value?.trim();
    const name = e.target.hoten?.value?.trim();
    const phone = e.target.sodienthoai?.value?.trim();

    try {
      setLoading(true);

      if (mode === "login") {
        const res = await fetch(`${API_URL}/dangnhap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, matkhau: password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.nguoidung));

        // SweetAlert2 thông báo thành công
        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          confirmButtonText: "OK",
          background: "#f2f2f2",
          color: "#4caf50",
          willClose: () => {
            setTimeout(() => {
              onClose(); // Đảm bảo modal đóng lại sau khi thông báo đã hiển thị
              if (data.nguoidung.vaitro === "admin") {
                window.location.href = "/admin";
              } else {
                window.location.reload();
              }
            }, 300); // Đảm bảo thời gian đủ để thông báo đóng trước khi modal đóng
          },
          customClass: {
            popup: "z-[1000]", // Tăng z-index của thông báo để nó luôn ở trên
          },
        });
      } else if (mode === "register") {
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
        window.location.href = "/login";
        // Thông báo thành công
        Swal.fire({
          title: "Đăng ký thành công!",
          icon: "success",
          confirmButtonText: "OK",
          background: "#f2f2f2",
          color: "#4caf50",
          willClose: () => {
            setTimeout(() => {
              onClose(); // Đảm bảo modal đóng lại sau khi thông báo đã hiển thị
            }, 300); // Đảm bảo thời gian đủ để thông báo đóng trước khi modal đóng
          },
          customClass: {
            popup: "z-[1000]", // Tăng z-index của thông báo để nó luôn ở trên
          },
        });
      }
      // QUÊN MẬT KHẨU (Bước 1 & 2)
      else if (mode === "forgot") {
        if (resetStep === 1) {
          // B1: Gửi email lấy mã
          const res = await fetch(`${API_URL}/quenmatkhau`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Không thể gửi email xác nhận.");

          Swal.fire({
            title: "Đã gửi mã xác nhận đến mail của bạn !",
            icon: "success",
            confirmButtonText: "OK",
            background: "#f2f2f2",
            color: "#4caf50",
            willClose: () => {
              setTimeout(() => {
                onClose(); // Đảm bảo modal đóng lại sau khi thông báo đã hiển thị
                if (data.nguoidung.vaitro === "admin") {
                  window.location.href = "/admin";
                } else {
                  window.location.reload();
                }
              }, 300); // Đảm bảo thời gian đủ để thông báo đóng trước khi modal đóng
            },
            customClass: {
              popup: "z-[1000]", // Tăng z-index của thông báo để nó luôn ở trên
            },
          });
          setResetEmail(email);
          setResetStep(2);
        } else if (resetStep === 2) {
          // B2: Nhập mã & mật khẩu mới
          const token = e.target.token.value.trim();
          const newPassword = e.target.newpassword.value.trim();

          const res = await fetch(`${API_URL}/datlaimatkhau`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: resetEmail,
              resettoken: token,
              matkhaumoi: newPassword,
            }),
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Không thể đặt lại mật khẩu.");

          Swal.fire({
            title: "Đặt lại mật khẩu thành công!",
            icon: "success",
            confirmButtonText: "OK",
            background: "#f2f2f2",
            color: "#4caf50",
            willClose: () => {
              setTimeout(() => {
                onClose(); // Đảm bảo modal đóng lại sau khi thông báo đã hiển thị
                if (data.nguoidung.vaitro === "admin") {
                  window.location.href = "/admin";
                } else {
                  window.location.reload();
                }
              }, 300); // Đảm bảo thời gian đủ để thông báo đóng trước khi modal đóng
            },
            customClass: {
              popup: "z-[1000]", // Tăng z-index của thông báo để nó luôn ở trên
            },
          });
          setMode("login");
          setResetStep(1);
        }
      }
    } catch (err) {
      // Thông báo thất bại
      Swal.fire({
        title: "Lỗi!",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
        background: "#f8d7da",
        color: "#721c24",
      });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[999]"
      aria-hidden="true"
    >
      <div
        className="
        w-[430px] md:w-[480px]
        bg-white/90 backdrop-blur-2xl
        rounded-3xl 
        border border-white/40 shadow-2xl
        p-10 relative
      "
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={Logo}
            className="w-24 md:w-28 drop-shadow-sm opacity-90 hover:scale-105 transition-transform duration-300"
          />
          <p className="text-gray-700 text-[15px] mt-3 font-medium tracking-wide">
            {mode === "login"
              ? "Chào mừng bạn quay trở lại "
              : mode === "register"
              ? "Tạo tài khoản để nhận ưu đãi"
              : resetStep === 1
              ? "Nhập email để nhận mã xác nhận"
              : "Đặt lại mật khẩu"}
          </p>
        </div>

        {/* MXH */}
        {mode !== "forgot" && (
          <>
            <p className="text-center text-sm font-medium text-gray-500 mb-3">
              Đăng nhập bằng mạng xã hội
            </p>

            <div className="flex justify-center gap-4 mb-7">
              <button
                disabled={loading}
                onClick={handleGoogleLogin}
                className="
      flex items-center gap-2 px-4 py-2.5 rounded-xl 
      border border-gray-300 bg-white
      hover:bg-gray-50 transition
      shadow-sm
    "
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>

              <button
                disabled
                className="
      flex items-center gap-2 px-4 py-2.5 rounded-xl 
      border border-gray-200 bg-gray-100 
      opacity-60 cursor-not-allowed shadow-sm
    "
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </>
        )}

        {/* Gạch chia */}
        <div className="relative mb-6">
          <hr className="border-gray-300/60" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400">
            Hoặc
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div className="flex gap-6">
              <input
                name="hoten"
                placeholder="Họ và tên"
                className="
  w-full px-4 py-3.5 text-[15px]
  rounded-xl border border-gray-300 
  bg-white focus:border-blue-500
  focus:ring-2 focus:ring-blue-300 
  transition shadow-sm
"
              />
              <input
                name="sodienthoai"
                placeholder="Số điện thoại"
                className="
  w-full px-4 py-3.5 text-[15px]
  rounded-xl border border-gray-300 
  bg-white focus:border-blue-500
  focus:ring-2 focus:ring-blue-300 
  transition shadow-sm
"
              />
            </div>
          )}

          {mode !== "forgot" && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email của bạn"
                required
                className="w-full px-4 py-3.5 text-[15px]
    rounded-xl border border-gray-300 
    bg-white
    focus:border-blue-500 focus:ring-2 focus:ring-blue-300
    transition shadow-sm"
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                required
                className="w-full px-4 py-3.5 text-[15px]
    rounded-xl border border-gray-300 
    bg-white
    focus:border-blue-500 focus:ring-2 focus:ring-blue-300
    transition shadow-sm"
              />
            </>
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setMode("login")}
              className="text-sm text-blue-600 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
          {mode === "forgot" && resetStep === 1 && (
            <input
              name="email"
              placeholder="Nhập email để đặt lại mật khẩu"
              className="w-full px-4 py-3.5 text-[15px]
    rounded-xl border border-gray-300 
    bg-white
    focus:border-blue-500 focus:ring-2 focus:ring-blue-300
    transition shadow-sm"
              required
            />
          )}

          {mode === "forgot" && resetStep === 2 && (
            <>
              <input
                name="token"
                placeholder="Mã xác nhận"
                className="floating-input"
                required
              />
              <input
                name="newpassword"
                type="password"
                placeholder="Mật khẩu mới"
                className="floating-input"
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 font-semibold text-white rounded-xl
      bg-gradient-to-r from-blue-600 to-blue-500 
      hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60 shadow-lg"
          >
            {loading
              ? "Đang xử lý..."
              : mode === "login"
              ? "Đăng nhập"
              : mode === "register"
              ? "Tạo tài khoản"
              : resetStep === 1
              ? "Gửi mã xác nhận"
              : "Đặt lại mật khẩu"}
          </button>
        </form>

        {/* Link */}
        <div className="flex justify-between mt-5 text-sm text-gray-600 font-medium">
          <button
            onClick={() => setMode("register")}
            className="hover:text-blue-600 transition"
          >
            Tạo tài khoản
          </button>
          <button
            onClick={() => setMode("forgot")}
            className="hover:text-blue-600 transition"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
