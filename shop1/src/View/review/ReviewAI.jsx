import React, { useState } from "react";

export default function ReviewAI({ aiAdapter }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await aiAdapter({ question: question.trim() });
      setAnswer(res?.answer || "AI chưa trả dữ liệu.");
    } catch (e) {
      setAnswer("Có lỗi khi gọi AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">
        Hỏi nhanh về đánh giá (AI)
      </p>

      <div className="mt-3 flex flex-col md:flex-row gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ví dụ: Size này có bị chật không? Vải có nóng không?"
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
        />
        <button
          onClick={ask}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          {loading ? "Đang hỏi..." : "Hỏi AI"}
        </button>
      </div>

      {answer && (
        <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
          {answer}
        </div>
      )}
    </div>
  );
}
