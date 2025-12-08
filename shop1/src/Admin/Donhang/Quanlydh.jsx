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
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Quản Lý Đơn Hàng</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo mã đơn, tên người nhận, SĐT..."
        className="border w-80 px-4 py-2 rounded-lg mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white p-5 shadow rounded-xl">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="p-3 text-left">Mã đơn</th>
              <th className="p-3 text-left">Người nhận</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((x) => (
              <tr key={x.madonhang} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{x.madonhang}</td>
                <td className="p-3">{x.tennguoinhan}</td>
                <td className="p-3">{x.sodienthoai}</td>
                <td className="p-3 text-teal-600 font-semibold">
                  {Number(x.tongthanhtoan).toLocaleString()}đ
                </td>

                {/* ================================================== */}
                {/* HIỂN THỊ TRẠNG THÁI */}
                <td className="p-3 text-center">
                  {x.trangthai === "Chờ xác nhận" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                      Chờ xác nhận
                    </span>
                  )}

                  {x.trangthai === "Đã xác nhận" && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                      Đã xác nhận
                    </span>
                  )}

                  {x.trangthai === "Đang giao" && (
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                      Đang giao
                    </span>
                  )}

                  {x.trangthai === "Đã giao" && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      Đã giao
                    </span>
                  )}

                  {x.trangthai === "Đã hủy" && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                      Đã hủy
                    </span>
                  )}
                </td>

                {/* ================================================== */}
                {/* ACTION BUTTON */}
                <td className="p-3 flex items-center gap-3 text-center">
                  {/* Luôn hiện Xem */}
                  <button className="text-blue-500 hover:underline">Xem</button>

                  {/* Nếu chờ xác nhận → hiện nút xác nhận và hủy */}
                  {x.trangthai === "Chờ xác nhận" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(x.madonhang, x, "Đã xác nhận")
                        }
                        className="text-green-600 hover:underline"
                      >
                        ✔ Xác nhận
                      </button>

                      <button
                        onClick={() => updateStatus(x.madonhang, x, "Đã hủy")}
                        className="text-red-600 hover:underline"
                      >
                        ✖ Hủy
                      </button>
                    </>
                  )}

                  {/* Nếu đã xác nhận → hiện nút Đánh dấu đang giao */}
                  {x.trangthai === "Đã xác nhận" && (
                    <button
                      onClick={() => updateStatus(x.madonhang, x, "Đang giao")}
                      className="text-purple-600 hover:underline"
                    >
                      ➜ Đang giao
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
