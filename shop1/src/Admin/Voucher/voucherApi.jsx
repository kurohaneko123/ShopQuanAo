// shop1/src/Admin/Voucher/voucherApi.jsx
import axios from "axios";

const API = "http://localhost:5000/api/voucher";

// Lấy
export const getVouchers = () => axios.get(API);

// Thêm
export const addVoucher = (data) =>
  axios.post(`${API}/themvoucher`, {
    mavoucher: data.mavoucher || data.magiamgia,
    magiamgia: data.magiamgia,
    mota: data.mota || "",
    loaikhuyenmai: data.loaikhuyenmai,
    giatrigiam: data.giatrigiam,
    giantoida: data.giantoida || null,
    dontoithieu: data.dontoithieu || null,
    apdungtoanbo: data.apdungtoanbo ?? 1,
    masanpham: data.masanpham || null,
    madanhmuc: data.madanhmuc || null,
    ngaybatdau: data.ngaybatdau,
    ngayketthuc: data.ngayketthuc,
    trangthai: data.trangthai || "hoạt động",
  });

// Sửa
export const updateVoucher = (id, data) =>
  axios.put(`${API}/suavoucher/${id}`, {
    mavoucher: data.mavoucher,
    magiamgia: data.magiamgia,
    mota: data.mota,
    loaikhuyenmai: data.loaikhuyenmai,
    giatrigiam: data.giatrigiam,

    giantoida: data.giantoida || 0,
    dontoithieu: data.dontoithieu || 0,
    apdungtoanbo: data.apdungtoanbo ?? 1,
    masanpham: data.masanpham || null,
    madanhmuc: data.madanhmuc || null,

    ngaybatdau: data.ngaybatdau,
    ngayketthuc: data.ngayketthuc,
    trangthai: data.trangthai,
  });

// Xóa
export const deleteVoucher = (id) => axios.delete(`${API}/xoavoucher/${id}`);
