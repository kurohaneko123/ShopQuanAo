import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Printer } from "lucide-react";
import Swal from "sweetalert2";

export default function HoaDonChiTiet() {
  const { madonhang } = useParams();
  const location = useLocation();

  // nếu DonHang.jsx có truyền state { order: o } thì lấy luôn
  const orderFromState = location.state?.order;

  const [order, setOrder] = useState(orderFromState || null);
  const [items, setItems] = useState(orderFromState?.danhsachsanpham || []);
  const [loading, setLoading] = useState(!orderFromState);

  const token = localStorage.getItem("token");

  // API em chỉnh theo đúng backend của em
  const BASE_URL = "http://localhost:5000/api/donhang";
  const getStatusBadge = (tt = "") => {
    const s = tt.toLowerCase();

    if (s.includes("chờ"))
      return "text-[rgb(60,110,190)] bg-[rgb(220,235,250)] border border-[rgb(190,215,245)]";

    if (s.includes("xác nhận"))
      return "text-blue-700 bg-blue-100 border border-blue-300";

    if (s.includes("đang"))
      return "text-purple-700 bg-purple-100 border border-purple-200";

    if (s.includes("giao"))
      return "text-emerald-700 bg-emerald-100 border border-emerald-200";

    if (s.includes("hủy"))
      return "text-red-700 bg-red-100 border border-red-200";

    return "text-gray-600 bg-gray-100 border";
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        // Nếu đã có items từ state thì không cần fetch nữa
        if (orderFromState?.danhsachsanpham?.length) {
          setOrder(orderFromState);
          setItems(orderFromState.danhsachsanpham);
          return;
        }

        //  Endpoint gợi ý: /donhang/chitiet/:madonhang
        // Nếu backend em khác thì đổi path cho đúng
        const res = await axios.get(
          `http://localhost:5000/api/donhang/${madonhang}/chitiet`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Kỳ vọng trả về kiểu:
        // { data: { order: {...}, items: [...] } }

        const payload = res.data;
        setOrder(payload || null);
        setItems(payload?.danhsachsanpham || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi!", "Không lấy được chi tiết hóa đơn.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // eslint-disable-next-line
  }, [madonhang]);

  const tongHang = useMemo(() => {
    return (items || []).reduce((sum, it) => {
      const gia = Number(
        it.gia || it.dongia || it.giasaukhuyenmai || it.price || 0
      );

      const sl = Number(it.soluong || it.quantity || 0);
      return sum + gia * sl;
    }, 0);
  }, [items]);

  const phiShip = Number(order?.phiship || order?.shipping_fee || 0);
  const giamGia = Number(order?.giamgia || order?.discount || 0);

  const tongThanhToan = useMemo(() => {
    const raw = tongHang + phiShip - giamGia;
    return raw > 0 ? raw : 0;
  }, [tongHang, phiShip, giamGia]);
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <p className="text-slate-600">Đang tải hóa đơn…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-28 max-w-4xl mx-auto px-4">
        <p className="text-slate-700">Không tìm thấy hóa đơn.</p>
        <Link to="/donhang" className="text-blue-600 hover:underline">
          Quay lại đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/donhang"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Quay lại
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
  bg-[rgb(60,110,190)] text-white hover:bg-blue-700 shadow transition"
          >
            <Printer size={18} />
            In hóa đơn
          </button>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl
        bg-[rgb(220,235,250)] text-[rgb(60,110,190)] shadow"
                    >
                      #
                    </span>
                    Hóa đơn #{order.madonhang}
                  </h1>

                  <p className="text-sm text-gray-500">
                    Ngày tạo: {formatDate(order?.ngaytao)}
                  </p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(
                      order.trangthai
                    )}`}
                  >
                    {order.trangthai}
                  </span>
                </div>

                <div className="text-sm text-slate-700 space-y-1 text-right">
                  <p>
                    <span className="text-slate-500">Thanh toán:</span>{" "}
                    <span className="font-semibold">
                      {order.hinhthucthanhtoan}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Vận chuyển:</span>{" "}
                    <span className="font-semibold">
                      {order.donvivanchuyen}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-4 border">
              <p className="text-slate-500 mb-1">Người nhận</p>
              <p className="font-semibold text-slate-900">
                {order.tennguoinhan}
              </p>
              <p className="text-slate-700 mt-1">{order.sodienthoai}</p>
              <p className="text-slate-700 mt-1">{order.diachigiao}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border">
              <p className="text-slate-500 mb-1">Ghi chú</p>
              <p className="text-slate-800">
                {order.ghichu || order.note || "Không có"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Danh sách sản phẩm
            </h2>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-[rgb(220,235,250)] text-[rgb(60,110,190)]">
                  <tr className="text-left text-slate-600">
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3">Phân loại</th>
                    <th className="p-3 text-right">Đơn giá</th>
                    <th className="p-3 text-right">SL</th>
                    <th className="p-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(items || []).map((it, idx) => {
                    const ten = it.tensanpham || it.name || "Sản phẩm";
                    const mau = it.mau || it.color || "";
                    const size = it.size || "";
                    const phanloai =
                      [mau, size].filter(Boolean).join(" / ") || "—";

                    const gia = Number(
                      it.gia || it.giasanpham || it.price || 0
                    );
                    const sl = Number(it.soluong || it.quantity || 0);
                    const thanhTien = gia * sl;

                    return (
                      <tr key={idx} className="border-t">
                        <td className="p-3 font-medium text-slate-900">
                          {ten}
                        </td>
                        <td className="p-3 text-slate-600">{phanloai}</td>
                        <td className="p-3 text-right">
                          {gia.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="p-3 text-right">{sl}</td>
                        <td className="p-3 text-right font-semibold">
                          {thanhTien.toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                    );
                  })}

                  {(!items || items.length === 0) && (
                    <tr>
                      <td className="p-4 text-slate-600" colSpan={5}>
                        Không có sản phẩm trong hóa đơn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 flex flex-col md:flex-row md:justify-end">
            <div className="w-full md:w-[380px] bg-[rgb(220,235,250)] border border-[rgb(190,215,245)] rounded-2xl p-5 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Tổng hàng</span>
                <span className="font-semibold">
                  {tongHang.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-600">Phí ship</span>
                <span className="font-semibold">
                  {phiShip.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-600">Giảm giá</span>
                <span className="font-semibold">
                  -{giamGia.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between py-2 text-lg">
                <span className="text-[rgb(60,110,190)] font-bold">
                  Tổng thanh toán
                </span>
                <span className="text-[rgb(60,110,190)] font-extrabold text-xl">
                  {tongThanhToan.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>

          {/* Optional: show server total for sanity */}
          {order.tongthanhtoan != null && (
            <p className="text-xs text-slate-500 mt-3">
              (Server báo tổng thanh toán:{" "}
              {Number(order.tongthanhtoan).toLocaleString("vi-VN")}₫)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
