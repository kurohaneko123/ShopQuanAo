import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader2, Pencil, Trash2, PlusCircle, X } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../Pagination";
export default function Quanlychitietsp() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // EDIT form
  const [editForm, setEditForm] = useState({
    mamausac: "",
    makichthuoc: "",
    giaban: "",
    soluongton: "",
  });
  // Chỉ cho số (giá, số lượng)
  const NUMBER_ONLY_REGEX = /^[0-9]+$/;
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
  // EDIT VARIANT
  const handleSubmitEdit = async () => {
    const e = {};
    if (!editForm.giaban) e.giaban = "Giá không được trống";
    if (!editForm.soluongton) e.soluongton = "Số lượng không được trống";

    setEditErrors(e);
    if (Object.keys(e).length > 0) return;

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
      setEditErrors({});
      Swal.fire({
        title: "Thành công!",
        text: "Chỉnh sửa biến thể thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: "Sửa thất bại!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
      Swal.fire({
        title: "Thành công!",
        text: "Xóa biến thể thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: "Xóa thất bại!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // ============================================================
  // POPUP
  const Popup = ({ title, children, onClose }) => (
    <div
      className="fixed inset-0 z-50 
    bg-black/60 backdrop-blur-sm 
    flex items-center justify-center"
    >
      <div
        className="w-[420px] rounded-2xl 
      bg-[#161616] border border-white/10 
      p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 
        text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-gray-100 mb-5">{title}</h3>

        {children}
      </div>
    </div>
  );

  // ============================================================
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedVariants = variants.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Chi tiết sản phẩm</h2>

      {/* ===================================== IMAGE + INFO */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 
  p-8 mb-10 rounded-2xl
  bg-[#161616] border border-white/5"
      >
        {/* IMAGE */}
        <div className="flex flex-col items-center">
          {/* ẢNH CHÍNH */}
          <img
            src={variants[0]?.hinhanh?.[0] || ""}
            className="w-[320px] h-[320px] 
      rounded-xl object-cover 
      bg-black/40"
            alt=""
          />

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {variants[0]?.hinhanh?.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-16 h-16 rounded-lg 
          border border-white/10 
          object-cover hover:scale-105 transition"
                alt=""
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-100">
            {product.tensanpham}
          </h3>

          <p className="text-gray-400 mt-3 leading-relaxed">{product.mota}</p>
        </div>
      </div>

      {/* ===================================== VARIANT TABLE */}
      <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-100">
            Biến thể sản phẩm
          </h3>     
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white/5 text-gray-400">
              <th className="bg-white/5 text-gray-400">Màu</th>
              <th className="bg-white/5 text-gray-400">Size</th>
              <th className="bg-white/5 text-gray-400">Giá</th>
              <th className="bg-white/5 text-gray-400">Hình</th>
              <th className="bg-white/5 text-gray-400">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedVariants.map((v) => (
              <tr key={v.mabienthe} className="bg-white/5 text-gray-400">
                <td className="px-4 py-3 text-gray-200 text-center">
                  {v.tenmausac}
                </td>
                <td className="px-4 py-3 text-gray-200 text-center">
                  {v.tenkichthuoc}
                </td>
                <td className="px-4 py-3 text-gray-200 text-center">
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
      <Pagination
        totalItems={variants.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* ===================================== POPUP EDIT */}
      {showEditPopup && (
        <Popup
          title="Chỉnh sửa biến thể"
          onClose={() => setShowEditPopup(false)}
        >
          <div className="space-y-3">
            <label>Màu</label>
            <select
              className={`w-full px-3 py-2 rounded-lg
  bg-black/40 text-gray-200
  border border-white/10
  focus:border-indigo-500 outline-none`}
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
              className={`w-full px-3 py-2 rounded-lg
  bg-black/40 text-gray-200
  border border-white/10
  focus:border-indigo-500 outline-none`}
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
              className={`w-full px-3 py-2 rounded-lg
  bg-black/40 text-gray-200
  border ${editErrors.giaban ? "border-red-500/60" : "border-white/10"}
  focus:border-indigo-500 outline-none`}
              onChange={(e) =>
                setEditForm({ ...editForm, giaban: e.target.value })
              }
            />

            <input
              type="number"
              value={editForm.soluongton}
              className={`w-full px-3 py-2 rounded-lg
  bg-black/40 text-gray-200
  border ${editErrors.soluongton ? "border-red-500/60" : "border-white/10"}
  focus:border-indigo-500 outline-none`}
              onChange={(e) =>
                setEditForm({ ...editForm, soluongton: e.target.value })
              }
            />

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500
  text-white py-2 rounded-lg transition"
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
          <p className="text-gray-600 mb-4 text-sm">
            Biến thể này sẽ bị xoá vĩnh viễn và không thể khôi phục.
          </p>

          <button
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg"
            onClick={handleDeleteVariant}
          >
            Xác nhận xoá
          </button>
        </Popup>
      )}
    </div>
  );
}
