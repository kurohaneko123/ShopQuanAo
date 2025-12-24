import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function LienHe() {
  return (
    <section className="min-h-screen pt-28 pb-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-center text-black-700 mb-10">
          Liên hệ với Horizon
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Thông tin liên hệ */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Thông tin liên hệ
            </h2>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1" />
              <p className="text-gray-700">
                <strong>Địa chỉ:</strong> 180 Cao Lỗ, Phường Chánh Hưng, Quận 8,
                TP.HCM
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1" />
              <p className="text-gray-700">
                <strong>Hotline:</strong> 0901 234 567 – 0938 765 432
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" />
              <p className="text-gray-700">
                <strong>Email:</strong> support@horizonmate.vn
              </p>
            </div>

            <p className="text-gray-600 mt-6">
              Nếu bạn có bất kỳ thắc mắc nào về sản phẩm, đơn hàng, hoặc cần hỗ
              trợ kỹ thuật, hãy liên hệ với chúng tôi qua các kênh trên. Đội ngũ
              Horizon luôn sẵn sàng hỗ trợ bạn!
            </p>
          </div>

          {/* Google Map */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Đại+học+Công+Nghệ+Sài+Gòn+180+Cao+Lỗ,+Phường+4,+Quận+8,+TP.HCM&output=embed"
              width="100%"
              height="400"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Form liên hệ */}
        {/* <div className="mt-16 bg-white p-8 rounded-xl shadow-md"> */}
        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Gửi tin nhắn cho chúng tôi
          </h2>

          <form className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Họ và tên"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Chủ đề"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <textarea
              placeholder="Nội dung tin nhắn"
              className="md:col-span-2 border rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              GỬI LIÊN HỆ
            </button>
          </form> */}
        {/* </div> */}
      </div>
    </section>
  );
}
