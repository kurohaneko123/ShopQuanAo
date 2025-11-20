export const formatDanhMuc = (tendanhmuc) => {
  return tendanhmuc
    .normalize("NFD") // bỏ dấu
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/[^a-zA-Z0-9 ]/g, "") // bỏ ký tự đặc biệt
    .trim()
    .split(" ") // tách từ
    .filter((word) => !["nam", "nu"].includes(word.toLowerCase())) // bỏ Nam/Nu
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(""); // ghép lại thành CamelCase
};
