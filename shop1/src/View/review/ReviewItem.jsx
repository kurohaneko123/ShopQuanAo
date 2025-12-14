import { Star } from "lucide-react";

export default function ReviewItem({ review }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{review.userName}</p>
          <div className="mt-1 flex items-center gap-1 text-yellow-500">
            {[...Array(Math.max(0, Number(review.rating || 0)))].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          {review.createdAt && (
            <p className="mt-1 text-xs text-slate-500">
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        {review.verified && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Đã mua hàng
          </span>
        )}
      </div>

      {review.content && (
        <p className="mt-3 text-slate-700 leading-relaxed">{review.content}</p>
      )}

      {Array.isArray(review.images) && review.images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {review.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="review"
              className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
            />
          ))}
        </div>
      )}

      {review.adminReply && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-900">
            Phản hồi từ shop
          </p>
          <p className="mt-1 text-sm text-slate-700">{review.adminReply}</p>
        </div>
      )}
    </div>
  );
}
