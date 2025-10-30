import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";

export default function Quanlyvoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);

  const [newVoucher, setNewVoucher] = useState({
    magiamgia: "",
    mota: "",
    loaikhuyenmai: "%",
    giatrigiam: "",
    giantoida: "",
    dontoithieu: "",
    ngaybatdau: "",
    ngayketthuc: "",
    trangthai: "hoạt động",
  });
  const API_URL = "http://localhost:5000/api/voucher";

  // =====================================================
  // 🟢 LẤY DANH SÁCH VOUCHER (GET)
  // =====================================================
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get(API_URL);
        setVouchers(res.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy voucher:", err);
        alert("Không thể lấy danh sách voucher!");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);
  // =====================================================
  // 🟠 THÊM / SỬA / XÓA (LOCAL)
  // =====================================================
  const handleAddVoucher = () => {
    if (!newVoucher.magiamgia || !newVoucher.giatrigiam)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    const fakeItem = {
      ...newVoucher,
      id: Date.now(),
    };
    setVouchers([...vouchers, fakeItem]);
    setShowAddModal(false);
    setNewVoucher({
      magiamgia: "",
      mota: "",
      loaikhuyenmai: "%",
      giatrigiam: "",
      giantoida: "",
      dontoithieu: "",
      ngaybatdau: "",
      ngayketthuc: "",
      trangthai: "hoạt động",
    });
  };

  const handleEditVoucher = () => {
    setVouchers(
      vouchers.map((v) =>
        v.magiamgia === editVoucher.magiamgia ? editVoucher : v
      )
    );
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Xóa voucher này?")) return;
    setVouchers(vouchers.filter((v) => v.magiamgia !== id));
  };

  // =====================================================
  // 🟣 FORMAT NGÀY & MÀU TRẠNG THÁI
  // =====================================================
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hoạt động":
        return "text-green-600 font-semibold";
      case "hết hạn":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  // =====================================================
  // 🟣 GIAO DIỆN
  // =====================================================
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Đang tải voucher...
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Voucher</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Thêm voucher
        </button>
      </div>

      {/* Bảng voucher */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-cyan-100 text-gray-700">
              <th className="p-3 border">Mã giảm giá</th>
              <th className="p-3 border">Mô tả</th>
              <th className="p-3 border">Loại</th>
              <th className="p-3 border">Giá trị</th>
              <th className="p-3 border">Giảm tối đa</th>
              <th className="p-3 border">Đơn tối thiểu</th>
              <th className="p-3 border">Bắt đầu</th>
              <th className="p-3 border">Kết thúc</th>
              <th className="p-3 border">Trạng thái</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.magiamgia} className="hover:bg-gray-50">
                <td className="p-2 border font-semibold">{v.magiamgia}</td>
                <td className="p-2 border">{v.mota}</td>
                <td className="p-2 border text-center">{v.loaikhuyenmai}</td>
                <td className="p-2 border text-center">
                  {v.giatrigiam}
                  {v.loaikhuyenmai === "%" ? "%" : "đ"}
                </td>
                <td className="p-2 border text-right">
                  {v.giantoida?.toLocaleString()} đ
                </td>
                <td className="p-2 border text-right">
                  {v.dontoithieu?.toLocaleString()} đ
                </td>
                <td className="p-2 border text-center">
                  {formatDate(v.ngaybatdau)}
                </td>
                <td className="p-2 border text-center">
                  {formatDate(v.ngayketthuc)}
                </td>
                <td
                  className={`p-2 border text-center ${getStatusColor(
                    v.trangthai
                  )}`}
                >
                  {v.trangthai}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => {
                      setEditVoucher(v);
                      setShowEditModal(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(v.magiamgia)}
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

      {/* Modal thêm voucher */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Thêm voucher</h3>
            <div className="space-y-3">
              <input
                placeholder="Mã giảm giá"
                className="border p-2 w-full rounded"
                value={newVoucher.magiamgia}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, magiamgia: e.target.value })
                }
              />
              <textarea
                placeholder="Mô tả"
                className="border p-2 w-full rounded h-20"
                value={newVoucher.mota}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, mota: e.target.value })
                }
              />
              <select
                className="border p-2 w-full rounded"
                value={newVoucher.loaikhuyenmai}
                onChange={(e) =>
                  setNewVoucher({
                    ...newVoucher,
                    loaikhuyenmai: e.target.value,
                  })
                }
              >
                <option value="%">Phần trăm (%)</option>
                <option value="tiền">Tiền (VNĐ)</option>
              </select>
              <input
                placeholder="Giá trị giảm"
                type="number"
                className="border p-2 w-full rounded"
                value={newVoucher.giatrigiam}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, giatrigiam: e.target.value })
                }
              />
              <input
                placeholder="Giảm tối đa (đ)"
                type="number"
                className="border p-2 w-full rounded"
                value={newVoucher.giantoida}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, giantoida: e.target.value })
                }
              />
              <input
                placeholder="Đơn tối thiểu (đ)"
                type="number"
                className="border p-2 w-full rounded"
                value={newVoucher.dontoithieu}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, dontoithieu: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={newVoucher.ngaybatdau}
                  onChange={(e) =>
                    setNewVoucher({ ...newVoucher, ngaybatdau: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={newVoucher.ngayketthuc}
                  onChange={(e) =>
                    setNewVoucher({
                      ...newVoucher,
                      ngayketthuc: e.target.value,
                    })
                  }
                />
              </div>
              <select
                className="border p-2 w-full rounded"
                value={newVoucher.trangthai}
                onChange={(e) =>
                  setNewVoucher({ ...newVoucher, trangthai: e.target.value })
                }
              >
                <option value="hoạt động">Hoạt động</option>
                <option value="hết hạn">Hết hạn</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddVoucher}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa voucher */}
      {showEditModal && editVoucher && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa voucher</h3>
            <div className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                value={editVoucher.magiamgia}
                disabled
              />
              <textarea
                className="border p-2 w-full rounded h-20"
                value={editVoucher.mota}
                onChange={(e) =>
                  setEditVoucher({ ...editVoucher, mota: e.target.value })
                }
              />
              <select
                className="border p-2 w-full rounded"
                value={editVoucher.loaikhuyenmai}
                onChange={(e) =>
                  setEditVoucher({
                    ...editVoucher,
                    loaikhuyenmai: e.target.value,
                  })
                }
              >
                <option value="%">Phần trăm (%)</option>
                <option value="tiền">Tiền (VNĐ)</option>
              </select>
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={editVoucher.giatrigiam}
                onChange={(e) =>
                  setEditVoucher({
                    ...editVoucher,
                    giatrigiam: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={editVoucher.giantoida}
                onChange={(e) =>
                  setEditVoucher({
                    ...editVoucher,
                    giantoida: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={editVoucher.dontoithieu}
                onChange={(e) =>
                  setEditVoucher({
                    ...editVoucher,
                    dontoithieu: e.target.value,
                  })
                }
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={editVoucher.ngaybatdau?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditVoucher({
                      ...editVoucher,
                      ngaybatdau: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={editVoucher.ngayketthuc?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditVoucher({
                      ...editVoucher,
                      ngayketthuc: e.target.value,
                    })
                  }
                />
              </div>
              <select
                className="border p-2 w-full rounded"
                value={editVoucher.trangthai}
                onChange={(e) =>
                  setEditVoucher({ ...editVoucher, trangthai: e.target.value })
                }
              >
                <option value="hoạt động">Hoạt động</option>
                <option value="hết hạn">Hết hạn</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditVoucher}
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
