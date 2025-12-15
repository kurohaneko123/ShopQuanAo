import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [noidung, setNoidung] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!noidung.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setLoading(true);

      // 🔹 BƯỚC 1: tạo đánh giá (KHÔNG HÌNH)
      const res = await axios.post("http://localhost:5000/api/danhgia", {
        productId,
        rating,
        noidung,
      });

      const madanhgia = res.data.madanhgia; // 👈 backend trả về

      // 🔹 BƯỚC 2: nếu có hình → upload hình
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("images", file);
        });

        await axios.post(
          `http://localhost:5000/api/danhgia/${madanhgia}/hinhanh`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      alert("Đánh giá thành công 🎉");
      setNoidung("");
      setImages([]);
      onSuccess?.(); // reload lại list đánh giá
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-3">
      <h3 className="font-semibold">Viết đánh giá</h3>

      {/* Rating */}
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} sao
          </option>
        ))}
      </select>

      {/* Nội dung */}
      <textarea
        value={noidung}
        onChange={(e) => setNoidung(e.target.value)}
        className="w-full border rounded p-3"
        placeholder="Chia sẻ cảm nhận của bạn..."
      />

      {/* Hình ảnh */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages([...e.target.files])}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
}
