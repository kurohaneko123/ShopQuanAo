"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ====== Mini NLP utils (không cần backend) ====== */
const stripDiacritics = (s="") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const hasAny = (text, keywords=[]) => {
  const t = stripDiacritics(text);
  return keywords.some(k => t.includes(stripDiacritics(k)));
};

/* ====== Knowledge base các câu trả lời (VN) ====== */
const KB = [
  {
    id: "price",
    title: "Bảng giá",
    patterns: ["giá", "bao nhiêu", "bao nhieu", "price", "bảng giá", "bang gia", "chi phí"],
    reply:
      "Giá tham khảo: Basic 119k–149k, Pro 159k–219k, Premium 239k–329k (tuỳ chất liệu, số lượng và kỹ thuật in/thêu). Bạn cho mình biết số lượng và form áo để mình gợi ý gói tối ưu nha!",
    cta: { label: "Xem Bảng Giá", href: "#bang-gia" },
  },
  {
    id: "moq",
    title: "Số lượng tối thiểu",
    patterns: ["tối thiểu", "toi thieu", "min", "ít nhất", "it nhat", "minimum", "bao nhieu ao"],
    reply:
      "Đặt từ 20 áo trở lên sẽ có giá tốt và bảo đảm tiến độ. Nếu bạn cần ít hơn, mình vẫn hỗ trợ nhưng giá có thể cao hơn một chút nhé.",
  },
  {
    id: "timeline",
    title: "Thời gian thiết kế & sản xuất",
    patterns: ["thời gian", "bao lau", "bao lâu", "thiet ke mat bao lau", "timeline", "giao hang khi nao"],
    reply:
      "Thiết kế/Mockup trong 24–48h. Sản xuất thường 3–7 ngày sau khi duyệt mẫu (tuỳ số lượng). Nếu cần gấp, bạn nói mốc thời gian để mình sắp xếp ưu tiên.",
  },
  {
    id: "material",
    title: "Chất liệu",
    patterns: ["chat lieu", "chất liệu", "vải", "vai", "cotton", "polo", "co sat", "thêu", "in"],
    reply:
      "Các chất liệu phổ biến: Cotton 65/35, Cotton 100%, Polo cá sấu. Kỹ thuật: In lụa, in chuyển nhiệt, DTF, hoặc thêu. Bạn muốn cảm giác mặc mát hay đứng form? Mình gợi ý loại vải phù hợp nhé!",
  },
  {
    id: "sizes",
    title: "Size & đo ni",
    patterns: ["size", "bang size", "đo size", "size chart", "co nao", "chon size"],
    reply:
      "Size từ S → 3XL. Nếu bạn có chiều cao/cân nặng, mình tư vấn size nhanh. Ngoài ra có thể mix size theo danh sách lớp.",
  },
  {
    id: "shipping",
    title: "Giao hàng",
    patterns: ["giao hang", "ship", "van chuyen", "toan quoc", "phi ship"],
    reply:
      "Giao hàng toàn quốc. Miễn phí nội thành với đơn > 50 áo. Bạn cho mình địa điểm để ước lượng thời gian vận chuyển nha.",
  },
  {
    id: "changes",
    title: "Chỉnh sửa mẫu",
    patterns: ["chinh sua", "sua mau", "duyet mau", "doi mau", "sua logo", "feedback"],
    reply:
      "Bạn được miễn phí 2 lần chỉnh sửa sau khi nhận bản thiết kế/3D. Vui lòng mô tả cụ thể (logo lớn hơn, đổi màu tay áo, thêm slogan...) để đội thiết kế cập nhật nhanh.",
  },
  {
    id: "payment",
    title: "Thanh toán",
    patterns: ["thanh toan", "ck", "chuyen khoan", "cod", "dat coc", "pay"],
    reply:
      "Hỗ trợ COD (cọc trước với một số mẫu), chuyển khoản ngân hàng, hoặc thanh toán tại cửa hàng. Với đơn số lượng lớn sẽ yêu cầu cọc để đặt hàng vải/màu.",
  },
  {
    id: "contact",
    title: "Liên hệ",
    patterns: ["lien he", "facebook", "zalo", "so dien thoai", "email"],
    reply:
      "Bạn có thể nhắn trực tiếp tại đây hoặc qua trang Liên hệ. Nếu gấp, bấm nút bên dưới để gọi/nhắn nhanh nhé.",
    cta: { label: "Liên hệ", href: "/lienhe" },
  },
];
// Giữ cả 2 hàm
function getBotReply(userText) {
  if (!userText?.trim())
    return "Bạn có thể hỏi về giá, thời gian thiết kế, chất liệu, size, giao hàng, chỉnh sửa mẫu…";
  const hit = KB.find(item => hasAny(userText, item.patterns));
  return hit ? hit.reply : "Mình chưa rõ câu hỏi. Bạn hỏi rõ hơn giúp mình nhé!";
}

async function getBotReplyLLM(userText){
  // Sau này muốn dùng API thật thì sửa tại đây
  const system = `
Bạn là trợ lý bán áo lớp & kỷ yếu. Trả lời ngắn gọn bằng tiếng Việt,
ưu tiên giá, thời gian, chất liệu, size, giao hàng, chỉnh sửa mẫu.
`;
  const resp = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ system, user: userText })
  }).then(r=>r.json()).catch(()=>({}));
  return resp.answer || getBotReply(userText);
}

/* ====== UI Component ====== */
export default function AIChatbox() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("ai_chat_history");
      return raw ? JSON.parse(raw) : [
        { role: "bot", text: "Xin chào 👋 Mình là trợ lý áo lớp. Bạn muốn hỏi về giá, thời gian thiết kế hay chất liệu không?" }
      ];
    } catch { return []; }
  });

  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quick = useMemo(() => ([
    "Giá tham khảo?",
    "Tối thiểu bao nhiêu áo?",
    "Bao lâu có mẫu/thiết kế?",
    "Vải nào mát, không nhăn?",
    "Có chỉnh sửa mẫu không?",
    "Ship toàn quốc chứ?",
  ]), []);

  const send = (content) => {
    const text = (content ?? msg).trim();
    if (!text) return;
    const userMsg = { role: "user", text };
    const botText = getBotReply(text);
    const botMsg = { role: "bot", text: botText };

    // tìm CTA nếu có
    const hit = KB.find(k => hasAny(text, k.patterns));
    const cta = hit?.cta ? { ...hit.cta } : null;

    setMessages(prev => [...prev, userMsg, botMsg, ...(cta ? [{ role: "bot-cta", text: cta.label, href: cta.href }] : [])]);
    setMsg("");
  };

  const handleQuick = (q) => send(q);

  return (
    <>
      {/* Nút nổi */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition flex items-center justify-center"
        aria-label="Mở chat tư vấn"
      >
        {open ? "×" : "💬"}
      </button>

      {/* Panel chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl border bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between">
            <div>
              <p className="font-semibold">Trợ lý Áo Lớp (AI)</p>
              <p className="text-xs text-gray-200">Tư vấn nhanh • 24/7</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">×</button>
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 flex flex-wrap gap-2 border-b bg-gray-50">
            {quick.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuick(q)}
                className="text-xs px-3 py-1 rounded-full border hover:bg-gray-900 hover:text-white transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => {
              if (m.role === "bot-cta") {
                return (
                  <div key={i} className="flex">
                    <a href={m.href} className="ml-10 text-sm underline underline-offset-2 text-gray-900">{m.text} →</a>
                  </div>
                );
              }
              const mine = m.role === "user";
              return (
                <div key={i} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                  <div className={
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm " +
                    (mine ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800")
                  }>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              value={msg}
              onChange={(e)=>setMsg(e.target.value)}
              onKeyDown={(e)=> (e.key === "Enter" ? send() : null)}
              placeholder="Nhập câu hỏi của bạn…"
              className="flex-1 h-10 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button onClick={()=>send()} className="h-10 px-4 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
