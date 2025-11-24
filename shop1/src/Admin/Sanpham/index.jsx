// src/Admin/Sanpham/index.jsx
import React, { useState, useEffect } from "react";

import {
  getAllProducts,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  getAllColors,
  getAllSizes,
} from "./productApi";

import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

export default function QuanLySanPham() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(true);

  // Modal thêm / sửa
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Form thêm
  const [newData, setNewData] = useState({
    tensanpham: "",
    madanhmuc: "",
    thuonghieu: "",
    mota: "",
    chatlieu: "",
    kieudang: "",
    baoquan: "",
  });

  // Form sửa
  const [editData, setEditData] = useState(null);

  const API_CATEGORY = "http://localhost:5000/api/danhmuc";

  // =============================
  // 🔵 Load sản phẩm & danh mục
  // =============================
  const load = async () => {
    setLoading(true);

    try {
      const [pro, cateRes, colorsRes, sizesRes] = await Promise.all([
        getAllProducts(),
        fetch(API_CATEGORY).then((r) => r.json()),
        getAllColors(),
        getAllSizes(),
      ]);

      setProducts(pro);
      setCategories(cateRes.data || []);
      setColors(colorsRes);
      setSizes(sizesRes);
    } catch (err) {
      console.error(err);
      alert("Không thể tải sản phẩm!");
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // =============================
  // 🔵 Thêm sản phẩm
  // =============================
  const handleAdd = async () => {
    try {
      // sản phẩm mới + biến thể sẽ xử lý trong AddProductModal
      alert("Thêm sản phẩm đang xử lý trong modal…");
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  // =============================
  // 🔵 Sửa sản phẩm
  // =============================
  const handleEdit = async () => {
    if (!editData) return;

    try {
      await updateProduct(editData.masanpham, editData);
      load();
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Sửa sản phẩm thất bại!");
    }
  };

  // =============================
  // 🔵 Xóa sản phẩm
  // =============================
  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa sản phẩm!");
    }
  };

  return (
    <div className="p-6">
      {/* =============================
           HEADER
      ============================= */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>

        <button
          onClick={() => {
            // reset form khi mở modal
            setNewData({
              tensanpham: "",
              madanhmuc: "",
              thuonghieu: "",
              mota: "",
              chatlieu: "",
              kieudang: "",
              baoquan: "",
            });
            setAddOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* =============================
           TABLE
      ============================= */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <ProductTable
          products={products}
          categories={categories}
          onEdit={(p) => {
            setEditData(p);
            setEditOpen(true);
          }}
          onDelete={handleDelete}
          onView={(id) => (window.location.href = `/admin/products/${id}`)}
        />
      )}

      {/* =============================
           MODAL THÊM
      ============================= */}
      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        data={newData}
        setData={setNewData}
        categories={categories}
        colors={colors}
        sizes={sizes}
        onSubmit={handleAdd}
        onSuccess={load}
      />

      {/* =============================
           MODAL SỬA
      ============================= */}
      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={editData}
        categories={categories}
        onSuccess={load}
        setData={setEditData}
      />
    </div>
  );
}
