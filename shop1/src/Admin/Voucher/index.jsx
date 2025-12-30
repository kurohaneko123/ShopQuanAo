// shop1/src/Admin/Voucher/index.jsx
import React, { useEffect, useState } from "react";
import {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} from "./voucherApi";
import Swal from "sweetalert2";
import VoucherTable from "./VoucherTable";
import AddVoucherModal from "./AddVoucherModal";
import EditVoucherModal from "./EditVoucherModal";
import Pagination from "../Pagination";
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
  const ITEMS_PER_PAGE = 1;
  const [page, setPage] = useState(1);

  const [editData, setEditData] = useState({});
  const validateAdd = () => {
    const d = newData;
    const e = {};

    if (!d.magiamgia?.trim()) e.magiamgia = "Vui lòng nhập mã giảm giá";
    if (!NO_SPECIAL_CHAR_REGEX.test(d.magiamgia)) {
      e.magiamgia = "Mã giảm giá không được chứa ký tự đặc biệt";
    }

    if (!d.giatrigiam || Number(d.giatrigiam) <= 0)
      e.giatrigiam = "Giá trị giảm phải > 0";

    if (d.loaikhuyenmai === "%" && Number(d.giatrigiam) > 100)
      e.giatrigiam = "Giảm theo % không được > 100";

    if (!d.ngaybatdau) e.ngaybatdau = "Chọn ngày bắt đầu";
    if (!d.ngayketthuc) e.ngayketthuc = "Chọn ngày kết thúc";
    if (newData.ngaybatdau === newData.ngayketthuc)
      e.ngayketthuc = "Ngày kết thúc phải sau ngày bắt đầu";
    if (
      d.ngaybatdau &&
      d.ngayketthuc &&
      new Date(d.ngaybatdau) > new Date(d.ngayketthuc)
    )
      e.ngayketthuc = "Ngày kết thúc phải sau ngày bắt đầu";

    setAddErrors(e);
    return Object.keys(e).length === 0;
  };
  const NO_SPECIAL_CHAR_REGEX = /^[a-zA-Z0-9À-ỹ\s]+$/;

  const validateEdit = () => {
    const d = editData;
    const e = {};

    // edit không bắt nhập lại mã, chỉ check phần có thể sai
    if (!d.giatrigiam || Number(d.giatrigiam) <= 0)
      e.giatrigiam = "Giá trị giảm phải > 0";
    if (!NO_SPECIAL_CHAR_REGEX.test(d.magiamgia)) {
      e.magiamgia = "Mã giảm giá không được chứa ký tự đặc biệt";
    }
    if (d.mota && !d.mota.trim()) {
      e.mota = "Vui lòng nhập mô tả";
    }
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
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách voucher!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
      Swal.fire({
        title: "Thành công!",
        text: "Thêm voucher thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error(err);
      // FE: không biết BE chửi field nào, nhưng ít nhất không phá form
      Swal.fire({
        title: "Lỗi!",
        text: "Thêm voucher thất bại. Kiểm tra dữ liệu!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedVouchers = vouchers.slice(start, start + ITEMS_PER_PAGE);

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
      Swal.fire({
        title: "Lỗi!",
        text: "Thiếu mã giảm giá!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const payload = {
      mavoucher: editData.magiamgia,
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
      Swal.fire({
        title: "Thành công!",
        text: "Cập nhật voucher thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setEditOpen(false);
      load();
    } catch (err) {
      console.error("Lỗi update voucher:", err.response?.data || err);

      Swal.fire({
        title: "Lỗi!",
        text: "Sửa voucher thất bại! Kiểm tra dữ liệu.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (magiamgia) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await deleteVoucher(magiamgia);
        load();
        Swal.fire("Đã xóa!", "Voucher đã được xóa khỏi danh sách.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi!", "Không thể xóa voucher!", "error");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 text-gray-200">
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
          Thêm voucher
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <VoucherTable
          vouchers={paginatedVouchers}
          onEdit={(v) => {
            setEditData({
              mavoucher: v.mavoucher,
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
      <Pagination
        totalItems={vouchers.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={setPage}
      />

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
