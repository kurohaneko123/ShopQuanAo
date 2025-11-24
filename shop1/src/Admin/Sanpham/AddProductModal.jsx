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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Thêm sản phẩm</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* FORM SẢN PHẨM */}
        <div className="grid grid-cols-2 gap-4">
          {/* TÊN */}
          <div>
            <label className="font-medium text-sm">Tên sản phẩm *</label>
            <input
              className="border p-2 rounded w-full"
              value={data.tensanpham}
              onChange={(e) => setData({ ...data, tensanpham: e.target.value })}
            />
          </div>

          {/* DANH MỤC */}
          <div>
            <label className="font-medium text-sm">Danh mục *</label>
            <select
              className="border p-2 rounded w-full"
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

          {/* THƯƠNG HIỆU */}
          <div>
            <label className="font-medium text-sm">Thương hiệu</label>
            <input
              className="border p-2 rounded w-full"
              value={data.thuonghieu}
              onChange={(e) => setData({ ...data, thuonghieu: e.target.value })}
            />
          </div>

          {/* CHẤT LIỆU */}
          <div>
            <label className="font-medium text-sm">Chất liệu</label>
            <input
              className="border p-2 rounded w-full"
              value={data.chatlieu}
              onChange={(e) => setData({ ...data, chatlieu: e.target.value })}
            />
          </div>

          {/* KIỂU DÁNG */}
          <div>
            <label className="font-medium text-sm">Kiểu dáng</label>
            <input
              className="border p-2 rounded w-full"
              value={data.kieudang}
              onChange={(e) => setData({ ...data, kieudang: e.target.value })}
            />
          </div>

          {/* BẢO QUẢN */}
          <div>
            <label className="font-medium text-sm">Bảo quản</label>
            <input
              className="border p-2 rounded w-full"
              value={data.baoquan}
              onChange={(e) => setData({ ...data, baoquan: e.target.value })}
            />
          </div>
        </div>

        {/* MÔ TẢ */}
        <div className="mt-4">
          <label className="font-medium text-sm">Mô tả</label>
          <textarea
            className="border p-2 rounded w-full"
            rows={3}
            value={data.mota}
            onChange={(e) => setData({ ...data, mota: e.target.value })}
          />
        </div>

        {/* ẢNH ĐẠI DIỆN */}
        <div className="mt-4">
          <label className="font-medium text-sm">Ảnh đại diện *</label>
          <input
            type="file"
            className="border p-2 rounded w-40"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>

        {/* BIẾN THỂ */}
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Biến thể sản phẩm</h3>
            <button className="text-blue-600" onClick={addVariant}>
              + Thêm biến thể
            </button>
          </div>

          {variants.map((v, idx) => (
            <div
              key={idx}
              className="grid grid-cols-7 gap-3 p-3 bg-white rounded-lg mb-4 border"
            >
              {/* SIZE */}
              <select
                className="border p-2 rounded"
                value={v.size}
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
              >
                <option value="">-- Chọn size --</option>
                {sizes.map((s) => (
                  <option key={s.makichthuoc} value={s.makichthuoc}>
                    {s.tenkichthuoc}
                  </option>
                ))}
              </select>

              {/* MÀU */}
              <select
                className="border p-2 rounded"
                value={v.color}
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
              >
                <option value="">-- Chọn màu --</option>
                {colors.map((c) => (
                  <option key={c.mamausac} value={c.mamausac}>
                    {c.tenmausac}
                  </option>
                ))}
              </select>

              {/* GIÁ */}
              <input
                className="border p-2 rounded"
                placeholder="Giá bán"
                value={v.giaban}
                onChange={(e) => updateVariant(idx, "giaban", e.target.value)}
              />

              {/* TỒN */}
              <input
                className="border p-2 rounded"
                placeholder="Tồn"
                value={v.ton}
                onChange={(e) => updateVariant(idx, "ton", e.target.value)}
              />

              {/* Ảnh 1 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Ảnh 1</label>
                <input
                  type="file"
                  className="border p-2 rounded w-40"
                  onChange={(e) =>
                    updateVariant(idx, "image1", e.target.files[0])
                  }
                />
              </div>

              {/* Ảnh 2 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Ảnh 2</label>
                <input
                  type="file"
                  className="border p-2 rounded w-40"
                  onChange={(e) =>
                    updateVariant(idx, "image2", e.target.files[0])
                  }
                />
              </div>

              {/* XOÁ */}
              <button
                className="text-red-600"
                onClick={() => removeVariant(idx)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
