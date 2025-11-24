import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader2, Pencil, Trash2, PlusCircle, X } from "lucide-react";

export default function Quanlychitietsp() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // ADD form
  const [addForm, setAddForm] = useState({
    mamausac: "",
    makichthuoc: "",
    giaban: "",
    soluongton: "",
  });

  // EDIT form
  const [editForm, setEditForm] = useState({
    mamausac: "",
    makichthuoc: "",
    giaban: "",
    soluongton: "",
  });

  const API = `http://localhost:5000/api/sanpham/${id}`;

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const sp = await axios.get(API);
        const mausac = await axios.get("http://localhost:5000/api/mausac");
        const kichthuoc = await axios.get(
          "http://localhost:5000/api/kichthuoc"
        );

        setProduct(sp.data.sanpham);
        setVariants(sp.data.bienthe);

        setColors(mausac.data.data);
        setSizes(kichthuoc.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin mr-2" /> Đang tải...
      </div>
    );

  // ============================================================
  // UPLOAD CLOUDINARY
  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      form
    );

    return res.data.secure_url;
  };

  // Upload ảnh biến thể
  const handleUploadImage = async (e, variant) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);

    setVariants((prev) =>
      prev.map((v) =>
        v.mabienthe === variant.mabienthe
          ? { ...v, hinhanh: [...v.hinhanh, url] }
          : v
      )
    );
  };

  // ============================================================
  // ADD VARIANT
  const handleAddVariant = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/bienthe/them", {
        ...addForm,
        masanpham: id,
      });

      setVariants((prev) => [...prev, res.data.newVariant]);
      setShowAddPopup(false);
    } catch (err) {
      console.log(err);
      alert("Lỗi khi thêm biến thể!");
    }
  };

  // ============================================================
  // EDIT VARIANT
  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/bienthe/sua/${selectedVariant.mabienthe}`,
        editForm
      );

      setVariants((prev) =>
        prev.map((v) =>
          v.mabienthe === selectedVariant.mabienthe ? { ...v, ...editForm } : v
        )
      );

      setShowEditPopup(false);
    } catch (err) {
      console.log(err);
      alert("Sửa thất bại!");
    }
  };

  // ============================================================
  // DELETE VARIANT
  const handleDeleteVariant = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/bienthe/xoa/${selectedVariant.mabienthe}`
      );

      setVariants((prev) =>
        prev.filter((v) => v.mabienthe !== selectedVariant.mabienthe)
      );

      setShowDeletePopup(false);
    } catch (err) {
      alert("Xoá thất bại!");
    }
  };

  // ============================================================
  // POPUP
  const Popup = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );

  // ============================================================

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Chi tiết sản phẩm</h2>

      {/* ===================================== IMAGE + INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl shadow mb-10">
        <div className="flex flex-col items-center">
          <img
            src={variants[0]?.hinhanh?.[0] || ""}
            className="w-[350px] h-[350px] object-cover rounded-xl shadow"
          />

          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {variants[0]?.hinhanh?.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 rounded-lg border shadow-sm object-cover"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold">{product.tensanpham}</h3>
          <p className="text-gray-600 mt-2">{product.mota}</p>
        </div>
      </div>

      {/* ===================================== VARIANT TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Biến thể sản phẩm</h3>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowAddPopup(true)}
          >
            <PlusCircle size={18} /> Thêm biến thể
          </button>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Màu</th>
              <th className="border p-3">Size</th>
              <th className="border p-3">Giá</th>
              <th className="border p-3">Hình</th>
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
                      <div key={i} className="relative">
                        <img
                          src={img}
                          className="w-14 h-14 rounded-md border object-cover"
                        />
                      </div>
                    ))}

                    <label className="w-14 h-14 border rounded-md flex items-center justify-center cursor-pointer">
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
                    className="text-yellow-500 mr-3"
                    onClick={() => {
                      setSelectedVariant(v);

                      const colorFound = colors.find(
                        (c) => c.tenmausac === v.tenmausac
                      );
                      const sizeFound = sizes.find(
                        (s) => s.tenkichthuoc === v.tenkichthuoc
                      );

                      setEditForm({
                        mamausac: colorFound?.mamausac,
                        makichthuoc: sizeFound?.makichthuoc,
                        giaban: v.giaban,
                        soluongton: v.soluongton,
                      });

                      setShowEditPopup(true);
                    }}
                  >
                    <Pencil />
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => {
                      setSelectedVariant(v);
                      setShowDeletePopup(true);
                    }}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================== POPUP ADD */}
      {showAddPopup && (
        <Popup title="Thêm biến thể" onClose={() => setShowAddPopup(false)}>
          <div className="space-y-3">
            <label>Màu</label>
            <select
              className="border p-2 rounded w-full"
              value={addForm.mamausac}
              onChange={(e) =>
                setAddForm({ ...addForm, mamausac: e.target.value })
              }
            >
              {colors.map((m) => (
                <option key={m.mamausac} value={m.mamausac}>
                  {m.tenmausac}
                </option>
              ))}
            </select>

            <label>Kích thước</label>
            <select
              className="border p-2 rounded w-full"
              value={addForm.makichthuoc}
              onChange={(e) =>
                setAddForm({ ...addForm, makichthuoc: e.target.value })
              }
            >
              {sizes.map((s) => (
                <option key={s.makichthuoc} value={s.makichthuoc}>
                  {s.tenkichthuoc}
                </option>
              ))}
            </select>

            <input
              placeholder="Giá bán"
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setAddForm({ ...addForm, giaban: e.target.value })
              }
            />

            <input
              placeholder="Số lượng"
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setAddForm({ ...addForm, soluongton: e.target.value })
              }
            />

            <button
              className="w-full bg-green-600 text-white py-2 rounded"
              onClick={handleAddVariant}
            >
              Thêm
            </button>
          </div>
        </Popup>
      )}

      {/* ===================================== POPUP EDIT */}
      {showEditPopup && (
        <Popup
          title="Chỉnh sửa biến thể"
          onClose={() => setShowEditPopup(false)}
        >
          <div className="space-y-3">
            <label>Màu</label>
            <select
              className="border p-2 rounded w-full"
              value={editForm.mamausac}
              onChange={(e) =>
                setEditForm({ ...editForm, mamausac: e.target.value })
              }
            >
              {colors.map((m) => (
                <option key={m.mamausac} value={m.mamausac}>
                  {m.tenmausac}
                </option>
              ))}
            </select>

            <label>Kích thước</label>
            <select
              className="border p-2 rounded w-full"
              value={editForm.makichthuoc}
              onChange={(e) =>
                setEditForm({ ...editForm, makichthuoc: e.target.value })
              }
            >
              {sizes.map((s) => (
                <option key={s.makichthuoc} value={s.makichthuoc}>
                  {s.tenkichthuoc}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={editForm.giaban}
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setEditForm({ ...editForm, giaban: e.target.value })
              }
            />

            <input
              type="number"
              value={editForm.soluongton}
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setEditForm({ ...editForm, soluongton: e.target.value })
              }
            />

            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleSubmitEdit}
            >
              Lưu thay đổi
            </button>
          </div>
        </Popup>
      )}

      {/* ===================================== POPUP DELETE */}
      {showDeletePopup && (
        <Popup title="Xóa biến thể" onClose={() => setShowDeletePopup(false)}>
          <p className="mb-4">Bạn có chắc muốn xóa biến thể này không?</p>

          <button
            className="w-full bg-red-600 text-white py-2 rounded"
            onClick={handleDeleteVariant}
          >
            Xóa
          </button>
        </Popup>
      )}
    </div>
  );
}
