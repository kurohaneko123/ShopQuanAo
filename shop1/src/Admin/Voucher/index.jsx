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
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const [editData, setEditData] = useState({});
  const validateAdd = () => {
    const d = newData;
    const e = {};

    if (!d.magiamgia?.trim()) e.magiamgia = "Vui lòng nhập mã giảm giá";

    if (!d.giatrigiam || Number(d.giatrigiam) <= 0)
      e.giatrigiam = "Giá trị giảm phải > 0";

    if (d.loaikhuyenmai === "%" && Number(d.giatrigiam) > 100)
      e.giatrigiam = "Giảm theo % không được > 100";

    if (!d.ngaybatdau) e.ngaybatdau = "Chọn ngày bắt đầu";
    if (!d.ngayketthuc) e.ngayketthuc = "Chọn ngày kết thúc";

    if (
      d.ngaybatdau &&
      d.ngayketthuc &&
      new Date(d.ngaybatdau) > new Date(d.ngayketthuc)
    )
      e.ngayketthuc = "Ngày kết thúc phải sau ngày bắt đầu";

    setAddErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateEdit = () => {
    const d = editData;
    const e = {};

    // edit không bắt nhập lại mã, chỉ check phần có thể sai
    if (!d.giatrigiam || Number(d.giatrigiam) <= 0)
      e.giatrigiam = "Giá trị giảm phải > 0";

    if (d.loaikhuyenmai === "%" && Number(d.giatrigiam) > 100)
      e.giatrigiam = "Giảm theo % không được > 100";

    if (!d.ngaybatdau) e.ngaybatdau = "Chọn ngày bắt đầu";
    if (!d.ngayketthuc) e.ngayketthuc = "Chọn ngày kết thúc";

    if (
      d.ngaybatdau &&
      d.ngayketthuc &&
      new Date(d.ngaybatdau) > new Date(d.ngayketthuc)
    )
      e.ngayketthuc = "Ngày kết thúc phải sau ngày bắt đầu";

    setEditErrors(e);
    return Object.keys(e).length === 0;
  };
  const setAddField = (key, value) => {
    setNewData((p) => ({ ...p, [key]: value }));
    setAddErrors((p) => ({ ...p, [key]: "" }));
  };

  const setEditField = (key, value) => {
    setEditData((p) => ({ ...p, [key]: value }));
    setEditErrors((p) => ({ ...p, [key]: "" }));
  };

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
    if (!validateAdd()) return;

    try {
      await addVoucher(newData);
      load();
      setAddOpen(false);
      setAddErrors({});
    } catch (err) {
      console.error(err);
      // FE: không biết BE chửi field nào, nhưng ít nhất không phá form
      alert("Thêm voucher thất bại. Kiểm tra dữ liệu!");
    }
  };

  const normalizeDate = (s) => {
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (typeof s === "string" && s.includes("T")) return s.split("T")[0];
    if (typeof s === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
      const [mm, dd, yyyy] = s.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const toNumberOrNull = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleEdit = async () => {
    if (!validateEdit()) return;

    if (!editData.magiamgia) {
      alert("Thiếu mã giảm giá!");
      return;
    }

    const payload = {
      mavoucher: editData.magiamgia, // ⭐ CHỐT LỖI Ở ĐÂY
      magiamgia: editData.magiamgia,
      mota: editData.mota,
      loaikhuyenmai: editData.loaikhuyenmai,
      giatrigiam: Number(editData.giatrigiam),
      giantoida: Number(editData.giantoida),
      dontoithieu: Number(editData.dontoithieu),
      apdungtoanbo: Number(editData.apdungtoanbo),
      masanpham: editData.masanpham,
      madanhmuc: editData.madanhmuc,
      ngaybatdau: editData.ngaybatdau,
      ngayketthuc: editData.ngayketthuc,
      trangthai: editData.trangthai,
    };

    try {
      await updateVoucher(editData.magiamgia, payload);
      alert("Cập nhật voucher thành công!");
      setEditOpen(false);
      load();
    } catch (err) {
      console.error("Lỗi update voucher:", err.response?.data || err);

      alert(
        err.response?.data?.message || "Sửa voucher thất bại! Kiểm tra dữ liệu."
      );
    }
  };

  const handleDelete = async (magiamgia) => {
    if (!confirm("Xóa voucher này?")) return;
    await deleteVoucher(magiamgia);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.magiamgia) return;
    await deleteVoucher(deleteTarget.magiamgia);
  };

  return (
    <div className="p-6 text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Quản lý voucher</h2>

        <button
          onClick={() => {
            setNewData({
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
              mavoucher: v.mavoucher, // ✅ QUAN TRỌNG
              magiamgia: v.magiamgia,
              mota: v.mota || "",
              loaikhuyenmai: v.loaikhuyenmai || "%",
              giatrigiam: v.giatrigiam || 0,
              giantoida: v.giantoida || 0,
              dontoithieu: v.dontoithieu || 0,
              apdungtoanbo: v.apdungtoanbo ?? 1,
              masanpham: v.masanpham ?? null,
              madanhmuc: v.madanhmuc ?? null,
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
        setField={setAddField}
        errors={addErrors}
        onSubmit={handleAdd}
      />

      <EditVoucherModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={editData}
        setField={setEditField}
        errors={editErrors}
        onSubmit={handleEdit}
      />
    </div>
  );
}
