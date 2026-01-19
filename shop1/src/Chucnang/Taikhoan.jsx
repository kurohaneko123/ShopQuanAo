import React, { useState } from "react";
import { X } from "lucide-react";
import { API_URL } from "../config/app.js"; //  import API backend
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_header/logo.png";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

export default function AccountModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Biến dành cho quên mật khẩu
  const [resetStep, setResetStep] = useState(1); // 1: nhập email, 2: nhập mã & mật khẩu mới
  const [resetEmail, setResetEmail] = useState("");

  if (!isOpen) return null;

  // Gửi request lên API backend
  const handleSubmit = async (e) => {
    if (mode === "forgot" && resetStep === 2 && !resetEmail) {
      throw new Error("Email không hợp lệ, vui lòng gửi lại mã.");
    }
    e.preventDefault();

    const email = e.target.email?.value?.trim() || "";
    const password = e.target.password?.value?.trim() || "";
    const name = e.target.hoten?.value?.trim() || "";
    const phone = e.target.sodienthoai?.value?.trim() || "";

    try {
      setLoading(true);

      // =========================
      // 1) REGISTER
      // =========================
      if (mode === "register") {
        // validate đúng nghiệp vụ em
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!name || name.length < 2) {
          Swal.fire("Lỗi!", "Họ tên phải có ít nhất 2 ký tự", "error");
          return;
        }
        if (!nameRegex.test(name)) {
          Swal.fire(
            "Lỗi!",
            "Họ tên chỉ được chứa chữ cái, không được có số hoặc ký tự đặc biệt",
            "error",
          );
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
          Swal.fire("Lỗi!", "Chỉ cho phép đăng ký bằng gmail.com", "error");
          return;
        }

        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
          Swal.fire("Lỗi!", "Số điện thoại không hợp lệ", "error");
          return;
        }

        if (!password || password.length < 8) {
          Swal.fire("Lỗi!", "Mật khẩu phải có ít nhất 8 ký tự", "error");
          return;
        }
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLetter || !hasNumber) {
          Swal.fire("Lỗi!", "Mật khẩu phải chứa cả chữ và số", "error");
          return;
        }

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

        Swal.fire({
          title: "Đăng ký thành công!",
          icon: "success",
          confirmButtonText: "OK",
          willClose: () => {
            setTimeout(() => {
              onClose();
              setMode("login");
            }, 200);
          },
          customClass: { popup: "z-[1000]" },
        });

        return;
      }

      // =========================
      // 2) LOGIN
      // =========================
      if (mode === "login") {
        const res = await fetch(`${API_URL}/dangnhap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, matkhau: password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

        localStorage.setItem("token", data.token);
        // thống nhất key "userinfo" cho dễ dùng (nếu project em đang dùng userinfo)
        localStorage.setItem("userinfo", JSON.stringify(data.nguoidung));

        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          confirmButtonText: "OK",
          willClose: () => {
            setTimeout(() => {
              onClose();
              if (data.nguoidung?.vaitro === "admin") {
                navigate("/admin", { replace: true });
              } else {
                navigate("/", { replace: true });
              }
            }, 200);
          },
          customClass: { popup: "z-[1000]" },
        });

        return;
      }

      // =========================
      // 3) FORGOT PASSWORD
      // =========================
      if (mode === "forgot") {
        // B1: gửi mã
        if (resetStep === 1) {
          const res = await fetch(`${API_URL}/quenmatkhau`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Không thể gửi email xác nhận.");

          Swal.fire({
            title: "Đã gửi mã xác nhận đến mail của bạn!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: { popup: "z-[1000]" },
          });

          setResetEmail(email);
          setResetStep(2);
          return;
        }

        // B2: đặt lại mật khẩu
        if (resetStep === 2) {
          if (!resetToken || !newPassword) {
            throw new Error(
              "Vui lòng nhập đầy đủ mã xác nhận và mật khẩu mới.",
            );
          }

          const res = await fetch(`${API_URL}/datlaimatkhau`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: resetEmail,
              resettoken: resetToken,
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
            willClose: () => {
              setMode("login");
              setResetStep(1);
            },
            customClass: { popup: "z-[1000]" },
          });

          return;
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: err.message || "Có lỗi xảy ra",
        icon: "error",
        confirmButtonText: "OK",
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
                value={resetEmail}
                readOnly
                className="w-full px-4 py-3.5 rounded-xl border bg-gray-100 text-gray-600"
              />

              <input
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Mã xác nhận"
                required
                className="w-full px-4 py-3.5 rounded-xl border bg-gray-100 text-gray-600"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                required
                className="w-full px-4 py-3.5 rounded-xl border bg-gray-100 text-gray-600"
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
    document.body,
  );
}
