import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function Quanlysp() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  // =====================================================
  // 🟢 1️⃣ LẤY DANH SÁCH SẢN PHẨM TỪ API (GET)
  // =====================================================
  useEffect(() => {
    // Gọi API khi trang load
    // ⚙️ Khi có backend thật: đổi URL cho đúng
    // Ví dụ: http://localhost:5000/api/products
    const fetchProducts = async () => {
      try {
        // const res = await axios.get("http://localhost:5000/api/products");
        // setProducts(res.data);

        // 👉 Tạm dùng dữ liệu mẫu để test frontend
        setProducts([
          {
            id: 1,
            name: "Áo thun trắng basic",
            price: 120000,
            category: "Áo thun",
            image: "https://via.placeholder.com/120x120.png?text=Ao+Thun",
          },
          {
            id: 2,
            name: "Áo sơ mi caro",
            price: 180000,
            category: "Áo sơ mi",
            image: "https://via.placeholder.com/120x120.png?text=So+Mi",
          },
        ]);
      } catch (err) {
        console.error("❌ Lỗi khi lấy sản phẩm:", err);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // 🟢 2️⃣ THÊM SẢN PHẨM MỚI (POST)
  // =====================================================
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    try {
      // ⚙️ Khi có backend:
      // const res = await axios.post("http://localhost:5000/api/products", {
      //   Name: newProduct.name,
      //   Price: newProduct.price,
      //   Category: newProduct.category,
      //   ImageURL: newProduct.image,
      // });
      // setProducts([...products, res.data]);

      // 👉 Hiện tại chỉ làm giả frontend
      const fakeItem = {
        ...newProduct,
        id: Date.now(),
        price: Number(newProduct.price),
      };
      setProducts([...products, fakeItem]);

      setShowAddModal(false);
      setNewProduct({ name: "", price: "", category: "", image: "" });
    } catch (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
    }
  };

  // =====================================================
  // 🟠 3️⃣ SỬA SẢN PHẨM (PUT)
  // =====================================================
  const handleEditProduct = async () => {
    try {
      // ⚙️ Khi có backend:
      // await axios.put(`http://localhost:5000/api/products/${editProduct.id}`, {
      //   Name: editProduct.name,
      //   Price: editProduct.price,
      //   Category: editProduct.category,
      //   ImageURL: editProduct.image,
      // });

      // 👉 Cập nhật tạm thời trên frontend
      setProducts(
        products.map((p) => (p.id === editProduct.id ? editProduct : p))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  // =====================================================
  // 🔴 4️⃣ XÓA SẢN PHẨM (DELETE)
  // =====================================================
  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      // ⚙️ Khi có backend:
      // await axios.delete(`http://localhost:5000/api/products/${id}`);

      // 👉 Tạm thời chỉ xóa trong danh sách frontend
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
    }
  };

  // =====================================================
  // 🟣 GIAO DIỆN FRONTEND
  // =====================================================
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
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
              <th className="p-3 border">Danh mục</th>
              <th className="p-3 border">Giá</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 text-center border">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.category}</td>
                <td className="p-2 border text-blue-600 font-semibold">
                  {p.price.toLocaleString()} đ
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => {
                      setEditProduct(p);
                      setShowEditModal(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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

      {/* Modal thêm sản phẩm */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Thêm sản phẩm</h3>
            <div className="space-y-3">
              <input
                placeholder="Tên sản phẩm"
                className="border p-2 w-full rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                placeholder="Giá sản phẩm"
                type="number"
                className="border p-2 w-full rounded"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                placeholder="Danh mục"
                className="border p-2 w-full rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                placeholder="Link ảnh (Cloudinary sau này)"
                className="border p-2 w-full rounded"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa sản phẩm */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa sản phẩm</h3>
            <div className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                value={editProduct.image}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditProduct}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
