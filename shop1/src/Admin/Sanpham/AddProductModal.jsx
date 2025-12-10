import React, { useState, useEffect } from "react";
import {
  createProductWithVariants,
  uploadProductAvatar,
  uploadVariantImage,
  getProductDetail,
} from "./productApi";

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
  if (!open) return null;

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

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async () => {
    if (!data.tensanpham || !data.madanhmuc) {
      alert("Tên sản phẩm và danh mục là bắt buộc!");
      return;
    }

    if (!avatarFile) {
      alert("Vui lòng chọn ảnh đại diện!");
      return;
    }

    try {
      // ============================
      // 1️⃣ TẠO PRODUCT TRƯỚC
      // ============================
      const slug = data.tensanpham
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const bodyVariants = variants.map((v) => ({
        makichthuoc: v.size,
        mamausac: v.color,
        giaban: v.giaban,
        soluongton: v.ton,
      }));

      const newProduct = {
        ...data,
        slug,
        anhdaidien: "", // tạm thời rỗng – lát cập nhật lại
      };

      const res = await createProductWithVariants(newProduct, bodyVariants);

      const masanpham = res.productId; // ⬅ backend trả field này
      if (!masanpham) {
        alert("Không nhận được mã sản phẩm từ server!");
        return;
      }

      // ============================
      // 2️⃣ UPLOAD ẢNH ĐẠI DIỆN
      // ============================
      const formAvatar = new FormData();
      formAvatar.append("masanpham", masanpham);
      formAvatar.append("image", avatarFile);

      const avatarRes = await uploadProductAvatar(masanpham, avatarFile);
      if (!avatarRes.url) {
        alert("Upload ảnh đại diện thất bại!");
        return;
      }

      // ============================
      // ============================
      // 3️⃣ UPLOAD ẢNH BIẾN THỂ (FIXED)
      // ============================

      // Lấy lại chi tiết sản phẩm để có đúng danh sách mabienthe
      const detail = await getProductDetail(masanpham);
      const dsBienThe = detail.bienthe;

      // Tạo map { "size-color": mabienthe }
      const mapBienThe = {};
      dsBienThe.forEach((bt) => {
        const key = `${bt.makichthuoc}-${bt.mamausac}`;
        mapBienThe[key] = bt.mabienthe;
      });

      // Upload ảnh tương ứng từng biến thể
      for (let i = 0; i < variants.length; i++) {
        const key = `${variants[i].size}-${variants[i].color}`;
        const mabienthe = mapBienThe[key];

        if (!mabienthe) {
          console.warn("Không tìm thấy mabienthe cho:", key);
          continue;
        }

        if (variants[i].image1) {
          await uploadVariantImage(mabienthe, variants[i].image1, 1);
        }
        if (variants[i].image2) {
          await uploadVariantImage(mabienthe, variants[i].image2, 2);
        }
      }

      alert("Thêm sản phẩm thành công!");

      // Gọi load() để cập nhật bảng ngoài
      onSuccess();

      // RESET FORM để lần sau mở modal không bị dính data cũ
      setData({
        tensanpham: "",
        madanhmuc: "",
        thuonghieu: "",
        mota: "",
        chatlieu: "",
        kieudang: "",
        baoquan: "",
      });

      // RESET biến thể
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

      // RESET ảnh
      setAvatarFile(null);

      // Đóng modal
      onClose();
    } catch (err) {
      console.error("Lỗi thêm sản phẩm:", err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl p-6 w-[900px] max-h-[90vh] overflow-y-auto text-gray-200">
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
        <div className="grid grid-cols-2 gap-4">
          {/* Tên */}
          <div>
            <label className="text-gray-300 text-sm font-medium">
              Tên sản phẩm *
            </label>
            <input
              className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full text-gray-200"
              value={data.tensanpham}
              onChange={(e) => setData({ ...data, tensanpham: e.target.value })}
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="text-gray-300 text-sm font-medium">
              Danh mục *
            </label>
            <select
              className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full"
              value={data.madanhmuc}
              onChange={(e) => setData({ ...data, madanhmuc: e.target.value })}
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
              <label className="text-gray-300 text-sm font-medium">
                {label}
              </label>
              <input
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* Mô tả */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm font-medium">Mô tả</label>
          <textarea
            className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-full text-gray-200"
            rows={3}
            value={data.mota}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />
        </div>

        {/* Ảnh đại diện */}
        <div className="mt-4">
          <label className="text-gray-300 text-sm font-medium">
            Ảnh đại diện *
          </label>
          <input
            type="file"
            className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg w-60 text-gray-300"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
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

              {/* GIÁ */}
              <input
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-200"
                placeholder="Giá bán"
                value={v.giaban}
                onChange={(e) => updateVariant(idx, "giaban", e.target.value)}
              />

              {/* TỒN */}
              <input
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-200"
                placeholder="Tồn"
                value={v.ton}
                onChange={(e) => updateVariant(idx, "ton", e.target.value)}
              />

              {/* ẢNH 1 */}
              <input
                type="file"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-300"
                onChange={(e) =>
                  updateVariant(idx, "image1", e.target.files[0])
                }
              />

              {/* ẢNH 2 */}
              <input
                type="file"
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-gray-300"
                onChange={(e) =>
                  updateVariant(idx, "image2", e.target.files[0])
                }
              />

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
