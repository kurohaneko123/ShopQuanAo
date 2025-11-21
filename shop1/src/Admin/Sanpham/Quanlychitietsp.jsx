import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader2, Pencil, Trash2, PlusCircle, X } from "lucide-react";

export default function Quanlychitietsp() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const API = `http://localhost:5000/api/sanpham/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API);
        setProduct(res.data.sanpham);
        setVariants(res.data.bienthe);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  // ======================= CLOUDINARY UPLOAD =======================
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // sửa
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  // Upload ảnh vào biến thể
  const handleUploadImage = async (e, variant) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);

    // Cập nhật UI local
    setVariants((prev) =>
      prev.map((v) =>
        v.mabienthe === variant.mabienthe
          ? { ...v, hinhanh: [...v.hinhanh, url] }
          : v
      )
    );
  };

  // Xóa ảnh khỏi biến thể
  const handleDeleteImage = (url, variant) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.mabienthe === variant.mabienthe
          ? { ...v, hinhanh: v.hinhanh.filter((img) => img !== url) }
          : v
      )
    );
  };

  // ------------------------------------------------------------
  // Popup component
  const Popup = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
  // ------------------------------------------------------------

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Chi tiết sản phẩm</h2>

      {/* GRID: Ảnh + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow mb-10">
        {/* Ảnh đại diện */}
        <div className="flex flex-col items-center">
          <img
            src={variants[0]?.hinhanh?.[0]}
            className="w-[350px] h-[350px] object-cover rounded-xl shadow"
          />

          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {variants[0]?.hinhanh?.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 object-cover rounded-lg border shadow-sm hover:scale-110 transition"
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h3 className="text-2xl font-bold">{product.tensanpham}</h3>
          <p className="text-gray-600 mt-2">{product.mota}</p>

          <div className="mt-4 space-y-2">
            <p>
              <b>Thương hiệu:</b> {product.thuonghieu}
            </p>
            <p>
              <b>Chất liệu:</b> {product.chatlieu}
            </p>
            <p>
              <b>Kiểu dáng:</b> {product.kieudang}
            </p>
            <p>
              <b>Bảo quản:</b> {product.baoquan}
            </p>
          </div>
        </div>
      </div>

      {/* BẢNG VARIANTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Biến thể sản phẩm</h3>

          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Thêm biến thể
          </button>
        </div>
        {/* TABLE */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-3">Màu</th>
              <th className="border p-3">Size</th>
              <th className="border p-3">Giá</th>
              <th className="border p-3">Hình ảnh</th>
              <th className="border p-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((v) => (
              <tr key={v.mabienthe} className="hover:bg-gray-50">
                <td className="border p-3">{v.tenmausac}</td>
                <td className="border p-3">{v.tenkichthuoc}</td>
                <td className="border p-3">
                  {Number(v.giaban).toLocaleString()} đ
                </td>

                <td className="border p-3">
                  <div className="flex gap-2 flex-wrap">
                    {v.hinhanh.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          className="w-14 h-14 object-cover rounded-md border shadow-sm hover:scale-110 transition"
                        />

                        {/* nút xoá ảnh */}
                        <button
                          onClick={() => handleDeleteImage(img, v)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* nút upload ảnh */}
                    <label className="w-14 h-14 border rounded-md flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
                      +
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUploadImage(e, v)}
                      />
                    </label>
                  </div>
                </td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedVariant(v);
                      setShowEditPopup(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVariant(v);
                      setShowDeletePopup(true);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== POPUPS ===================== */}

      {/* Popup Sửa */}
      {showEditPopup && (
        <Popup
          title="Chỉnh sửa biến thể"
          onClose={() => setShowEditPopup(false)}
        >
          <p className="text-gray-600 mb-4"></p>
        </Popup>
      )}

      {/* Popup Xoá */}
      {showDeletePopup && (
        <Popup title="Xoá biến thể?" onClose={() => setShowDeletePopup(false)}>
          <p className="mb-5">
            Bạn có chắc muốn xoá biến thể <b>{selectedVariant?.tenmausac}</b> -
            <b> {selectedVariant?.tenkichthuoc}</b> không?
          </p>

          <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition">
            Xoá
          </button>
        </Popup>
      )}

      {/* Popup Thêm */}
      {showAddPopup && (
        <Popup title="Thêm biến thể mới" onClose={() => setShowAddPopup(false)}>
          <p className="text-gray-600 mb-4"></p>
        </Popup>
      )}
    </div>
  );
}
