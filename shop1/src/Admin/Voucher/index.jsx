// shop1/src/Admin/Voucher/index.jsx
import React, { useEffect, useState } from "react";
import {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} from "./voucherApi";

import VoucherTable from "./VoucherTable";
import AddVoucherModal from "./AddVoucherModal";
import EditVoucherModal from "./EditVoucherModal";

export default function QuanLyVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [newData, setNewData] = useState({
    mavoucher: "",
    magiamgia: "",
    mota: "",
    loaikhuyenmai: "%",
    giatrigiam: "",
    giantoida: 0,
    dontoithieu: 0,
    apdungtoanbo: 1,
    masanpham: null,
    madanhmuc: null,
    ngaybatdau: "",
    ngayketthuc: "",
    trangthai: "hoạt động",
  });

  const [editData, setEditData] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await getVouchers();
      setVouchers(res.data.data);
    } catch (err) {
      console.error("Lỗi tải voucher:", err);
      alert("Không thể tải danh sách voucher!");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    try {
      await addVoucher(newData);
      load();
      setAddOpen(false);
      setNewData({});
    } catch (err) {
      console.error(err);
      alert("Thêm voucher thất bại. Kiểm tra dữ liệu!");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        mavoucher: String(editData.mavoucher || ""),
        magiamgia: String(editData.magiamgia || ""),
        mota: String(editData.mota || ""),
        loaikhuyenmai: editData.loaikhuyenmai,
        giatrigiam: Number(editData.giatrigiam),

        giantoida: editData.giantoida ? Number(editData.giantoida) : null,
        dontoithieu: editData.dontoithieu ? Number(editData.dontoithieu) : null,

        apdungtoanbo: Number(editData.apdungtoanbo),

        masanpham:
          editData.apdungtoanbo == 0 && editData.masanpham
            ? Number(editData.masanpham)
            : null,

        madanhmuc:
          editData.apdungtoanbo == 0 && editData.madanhmuc
            ? Number(editData.madanhmuc)
            : null,

        ngaybatdau: editData.ngaybatdau || null,
        ngayketthuc: editData.ngayketthuc || null,
        trangthai: editData.trangthai || "hoạt động",
      };

      console.log("Payload FE gửi:", payload);

      await updateVoucher(editData.magiamgia, payload);

      load();
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Sửa voucher thất bại (FE)!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa voucher này?")) return;
    await deleteVoucher(id);
    load();
  };

  return (
    <div className="p-6 text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Quản lý voucher</h2>

        <button
          onClick={() => {
            const nextId =
              vouchers.length > 0
                ? Math.max(...vouchers.map((v) => Number(v.mavoucher))) + 1
                : 1;

            setNewData({
              mavoucher: nextId,
              magiamgia: "",
              mota: "",
              loaikhuyenmai: "%",
              giatrigiam: "",
              giantoida: 0,
              dontoithieu: 0,
              apdungtoanbo: 1,
              masanpham: null,
              madanhmuc: null,
              ngaybatdau: "",
              ngayketthuc: "",
              trangthai: "hoạt động",
            });

            setAddOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg transition"
        >
          ➕ Thêm voucher
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <VoucherTable
          vouchers={vouchers}
          onEdit={(v) => {
            setEditData({
              mavoucher: v.mavoucher || "",
              magiamgia: v.magiamgia || "",
              mota: v.mota || "",
              loaikhuyenmai: v.loaikhuyenmai || "%",
              giatrigiam: v.giatrigiam || 0,

              giantoida: v.giantoida || 0,
              dontoithieu: v.dontoithieu || 0,
              apdungtoanbo: v.apdungtoanbo ?? 1,

              masanpham: v.masanpham || null,
              madanhmuc: v.madanhmuc || null,

              ngaybatdau: v.ngaybatdau?.split("T")[0] || "",
              ngayketthuc: v.ngayketthuc?.split("T")[0] || "",

              trangthai: v.trangthai || "hoạt động",
            });
            setEditOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <AddVoucherModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        data={newData}
        setData={setNewData}
        onSubmit={handleAdd}
      />

      <EditVoucherModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={editData}
        setData={setEditData}
        onSubmit={handleEdit}
      />
    </div>
  );
}
