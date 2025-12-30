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
import Swal from "sweetalert2";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import Pagination from "../Pagination";
import ProductCard from "./ProductCard";

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
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        load();
        Swal.fire("Đã xóa!", "Sản phẩm đã được xóa khỏi danh sách.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi!", "Không thể xóa sản phẩm!", "error");
      }
    }
  };
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 text-gray-200">
      {/* =============================
           HEADER
      ============================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Quản lý sản phẩm
        </h2>

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
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg transition text-white"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* =============================
           TABLE
      ============================= */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <ProductTable
          products={paginatedProducts}
          categories={categories}
          onEdit={(p) => {
            setEditData(p);
            setEditOpen(true);
          }}
          onDelete={handleDelete}
          onView={(id) => (window.location.href = `/admin/products/${id}`)}
        />
      )}
      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.map((p) => (
          <ProductCard
            key={p.masanpham}
            product={p}
            categoryName={
              categories.find((c) => c.madanhmuc === p.madanhmuc)?.tendanhmuc ||
              "—"
            }
            onView={(id) => (window.location.href = `/admin/products/${id}`)}
            onEdit={(p) => {
              setEditData(p);
              setEditOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        totalItems={products.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

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
