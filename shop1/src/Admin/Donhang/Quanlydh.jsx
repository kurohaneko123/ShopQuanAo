import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const API = "http://localhost:5000/api/donhang";

export default function Quanlydh() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ====================== LẤY DANH SÁCH ĐƠN HÀNG ======================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API);
        setOrders(res.data.data);
        setFiltered(res.data.data); // KHÔNG FILTER TRẠNG THÁI
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Auto reload mỗi 3 giây
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ====================== SEARCH FILTER ======================
  useEffect(() => {
    const f = orders.filter((x) =>
      `${x.madonhang}${x.tennguoinhan}${x.sodienthoai}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, orders]);

  // ====================== CẬP NHẬT TRẠNG THÁI ======================
  const updateStatus = async (id, item, status) => {
    try {
      await axios.put(
        `${API}/sua/${id}`,
        {
          tennguoinhan: item.tennguoinhan,
          sodienthoai: item.sodienthoai,
          diachigiao: item.diachigiao,
          donvivanchuyen: item.donvivanchuyen,
          hinhthucthanhtoan: item.hinhthucthanhtoan,
          ghichu: item.ghichu,
          phivanchuyen: item.phivanchuyen,
          tongthanhtoan: item.tongthanhtoan,
          trangthai: status,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // update FE luôn
      setOrders((prev) =>
        prev.map((o) => (o.madonhang === id ? { ...o, trangthai: status } : o))
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Đang tải đơn hàng...</p>
    );

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Quản Lý Đơn Hàng</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Tìm theo mã đơn, tên người nhận, SĐT..."
        className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-lg mb-5 w-80 text-gray-200 placeholder-gray-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-white/5 text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="p-3 w-[90px] text-left">Mã đơn</th>
              <th className="p-3 w-[180px] text-left">Người nhận</th>
              <th className="p-3 w-[130px] text-left">SĐT</th>
              <th className="p-3 w-[130px] text-left">Tổng tiền</th>
              <th className="p-3 w-[150px] text-center">Trạng thái</th>
              <th className="p-3 w-[160px] text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((x) => (
              <tr
                key={x.madonhang}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-3 text-gray-300 font-semibold">
                  {x.madonhang}
                </td>
                <td className="p-3 text-gray-200">{x.tennguoinhan}</td>
                <td className="p-3 text-gray-300">{x.sodienthoai}</td>
                <td className="p-3 text-teal-300 font-semibold">
                  {Number(x.tongthanhtoan).toLocaleString()}đ
                </td>

                {/* BADGE TRẠNG THÁI */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      x.trangthai === "Chờ xác nhận"
                        ? "bg-yellow-600/30 text-yellow-300 border-yellow-500/40"
                        : x.trangthai === "Đã xác nhận"
                        ? "bg-blue-600/30 text-blue-300 border-blue-500/40"
                        : x.trangthai === "Đang giao"
                        ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
                        : x.trangthai === "Đã hủy"
                        ? "bg-red-600/30 text-red-300 border-red-500/40"
                        : "bg-green-600/30 text-green-300 border-green-500/40"
                    }`}
                  >
                    {x.trangthai}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex justify-center gap-4">
                    {/* Xem */}
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white flex items-center gap-1 shadow">
                      <Eye size={16} /> Xem
                    </button>

                    {/* Chờ xác nhận */}
                    {x.trangthai === "Chờ xác nhận" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(x.madonhang, x, "Đã xác nhận")
                          }
                          className="text-green-400 hover:text-green-300 font-semibold"
                        >
                          ✔ Xác nhận
                        </button>

                        <button
                          onClick={() => updateStatus(x.madonhang, x, "Đã hủy")}
                          className="text-red-500 hover:text-red-400 font-semibold"
                        >
                          ✖ Hủy
                        </button>
                      </>
                    )}

                    {/* Đã xác nhận */}
                    {x.trangthai === "Đã xác nhận" && (
                      <button
                        onClick={() =>
                          updateStatus(x.madonhang, x, "Đang giao")
                        }
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        ➜ Đang giao
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
