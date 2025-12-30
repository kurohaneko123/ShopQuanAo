import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, XCircle, Pencil, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../Pagination";

const API = "http://localhost:5000/api/donhang";
const API_HOANTIEN = "http://localhost:5000/api/hoantien";

export default function Quanlydh() {
  /* ================= STATE ================= */
  const ITEMS_PER_PAGE = 7;
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showDetail, setShowDetail] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [editForm, setEditForm] = useState({
    tennguoinhan: "",
    sodienthoai: "",
    diachigiao: "",
    ghichu: "",
  });

  /* ================= FETCH (KHÔNG AUTO REFRESH) ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API);
      const data = res.data?.data || [];
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const f = orders.filter((x) =>
      `${x.madonhang}${x.tennguoinhan}${x.sodienthoai}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, orders]);

  /* ================= HELPER UI ================= */
  const actionBtn = (disabled = false) =>
    `w-9 h-9 rounded-lg flex items-center justify-center transition
     ${
       disabled
         ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60"
         : "text-white hover:brightness-110"
     }`;

  /* ================= ACTION LOGIC ================= */
  const submitEditInfo = async () => {
    if (!selectedOrder) return;

    try {
      const payload = {
        tennguoinhan: editForm.tennguoinhan.trim(),
        sodienthoai: editForm.sodienthoai.trim(),
        diachigiao: editForm.diachigiao.trim(),
        ghichu: editForm.ghichu || null,
      };

      if (
        !payload.tennguoinhan ||
        !payload.sodienthoai ||
        !payload.diachigiao
      ) {
        return Swal.fire(
          "Thiếu dữ liệu",
          "Vui lòng nhập đủ thông tin",
          "warning"
        );
      }

      await axios.put(`${API}/sua/${selectedOrder.madonhang}`, payload);

      Swal.fire("Thành công", "Đã cập nhật đơn hàng", "success");
      setShowDetail(false);
      setIsEdit(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err?.response?.data?.message || "Không thể cập nhật",
        "error"
      );
    }
  };

  const adminHuyDon = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận hủy đơn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Không",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API}/admin/huy/${id}`);
      Swal.fire("Thành công", "Đã hủy đơn hàng", "success");
      fetchOrders();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err?.response?.data?.message || "Không thể hủy đơn",
        "error"
      );
    }
  };

  const adminXacNhanDon = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận đơn hàng?",
      text: "Đơn hàng sẽ được trừ kho và chuyển sang trạng thái đã xác nhận",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API}/xacnhan/${id}`);
      Swal.fire("Thành công", "Đã xác nhận đơn hàng", "success");
      fetchOrders();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err?.response?.data?.message || "Không thể xác nhận đơn",
        "error"
      );
    }
  };

  const adminXacNhanHoanTien = async (order) => {
    const mahoantien = order?.mahoantien;

    if (!mahoantien) {
      return Swal.fire("Lỗi", "Không có mã hoàn tiền", "error");
    }

    const confirm = await Swal.fire({
      title: "Xác nhận hoàn tiền ZaloPay?",
      html: `
      <div style="text-align:left">
        <p><b>Mã đơn:</b> ${order?.madonhang}</p>
        <p><b>Mã hoàn tiền:</b> ${mahoantien}</p>
        <p><b>Trạng thái hiện tại:</b> ${order?.trangthai_hoantien || "N/A"}</p>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Đang kiểm tra ZaloPay...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post(
        `${API_HOANTIEN}/admin/check/${mahoantien}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { result } = res.data;
      const subCode = result?.sub_return_code;

      if (subCode === 1) {
        await Swal.fire(
          "Hoàn tiền thành công",
          "ZaloPay đã hoàn tiền xong. Hệ thống đã cập nhật trạng thái.",
          "success"
        );
      } else if (subCode === 2 || subCode === -14) {
        await Swal.fire(
          "Đang hoàn tiền",
          "ZaloPay đang xử lý hoàn tiền, vui lòng kiểm tra lại sau.",
          "info"
        );
      } else {
        await Swal.fire(
          "Hoàn tiền thất bại",
          result?.sub_return_message || "Không xác định",
          "error"
        );
      }

      fetchOrders(); // reload lại danh sách
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err?.response?.data?.message || "Không thể xác nhận hoàn tiền",
        "error"
      );
    }
  };

  /* ================= PAGINATION ================= */
  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filtered.slice(start, start + ITEMS_PER_PAGE);

  /* ================= UI ================= */
  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Quản Lý Đơn Hàng</h1>

      <input
        placeholder="Tìm theo mã đơn, tên, SĐT..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-lg mb-5 w-80"
      />

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-white/5 text-gray-400">
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
            {paginatedOrders.map((x) => {
              const isDaHuy = x.trangthai?.toLowerCase() === "đã hủy";
              const isChoXacNhan =
                x.trangthai?.trim().toLowerCase() === "chờ xác nhận";

              const isHoanTien = x.trangthai_hoantien === "thanh_cong";
              const disableEdit = isDaHuy || isHoanTien;
              const disableCancel = isDaHuy || isHoanTien;

              const daThanhToanZaloPay =
                x.hinhthucthanhtoan === "ZALOPAY" && !!x.zalopay_trans_id;

              const dangHoanTien = x.trangthai_hoantien === "dang_xu_ly";

              const showXacNhanHoanTienBtn =
                daThanhToanZaloPay && dangHoanTien && !!x.mahoantien;

              return (
                <tr key={x.madonhang} className="border-b border-white/5">
                  <td className="p-3 text-center">{x.madonhang}</td>
                  <td className="p-3 text-center">{x.tennguoinhan}</td>
                  <td className="p-3 text-center">{x.sodienthoai}</td>
                  <td className="p-3 text-teal-300 text-center font-bold">
                    {Number(x.tongthanhtoan).toLocaleString()}đ
                  </td>

                  <td className="p-3 text-center">
                    {x.trangthai_hoantien === "dang_xu_ly"
                      ? "Đang hoàn tiền (ZaloPay)"
                      : x.trangthai_hoantien === "thanh_cong"
                      ? "Đã hoàn tiền"
                      : x.trangthai}
                  </td>

                  <td className="p-3">
                    <div className="grid grid-cols-6 gap-2 place-items-center">
                      {/* XEM */}
                      <button
                        className={`${actionBtn(false)} bg-indigo-600`}
                        onClick={() => {
                          setSelectedOrder(x);
                          setShowDetail(true);
                          setIsEdit(false);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {/* XÁC NHẬN */}

                      <button
                        className={`${actionBtn(!isChoXacNhan)} bg-green-600`}
                        disabled={!isChoXacNhan}
                        onClick={() => {
                          if (!isChoXacNhan) return;
                          adminXacNhanDon(x.madonhang);
                        }}
                        title={
                          isChoXacNhan
                            ? "Xác nhận đơn hàng"
                            : "Chỉ xác nhận khi chờ xác nhận"
                        }
                      >
                        <CheckCircle size={16} />
                      </button>

                      {/* SỬA */}
                      <button
                        className={`${actionBtn(disableEdit)} bg-yellow-600`}
                        disabled={disableEdit}
                        onClick={() => {
                          if (disableEdit) return;
                          setSelectedOrder(x);
                          setEditForm({
                            tennguoinhan: x.tennguoinhan || "",
                            sodienthoai: x.sodienthoai || "",
                            diachigiao: x.diachigiao || "",
                            ghichu: x.ghichu || "",
                          });
                          setShowDetail(true);
                          setIsEdit(true);
                        }}
                        title={
                          disableEdit
                            ? "Không thể sửa đơn đã hủy / đã hoàn tiền"
                            : "Sửa đơn"
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      {/* HỦY */}
                      <button
                        className={`${actionBtn(disableCancel)} bg-red-600`}
                        disabled={disableCancel}
                        onClick={() => {
                          if (disableCancel) return;
                          adminHuyDon(x.madonhang);
                        }}
                        title={
                          disableCancel
                            ? "Không thể hủy đơn đã hoàn tiền / đã hủy"
                            : "Hủy đơn"
                        }
                      >
                        <XCircle size={16} />
                      </button>

                      {/* XÁC NHẬN HOÀN TIỀN (ZALOPAY) */}
                      <button
                        className={`${actionBtn(
                          !showXacNhanHoanTienBtn
                        )} bg-emerald-600`}
                        disabled={!showXacNhanHoanTienBtn}
                        onClick={() => {
                          if (!showXacNhanHoanTienBtn) return;
                          adminXacNhanHoanTien(x);
                        }}
                        title={
                          showXacNhanHoanTienBtn
                            ? "Xác nhận hoàn tiền ZaloPay"
                            : "Chỉ hiện khi đơn ZaloPay đang hoàn tiền"
                        }
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* ================= MODAL ================= */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] w-[600px] p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">
              {isEdit ? "Sửa đơn hàng" : "Chi tiết đơn hàng"} #
              {selectedOrder.madonhang}
            </h3>

            {!isEdit ? (
              <>
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
                {selectedOrder?.hinhthucthanhtoan === "ZALOPAY" &&
                  selectedOrder?.trangthai_hoantien === "dang_xu_ly" &&
                  selectedOrder?.mahoantien && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => adminXacNhanHoanTien(selectedOrder)}
                        className="px-4 py-2 bg-emerald-600 rounded-lg text-white hover:brightness-110"
                      >
                        ✅ Xác nhận hoàn tiền ZaloPay
                      </button>
                    </div>
                  )}

                <div className="text-right mt-4">
                  <button
                    onClick={() => setShowDetail(false)}
                    className="px-4 py-2 bg-white/10 rounded-lg"
                  >
                    Đóng
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  className="w-full mb-2 p-2 rounded bg-[#0f0f0f]"
                  placeholder="Người nhận"
                  value={editForm.tennguoinhan}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tennguoinhan: e.target.value })
                  }
                />
                <input
                  className="w-full mb-2 p-2 rounded bg-[#0f0f0f]"
                  placeholder="SĐT"
                  value={editForm.sodienthoai}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sodienthoai: e.target.value })
                  }
                />
                <input
                  className="w-full mb-2 p-2 rounded bg-[#0f0f0f]"
                  placeholder="Địa chỉ"
                  value={editForm.diachigiao}
                  onChange={(e) =>
                    setEditForm({ ...editForm, diachigiao: e.target.value })
                  }
                />
                <textarea
                  className="w-full mb-2 p-2 rounded bg-[#0f0f0f]"
                  placeholder="Ghi chú"
                  value={editForm.ghichu}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ghichu: e.target.value })
                  }
                />

                <div className="text-right mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsEdit(false)}
                    className="px-4 py-2 bg-white/10 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={submitEditInfo}
                    className="px-4 py-2 bg-yellow-600 rounded-lg text-white"
                  >
                    Lưu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
