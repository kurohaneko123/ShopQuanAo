import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader2, Search, Eye } from "lucide-react";

export default function Quanlysp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // =====================================================
  // 🟢 LẤY SẢN PHẨM + DANH MỤC
  // =====================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPro, resCate] = await Promise.all([
          axios.get(API_PRODUCT),
          axios.get(API_CATEGORY),
        ]);
        setProducts(resPro.data.data || []);
        setFilteredProducts(resPro.data.data || []); // ✅ Gán ban đầu cho list hiển thị
        setCategories(resCate.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
        alert("Không thể lấy dữ liệu sản phẩm / danh mục!");
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
      </div>
    </div>
  );
}
