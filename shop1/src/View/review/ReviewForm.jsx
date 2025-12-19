import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ productId, onSuccess, reviewCount = 0 }) {
  const [rating, setRating] = useState(5);
  const [noidung, setNoidung] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔒 FE anti-spam
  if (reviewCount >= 10) {
    return (
      <div className="rounded-2xl border p-4 bg-slate-50 text-slate-600">
        Bạn đã gửi <b>10 / 10</b> đánh giá cho sản phẩm này.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (reviewCount >= 10) {
      alert("Bạn đã đạt giới hạn 10 đánh giá cho sản phẩm này");
      return;
    }

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

      const madonhang = localStorage.getItem("lastOrderId");
      if (!madonhang) {
        alert("Không tìm thấy đơn hàng để đánh giá");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/danhgia",
        {
          masanpham: productId,
          madonhang: Number(madonhang),
          sosao: rating,
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
      if (err.response?.status === 403) {
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
      <h3 className="font-semibold">Viết đánh giá ({reviewCount}/10)</h3>

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

      <textarea
        value={noidung}
        onChange={(e) => setNoidung(e.target.value)}
        className="w-full border rounded p-3"
        placeholder="Chia sẻ cảm nhận của bạn..."
      />
      {/* Upload hình ảnh */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Thêm hình ảnh (tối đa 5)
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setImages(files.slice(0, 5));
          }}
          className="block w-full text-sm
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-slate-100 file:text-slate-700
      hover:file:bg-slate-200
    "
        />

        {/* Preview ảnh */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

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
