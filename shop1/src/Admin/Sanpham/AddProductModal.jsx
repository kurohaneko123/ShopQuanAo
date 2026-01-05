import React, { useState, useEffect } from "react";
import {
  createProductWithVariants,
  uploadProductAvatar,
  uploadVariantImage,
  getProductDetail,
  getAllProducts,
} from "./productApi";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export default function AddProductModal({
  open,
  onClose,
  data,
  setData,
  categories,
  colors,
  sizes,
  onSuccess,
}) {
  // ================================
  // STATE SẢN PHẨM
  // ================================
  const [avatarFile, setAvatarFile] = useState(null);

  // ================================
  // STATE BIẾN THỂ
  // ================================
  const [variants, setVariants] = useState([
    {
      size: "",
      color: "",
      giaban: "",
      ton: "",
      image1: null,
      image2: null,
    },
  ]);
  //  ================================
  const [errors, setErrors] = useState({});
  const [productNames, setProductNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasDuplicateVariants = () => {
    const set = new Set();

    for (const v of variants) {
      if (!v.size || !v.color) continue;
      const key = `${v.size}-${v.color}`;
      if (set.has(key)) return true;
      set.add(key);
    }
    return false;
  };

  useEffect(() => {
    if (!open) return;

    const fetchProductNames = async () => {
      try {
        const res = await getAllProducts();

        const list = Array.isArray(res?.data?.data) ? res.data.data : [];

        const names = list.map((p) =>
          p.tensanpham
            ?.trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        );

        setProductNames(names);
      } catch (err) {
        console.error("Lỗi lấy danh sách sản phẩm:", err);
        setProductNames([]);
      }
    };

    fetchProductNames();
  }, [open]);
  // ================================
  // THÊM BIẾN THỂ
  // ================================
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        giaban: "",
        ton: "",
        image1: null,
        image2: null,
      },
    ]);
  };

  // ================================
  // UPDATE BIẾN THỂ
  // ================================
  const updateVariant = (index, field, value) => {
    const newList = [...variants];
    newList[index][field] = value;
    setVariants(newList);
  };

  // ================================
  // XOÁ BIẾN THỂ
  // ================================
  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };
  // chỉ tiếng viiet và số
  const NO_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9À-ỹ\s]+$/;
  // ================================
  const validate = () => {
    const e = {};

    const rawName = data.tensanpham?.trim();

    const normalizedName = rawName
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!rawName) {
      e.tensanpham = "Vui lòng nhập tên sản phẩm";
    } else if (!NO_SPECIAL_CHAR_REGEX.test(rawName)) {
      e.tensanpham = "Tên sản phẩm không được chứa ký tự đặc biệt";
    }
    // } else if (productNames.includes(normalizedName)) {
    //   e.tensanpham = "Tên sản phẩm đã tồn tại";
    // }

    if (!data.madanhmuc) e.madanhmuc = "Vui lòng chọn danh mục";

    if (!data.thuonghieu?.trim()) {
      e.thuonghieu = "Vui lòng nhập thương hiệu";
    } else if (!NO_SPECIAL_CHAR_REGEX.test(data.thuonghieu)) {
      e.thuonghieu = "Thương hiệu không được chứa ký tự đặc biệt";
    }

    if (!avatarFile) e.anhdaidien = "Vui lòng chọn ảnh đại diện";

    variants.forEach((v, i) => {
      if (!v.size) e[`size_${i}`] = "Chọn size";
      if (!v.color) e[`color_${i}`] = "Chọn màu";
      if (!v.giaban || Number(v.giaban) <= 0)
        e[`giaban_${i}`] = "Giá bán phải > 0";
      if (!v.ton || Number(v.ton) <= 0) e[`ton_${i}`] = "Số lượng phải > 0";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async () => {
    if (!validate()) return;
    if (hasDuplicateVariants()) {
      Swal.fire({
        title: "Lỗi!",
        text: "Có biến thể trùng lặp về size và màu sắc!",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "Đang thêm sản phẩm...",
      html: "Vui lòng chờ trong giây lát",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // 1) Tạo slug
      const slug = data.tensanpham
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // 2) Map biến thể
      const bodyVariants = variants.map((v) => ({
        makichthuoc: v.size,
        mamausac: v.color,
        giaban: v.giaban,
        soluongton: v.ton,
      }));

      // 3) Tạo product trước
      const newProduct = { ...data, slug, anhdaidien: "" };
      const res = await createProductWithVariants(newProduct, bodyVariants);

      // IMPORTANT: coi lại backend trả gì
      const masanpham =
        res?.productId || res?.data?.productId || res?.data?.masanpham;
      if (!masanpham) throw new Error("Backend không trả productId/masanpham");

      // 4) Upload avatar
      const avatarRes = await uploadProductAvatar(masanpham, avatarFile);
      if (!avatarRes?.url) throw new Error("Upload ảnh đại diện thất bại");

      // 5) Upload ảnh biến thể
      const detail = await getProductDetail(masanpham);
      const dsBienThe = detail?.bienthe || [];

      const mapBienThe = {};
      dsBienThe.forEach((bt) => {
        const key = `${bt.makichthuoc}-${bt.mamausac}`;
        mapBienThe[key] = bt.mabienthe;
      });

      for (let i = 0; i < variants.length; i++) {
        const key = `${variants[i].size}-${variants[i].color}`;
        const mabienthe = mapBienThe[key];
        if (!mabienthe) continue;

        if (variants[i].image1)
          await uploadVariantImage(mabienthe, variants[i].image1, 1);
        if (variants[i].image2)
          await uploadVariantImage(mabienthe, variants[i].image2, 2);
      }

      // 6) Thành công
      Swal.close();
      Swal.fire({
        title: "Thành công!",
        text: "Thêm sản phẩm thành công!",
        icon: "success",
      });

      onSuccess();

      setData({
        tensanpham: "",
        madanhmuc: "",
        thuonghieu: "",
        mota: "",
        chatlieu: "",
        kieudang: "",
        baoquan: "",
      });

      setVariants([
        {
          size: "",
          color: "",
          giaban: "",
          ton: "",
          image1: null,
          image2: null,
        },
      ]);
      setAvatarFile(null);
      onClose();
    } catch (err) {
      console.error("Lỗi thêm sản phẩm:", err);
      Swal.close();

      // axios chỉ có message chung
      const rawMessage = err?.response?.data?.message || err?.message || "";

      // // TRÙNG SẢN PHẨM (slug)
      // if (
      //   rawMessage.toLowerCase().includes("tồn tại") ||
      //   rawMessage.toLowerCase().includes("duplicate") ||
      //   err?.response?.status === 500 // quan trọng
      // ) {
      //   setErrors((prev) => ({
      //     ...prev,
      //     tensanpham: "Tên sản phẩm đã tồn tại",
      //   }));

      //   // focus lại input
      //   setTimeout(() => {
      //     document.getElementById("tensanpham-input")?.focus();
      //   }, 100);

      //   return; // không cho rớt xuống swal
      // }

      // //lỗi khác mới show swal
      Swal.fire({
        title: "Lỗi!",
        text: "Thêm sản phẩm thất bại!",
        icon: "error",
      });
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-[#111] border border-white/10 rounded-xl shadow-2xl
                p-4 sm:p-6
                w-[95vw] max-w-[900px]
                max-h-[90vh] overflow-y-auto text-gray-200"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Thêm sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✖
          </button>
        </div>
        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên */}
          <div>
            <label className="text-gray-300 text-sm font-bold">
              Tên sản phẩm *
            </label>
            <input
              id="tensanpham-input"
              className={`bg-[#1a1a1a] border p-2 rounded-lg w-full
    ${errors.tensanpham ? "border-red-500" : "border-white/10"}
  `}
              value={data.tensanpham}
              onChange={(e) => {
                setData({ ...data, tensanpham: e.target.value });
                setErrors((p) => ({ ...p, tensanpham: "" }));
              }}
            />

            {errors.tensanpham && (
              <p className="text-red-500 text-xs mt-1">{errors.tensanpham}</p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="text-gray-300 text-sm font-bold">
              Danh mục *
            </label>
            <select
              className={`bg-[#1a1a1a] border p-2 rounded-lg w-full
    ${errors.madanhmuc ? "border-red-500" : "border-white/10"}
  `}
              value={data.madanhmuc}
              onChange={(e) => {
                setData({ ...data, madanhmuc: e.target.value });
                setErrors((p) => ({ ...p, madanhmuc: "" }));
              }}
            >
              <option value="">-- Chọn --</option>
              {categories.map((c) => (
                <option key={c.madanhmuc} value={c.madanhmuc}>
                  {c.tendanhmuc}
                </option>
              ))}
            </select>
          </div>

          {/* Thương hiệu – Chất liệu – Kiểu dáng – Bảo quản */}
          {[
            ["Thương hiệu", "thuonghieu"],
            ["Chất liệu", "chatlieu"],
            ["Kiểu dáng", "kieudang"],
            ["Bảo quản", "baoquan"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="text-gray-300 text-sm font-bold">{label}</label>
              <input
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
              />
              {errors[key] && (
                <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Mô tả */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm font-bold">Mô tả</label>
          <textarea
            className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full text-gray-200"
            rows={3}
            value={data.mota}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />
        </div>

        {/* Ảnh đại diện */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm font-bold">
            Ảnh đại diện *
          </label>

          <input
            type="file"
            className={`bg-[#1a1a1a] border p-2 rounded-lg w-60 text-gray-300
      ${errors.anhdaidien ? "border-red-500" : "border-white/10"}
    `}
            onChange={(e) => {
              setAvatarFile(e.target.files?.[0] || null);
              setErrors((p) => ({ ...p, anhdaidien: "" }));
            }}
          />

          {errors.anhdaidien && (
            <p className="text-red-500 text-xs mt-1">{errors.anhdaidien}</p>
          )}
        </div>

        {/* BIẾN THỂ */}
        <div className="mt-6 border border-white/10 rounded-lg p-4 bg-[#1a1a1a] shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-100">Biến thể sản phẩm</h3>
            <button
              onClick={addVariant}
              className="text-indigo-400 hover:text-indigo-300"
            >
              + Thêm biến thể
            </button>
          </div>

          {variants.map((v, idx) => (
            <div
              key={idx}
              className="grid grid-cols-7 gap-3 p-3 bg-[#111] border border-white/10 rounded-lg mb-4"
            >
              {/* SIZE */}
              <select
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-200"
                value={v.size}
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
              >
                <option value="">-- Size --</option>
                {sizes.map((s) => (
                  <option key={s.makichthuoc} value={s.makichthuoc}>
                    {s.tenkichthuoc}
                  </option>
                ))}
              </select>
              {errors[`size_${idx}`] && (
                <p className="text-red-500 text-xs">{errors[`size_${idx}`]}</p>
              )}

              {/* MÀU */}
              <select
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-200"
                value={v.color}
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
              >
                <option value="">-- Màu --</option>
                {colors.map((c) => (
                  <option key={c.mamausac} value={c.mamausac}>
                    {c.tenmausac}
                  </option>
                ))}
              </select>
              {errors[`color_${idx}`] && (
                <p className="text-red-500 text-xs">{errors[`color_${idx}`]}</p>
              )}

              {/* GIÁ */}
              <input
                className={`bg-[#1a1a1a] border p-2 rounded-lg
    ${errors[`giaban_${idx}`] ? "border-red-500" : "border-white/10"}
  `}
                value={v.giaban}
                onChange={(e) => {
                  updateVariant(idx, "giaban", e.target.value);
                  setErrors((p) => ({ ...p, [`giaban_${idx}`]: "" }));
                }}
              />

              {errors[`giaban_${idx}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`giaban_${idx}`]}
                </p>
              )}

              {/* TỒN */}
              <input
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-200"
                placeholder="Tồn"
                value={v.ton}
                onChange={(e) => updateVariant(idx, "ton", e.target.value)}
              />
              {errors[`ton_${idx}`] && (
                <p className="text-red-500 text-xs">{errors[`ton_${idx}`]}</p>
              )}

              {/* ẢNH 1 */}
              <input
                type="file"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-300"
                onChange={(e) =>
                  updateVariant(idx, "image1", e.target.files[0])
                }
              />
              {errors[`vimg_${idx}`] && (
                <p className="text-red-500 text-xs">{errors[`vimg_${idx}`]}</p>
              )}

              {/* ẢNH 2 */}
              <input
                type="file"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-300"
                onChange={(e) =>
                  updateVariant(idx, "image2", e.target.files[0])
                }
              />
              {errors[`vimg_${idx}`] && (
                <p className="text-red-500 text-xs">{errors[`vimg_${idx}`]}</p>
              )}

              {/* XOÁ */}
              <button
                className="text-red-500 hover:text-red-400"
                onClick={() => removeVariant(idx)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg"
            onClick={handleSubmit}
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
