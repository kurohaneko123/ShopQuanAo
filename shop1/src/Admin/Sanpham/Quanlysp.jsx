import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader2, Search, Eye } from "lucide-react";

export default function Quanlysp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [editColor, setEditColor] = useState(null);
  const emptyColor = { tenmausac: "", mota: "", hexcode: "" };
  const [colorForm, setColorForm] = useState(emptyColor);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editSize, setEditSize] = useState(null);
  const emptySize = { tenkichthuoc: "", mota: "" };
  const [sizeForm, setSizeForm] = useState(emptySize);

  const [searchTerm, setSearchTerm] = useState(""); // 🟢 Từ khóa tìm kiếm
  const [filteredProducts, setFilteredProducts] = useState([]); // 🟢 Danh sách sau khi lọc

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    tensanpham: "",
    madanhmuc: "",
    thuonghieu: "",
    mota: "",
    chatlieu: "",
    kieudang: "",
    baoquan: "",
    hinhanh: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  const API_PRODUCT = "http://localhost:5000/api/sanpham";
  const API_CATEGORY = "http://localhost:5000/api/danhmuc";
  const API_COLOR = "http://localhost:5000/api/mausac";
  const API_SIZE = "http://localhost:5000/api/kichthuoc";

  // =====================================================
  // 🟢 LẤY SẢN PHẨM + DANH MỤC
  // =====================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPro, resCate, resColors, resSizes] = await Promise.all([
          axios.get(API_PRODUCT),
          axios.get(API_CATEGORY),
          axios.get(API_COLOR),
          axios.get(API_SIZE),
        ]);

        setProducts(resPro.data.data || []);
        setFilteredProducts(resPro.data.data || []);
        setCategories(resCate.data.data || []);
        setColors(resColors.data.data || []);
        setSizes(resSizes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        alert("Không thể lấy dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =====================================================
  // 🟡 XỬ LÝ TÌM KIẾM (lọc theo tên sản phẩm)
  // =====================================================
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    const filtered = products.filter(
      (p) =>
        p.tensanpham.toLowerCase().includes(lowerSearch) ||
        p.thuonghieu?.toLowerCase().includes(lowerSearch)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // =====================================================
  // 🟠 Thêm / Sửa / Xóa (local)
  // =====================================================
  const handleAddProduct = () => {
    if (!newProduct.tensanpham || !newProduct.madanhmuc)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    const fakeItem = {
      ...newProduct,
      masanpham: Date.now(),
      madanhmuc: Number(newProduct.madanhmuc),
    };
    const updatedList = [...products, fakeItem];
    setProducts(updatedList);
    setFilteredProducts(updatedList);
    setShowAddModal(false);
    setNewProduct({
      tensanpham: "",
      madanhmuc: "",
      thuonghieu: "",
      mota: "",
      chatlieu: "",
      kieudang: "",
      baoquan: "",
      hinhanh: "",
    });
  };
  const handleEditProduct = () => {
    const updatedList = products.map((p) =>
      p.masanpham === editProduct.masanpham ? editProduct : p
    );
    setProducts(updatedList);
    setFilteredProducts(updatedList);
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    const updatedList = products.filter((p) => p.masanpham !== id);
    setProducts(updatedList);
    setFilteredProducts(updatedList);
  };
  const handleSubmitColor = async () => {
    try {
      if (editColor) {
        // Sửa màu
        await axios.put(`${API_COLOR}/sua/${editColor.mamausac}`, colorForm);
      } else {
        // Thêm màu
        await axios.post(`${API_COLOR}/them`, colorForm);
      }

      // Reload data
      const res = await axios.get(API_COLOR);
      setColors(res.data.data);

      setShowColorModal(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu màu sắc");
    }
  };

  const handleDeleteColor = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa màu này không?")) return;

    try {
      await axios.delete(`${API_COLOR}/xoa/${id}`);
      setColors(colors.filter((c) => c.mamausac !== id));
    } catch (err) {
      console.error(err);
      alert("Không thể xóa màu!");
    }
  };
  const handleSubmitSize = async () => {
    try {
      if (editSize) {
        // Sửa kích thước
        await axios.put(`${API_SIZE}/sua/${editSize.makichthuoc}`, sizeForm);
      } else {
        // Thêm kích thước
        await axios.post(`${API_SIZE}/them`, sizeForm);
      }

      // Load lại dữ liệu
      const res = await axios.get(API_SIZE);
      setSizes(res.data.data);

      setShowSizeModal(false);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu kích thước!");
    }
  };
  const handleDeleteSize = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa kích thước này?")) return;

    try {
      await axios.delete(`${API_SIZE}/xoa/${id}`);
      setSizes(sizes.filter((s) => s.makichthuoc !== id));
    } catch (error) {
      console.error(error);
      alert("Không thể xoá kích thước!");
    }
  };

  // =====================================================
  // 🟣 Tên danh mục
  // =====================================================
  const getCategoryName = (id) => {
    const cate = categories.find((c) => c.madanhmuc === id);
    return cate ? cate.tendanhmuc : "Không có";
  };

  // =====================================================
  // 🟣 GIAO DIỆN
  // =====================================================
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>

        {/* 🔍 Thanh tìm kiếm */}
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-cyan-100 text-gray-700">
              <th className="p-3 border">Ảnh</th>
              <th className="p-3 border">Tên sản phẩm</th>
              <th className="p-3 border">Thương hiệu</th>
              <th className="p-3 border">Chất liệu</th>
              <th className="p-3 border">Kiểu dáng</th>
              <th className="p-3 border">Danh mục</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.masanpham} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">
                    <div className="w-16 h-16 border rounded-md overflow-hidden mx-auto bg-gray-100">
                      <img
                        src={
                          p.anhdaidien && p.anhdaidien.trim() !== ""
                            ? p.anhdaidien
                            : "https://via.placeholder.com/100x100.png?text=No+Image"
                        }
                        alt={p.tensanpham}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-2 border">{p.tensanpham}</td>
                  <td className="p-2 border">{p.thuonghieu}</td>
                  <td className="p-2 border">{p.chatlieu}</td>
                  <td className="p-2 border">{p.kieudang}</td>
                  <td className="p-2 border">{getCategoryName(p.madanhmuc)}</td>
                  <td className="p-2 border text-center flex items-center gap-3 justify-center">
                    {/* Xem chi tiết */}
                    <button
                      onClick={() =>
                        (window.location.href = `/admin/products/${p.masanpham}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Sửa */}
                    <button
                      onClick={() => {
                        setEditProduct(p);
                        setShowEditModal(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Sửa"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Xóa */}
                    <button
                      onClick={() => handleDelete(p.masanpham)}
                      className="text-red-500 hover:text-red-600"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Danh sách màu sắc</h3>

            <button
              onClick={() => {
                setEditColor(null);
                setColorForm(emptyColor);
                setShowColorModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle size={18} /> Thêm màu
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {colors.map((c) => (
              <div
                key={c.mamausac}
                className="border rounded-lg p-3 flex items-center justify-between"
              >
                {/* Ô màu + tên */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: c.hexcode }}
                  ></div>

                  <span className="font-medium">{c.tenmausac}</span>
                </div>

                {/* Sửa / Xóa */}
                <div className="flex items-center gap-2">
                  <button
                    className="text-yellow-500 hover:text-yellow-600"
                    onClick={() => {
                      setEditColor(c);
                      setColorForm(c);
                      setShowColorModal(true);
                    }}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteColor(c.mamausac)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showColorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {editColor ? "Sửa màu sắc" : "Thêm màu sắc"}
              </h3>

              <div className="space-y-4">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Tên màu sắc"
                  value={colorForm.tenmausac}
                  onChange={(e) =>
                    setColorForm({ ...colorForm, tenmausac: e.target.value })
                  }
                />

                <input
                  className="w-full border p-2 rounded"
                  placeholder="Mã HEX (#FFFFFF)"
                  value={colorForm.hexcode}
                  onChange={(e) =>
                    setColorForm({ ...colorForm, hexcode: e.target.value })
                  }
                />

                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Mô tả"
                  value={colorForm.mota}
                  onChange={(e) =>
                    setColorForm({ ...colorForm, mota: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowColorModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Huỷ
                </button>

                <button
                  onClick={handleSubmitColor}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editColor ? "Lưu thay đổi" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Danh sách kích thước</h3>

            <button
              onClick={() => {
                setEditSize(null);
                setSizeForm(emptySize);
                setShowSizeModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle size={18} /> Thêm kích thước
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {sizes.map((s) => (
              <div
                key={s.makichthuoc}
                className="flex items-center gap-3 border px-4 py-2 rounded-lg bg-gray-50"
              >
                {/* Tên size */}
                <span className="font-medium">{s.tenkichthuoc}</span>

                {/* Nút sửa + xoá */}
                <button
                  className="text-yellow-600 hover:text-yellow-700"
                  onClick={() => {
                    setEditSize(s);
                    setSizeForm(s);
                    setShowSizeModal(true);
                  }}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteSize(s.makichthuoc)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {showSizeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {editSize ? "Sửa kích thước" : "Thêm kích thước"}
              </h3>

              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Tên kích thước (VD: S, M, L...)"
                  value={sizeForm.tenkichthuoc}
                  onChange={(e) =>
                    setSizeForm({ ...sizeForm, tenkichthuoc: e.target.value })
                  }
                />

                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Mô tả size (tuỳ chọn)"
                  value={sizeForm.mota}
                  onChange={(e) =>
                    setSizeForm({ ...sizeForm, mota: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Huỷ
                </button>

                <button
                  onClick={handleSubmitSize}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editSize ? "Lưu thay đổi" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
