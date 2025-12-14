import { Star } from "lucide-react";

export default function ReviewItem({ review }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-slate-900">{review.userName}</p>
          <div className="flex text-yellow-500 mt-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        </div>

        {review.verified && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Đã mua hàng
          </span>
        )}
      </div>

      <p className="mt-3 text-slate-700">{review.content}</p>

      {review.adminReply && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 border">
          <p className="text-xs font-semibold text-slate-900">
            Phản hồi từ shop
          </p>
          <p className="text-sm text-slate-700 mt-1">{review.adminReply}</p>
        </div>
      )}
    </div>
  );
}
