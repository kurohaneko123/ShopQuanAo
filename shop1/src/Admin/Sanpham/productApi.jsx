import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// =============== SẢN PHẨM ===============

// Lấy danh sách sản phẩm
export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/sanpham`);
  return res.data.data || [];
};

// Lấy chi tiết 1 sản phẩm (kèm biến thể + hình)
export const getProductDetail = async (id) => {
  const res = await axios.get(`${API_BASE}/sanpham/${id}`);
  // BE trả: { sanpham, bienthe: [...] }
  return res.data;
};

// Thêm mới sản phẩm + biến thể (chung 1 API)
export const createProductWithVariants = async (product, variants) => {
  const payload = {
    ...product,
    bienthe: variants, // BE expect data.bienthe là array
  };

  const res = await axios.post(`${API_BASE}/sanpham/them`, payload);
  return res.data;
};

// Sửa thông tin sản phẩm (không đụng biến thể)
export const updateProduct = async (id, product, oldAnh) => {
  const body = {
    ...product,
    anhdaidien: oldAnh, // 🟢 luôn giữ ảnh cũ nếu FE không đổi
  };

  const res = await axios.put(`${API_BASE}/sanpham/sua/${id}`, body);
  return res.data;
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_BASE}/sanpham/${id}`);
  return res.data;
};

// =============== BIẾN THỂ ===============

// Sửa 1 biến thể riêng
export const updateVariant = async (variantId, data) => {
  const res = await axios.put(`${API_BASE}/bienthe/sua/${variantId}`, data);
  return res.data;
};

// Xóa 1 biến thể riêng
export const deleteVariant = async (variantId) => {
  const res = await axios.delete(`${API_BASE}/bienthe/xoa/${variantId}`);
  return res.data;
};
// Upload ảnh đại diện sản phẩm (Cloudinary)
export const uploadProductAvatar = async (masanpham, file) => {
  const form = new FormData();
  form.append("masanpham", masanpham);
  form.append("image", file);

  const res = await axios.post(`${API_BASE}/sanpham/upanhdaidien`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // trả: {message, url}
};
// Upload 1 ảnh của biến thể
export const uploadVariantImage = async (mabienthe, file, stt) => {
  const form = new FormData();
  form.append("mabienthe", mabienthe);
  form.append("image", file);
  form.append("stt", stt); // FE tự gửi stt = 1 hoặc 2

  const res = await axios.post(`${API_BASE}/hinhanh/upload-bienthe`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // {message, url}
};
// =============== MÀU SẮC ===============

// Lấy danh sách màu sắc
export const getAllColors = async () => {
  const res = await axios.get(`${API_BASE}/mausac`);
  return res.data.data || [];
};

// =============== KÍCH THƯỚC ===============

// Lấy danh sách kích thước
export const getAllSizes = async () => {
  const res = await axios.get(`${API_BASE}/kichthuoc`);
  return res.data.data || [];
};
