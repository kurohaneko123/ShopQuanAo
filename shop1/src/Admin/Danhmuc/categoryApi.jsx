import axios from "axios";

const API = "http://localhost:5000/api/danhmuc";

export const getAllCategories = async () => {
  const res = await axios.get(API);
  return res.data.data || [];
};

export const createCategory = async (data) => {
  const res = await axios.post(`${API}/them`, data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axios.put(`${API}/sua/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API}/xoa/${id}`);
  return res.data;
};
