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

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để đánh giá");
        return;
      }

      // 🔥 LẤY madonhang ĐÃ MUA (anh đang có sẵn)
      const madonhang = localStorage.getItem("lastOrderId");
      // hoặc props truyền xuống

      if (!madonhang) {
        alert("Không tìm thấy đơn hàng để đánh giá");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/danhgia",
        {
          masanpham: productId, // ✅ ĐÚNG TÊN
          madonhang: Number(madonhang), // ✅ BẮT BUỘC
          sosao: rating, // ✅ ĐÚNG TÊN
          noidung,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Đánh giá thành công 🎉");
      setNoidung("");
      setImages([]);
      onSuccess?.();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        alert(err.response.data?.message || "Dữ liệu đánh giá không hợp lệ");
      } else if (err.response?.status === 403) {
        alert(err.response.data?.message);
      } else if (err.response?.status === 409) {
        alert("Bạn đã đánh giá sản phẩm này rồi");
      } else {
        alert("Lỗi server");
      }
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
        className="bg-[rgb(96,148,216)] border border-[rgb(60,110,190)] text-white px-5 py-2 rounded-lg hover:bg-[rgb(72,128,204)] transition font-semibold"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
}
