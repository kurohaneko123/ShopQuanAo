import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../Pagination";

const API = "http://localhost:5000/api/donhang";

export default function Quanlydh() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ITEMS_PER_PAGE = 7; //QUY dinh số item trên mỗi trang
  const [page, setPage] = useState(1); //trang hiện tại

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
  const updateStatus = async (id, status) => {
    const normalizedStatus = status.trim().toLowerCase();

    try {
      const base = orders.find((o) => String(o.madonhang) === String(id));

      if (!base) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Không tìm thấy đơn hàng!",
        });
        return;
      }

      // bắt buộc theo controller
      const tennguoinhan = base.tennguoinhan || "";
      const sodienthoai = base.sodienthoai || "";
      const diachigiao = base.diachigiao || "";

      if (!tennguoinhan.trim() || !sodienthoai.trim() || !diachigiao.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu dữ liệu",
          text: "Đơn hàng thiếu người nhận / số điện thoại / địa chỉ, không thể cập nhật.",
        });
        return;
      }
      const toNumber = (v) => {
        if (v === null || v === undefined) return 0;
        // nếu lỡ có "219,000" hoặc "219000.00" thì vẫn parse được
        const n = Number(String(v).replace(/[^\d.-]/g, ""));
        return Number.isFinite(n) ? n : 0;
      };

      let phiVC = toNumber(base.phivanchuyen);
      let tongTT = toNumber(base.tongthanhtoan ?? base.tongtien ?? 0);

      // ✅ chặn âm (đơn hàng không thể âm)
      phiVC = Math.max(0, phiVC);
      tongTT = Math.max(0, tongTT);

      // ✅ GỬI ĐỦ FIELD MODEL UPDATE ĐANG DÙNG
      const payload = {
        tennguoinhan: tennguoinhan.trim(),
        sodienthoai: sodienthoai.trim(),
        diachigiao: diachigiao.trim(),

        donvivanchuyen: base.donvivanchuyen || null,
        hinhthucthanhtoan: base.hinhthucthanhtoan || null,
        ghichu: base.ghichu || null,

        phivanchuyen: phiVC, // ✅ number >= 0
        tongthanhtoan: tongTT, // ✅ number >= 0

        trangthai: normalizedStatus,
      };

      console.log("PUT payload:", payload);

      await axios.put(`${API}/sua/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setOrders((prev) =>
        prev.map((o) =>
          String(o.madonhang) === String(id)
            ? { ...o, trangthai: normalizedStatus }
            : o
        )
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật trạng thái đơn hàng thành công",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Lỗi máy chủ",
      });
    }
  };
  const adminHuyDon = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận hủy đơn?",
      text: "Admin sẽ hủy đơn & hoàn kho!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Không",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API}/admin/huy/${id}`);

      setOrders((prev) =>
        prev.map((o) =>
          String(o.madonhang) === String(id) ? { ...o, trangthai: "đã hủy" } : o
        )
      );

      Swal.fire("Thành công", "Admin đã hủy đơn hàng", "success");
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err?.response?.data?.message || "Không thể hủy đơn",
        "error"
      );
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Đang tải đơn hàng...</p>
    );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filtered.slice(start, start + ITEMS_PER_PAGE);

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
              <th className="p-3 w-[90px] text-center">Mã đơn</th>
              <th className="p-3 w-[90px] text-center">Người nhận</th>
              <th className="p-3 w-[90px] text-center">SĐT</th>
              <th className="p-3 w-[90px] text-center">Tổng tiền</th>
              <th className="p-3 w-[150px] text-center">Trạng thái</th>
              <th className="p-3 w-[160px] text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((x) => (
              <tr
                key={x.madonhang}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-3 text-gray-300 font-semibold text-center">
                  {x.madonhang}
                </td>
                <td className="p-3 text-gray-200 text-center">
                  {x.tennguoinhan}
                </td>
                <td className="p-3 text-gray-300 text-center">
                  {x.sodienthoai}
                </td>
                <td className="p-3 text-teal-300 font-semibold text-center">
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
                    {/* XEM CHI TIẾT */}
                    <button
                      onClick={() => {
                        setSelectedOrder(x);
                        setShowDetail(true);
                      }}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                    >
                      <Eye size={16} />
                    </button>

                    {/* CHỈ HIỆN KHI CHỜ XÁC NHẬN */}
                    {x.trangthai?.toLowerCase() === "chờ xác nhận" && (
                      <>
                        {/* NÚT XÁC NHẬN */}
                        <button
                          onClick={() =>
                            updateStatus(x.madonhang, "đã xác nhận")
                          }
                          className="flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold"
                        >
                          <CheckCircle size={16} />
                          Xác nhận
                        </button>

                        {/* NÚT HỦY */}
                        <button
                          onClick={() => adminHuyDon(x.madonhang)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-400 font-semibold"
                        >
                          <XCircle size={16} />
                          Hủy
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={setPage}
      />

      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] w-[600px] max-h-[90vh] overflow-y-auto p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Chi tiết đơn hàng #{selectedOrder.madonhang}
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Thông tin người nhận */}
            <div className="space-y-2 text-white/90 text-sm">
              <p>
                <b>Người nhận:</b> {selectedOrder.tennguoinhan}
              </p>
              <p>
                <b>SĐT:</b> {selectedOrder.sodienthoai}
              </p>
              <p>
                <b>Địa chỉ:</b> {selectedOrder.diachigiao}
              </p>
              <p>
                <b>Thanh toán:</b> {selectedOrder.hinhthucthanhtoan}
              </p>
              <p>
                <b>Ghi chú:</b> {selectedOrder.ghichu || "Không có"}
              </p>
              <p>
                <b>Trạng thái:</b>{" "}
                <span className="text-teal-400 font-semibold">
                  {selectedOrder.trangthai}
                </span>
              </p>
            </div>

            <hr className="my-4 border-white/10" />

            {/* Tổng tiền */}
            <div className="text-right text-lg font-bold text-teal-400">
              Tổng thanh toán:{" "}
              {Number(selectedOrder.tongthanhtoan).toLocaleString()} đ
            </div>

            <div className="text-right mt-4">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
