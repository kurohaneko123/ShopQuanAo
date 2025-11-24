// Sanpham/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";

import { getAllProducts, deleteProduct } from "./productApi";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ProductTable from "./ProductTable";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const API_CATEGORY = "http://localhost:5000/api/danhmuc";

  // Load sản phẩm + danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productList, cateRes] = await Promise.all([
          getAllProducts(),
          fetch(API_CATEGORY).then((r) => r.json()),
        ]);

        setProducts(productList);
        setFilteredProducts(productList);
        setCategories(cateRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Lỗi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.tensanpham.toLowerCase().includes(lower) ||
        p.thuonghieu?.toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Xóa
  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.masanpham !== id));
    } catch {
      alert("Không thể xóa sản phẩm!");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>

        {/* Search */}
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />
        </div>

        {/* Thêm sản phẩm */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <ProductTable
        products={filteredProducts}
        categories={categories}
        onView={(id) => (window.location.href = `/admin/products/${id}`)}
        onEdit={(p) => {
          setEditProduct(p);
          setShowEditModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal thêm */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        colors={[]} // để sau
        sizes={[]} // để sau
        onSuccess={() => window.location.reload()}
      />

      {/* Modal sửa */}
      <EditProductModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={editProduct}
        categories={categories}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
