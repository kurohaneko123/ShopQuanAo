export function normalizeReviews(list = []) {
  return list.map((x, idx) => ({
    reviewId: x.reviewId ?? x.ReviewID ?? x.madanhgia ?? `${idx}`,
    userName:
      x.userName ?? x.FullName ?? x.tennguoidung ?? x.username ?? "Khách hàng",
    rating: Number(x.rating ?? x.Rating ?? x.sosao ?? 0),
    content: x.content ?? x.Content ?? x.noidung ?? x.comment ?? "",
    images: x.images ?? x.Images ?? x.hinhanh ?? [],
    createdAt: x.createdAt ?? x.CreatedAt ?? x.ngaytao ?? x.created_at,
    verified: Boolean(x.verified ?? x.IsVerified ?? x.damua ?? false),
    adminReply: x.adminReply ?? x.Reply ?? x.phanhoi ?? "",
  }));
}

export function buildStats(list = []) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  list.forEach((r) => {
    const rt = Math.min(5, Math.max(1, Number(r.rating || 0)));
    dist[rt] += 1;
    sum += rt;
  });

  const count = list.length;
  const avg = count ? sum / count : 0;
  return { count, avg, dist };
}
