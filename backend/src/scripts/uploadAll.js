import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";
import db from "../config/db.js";
import { getCloudinaryFolder } from "../utils/locnamnucloudinary.js";

const IMAGE_DIR = "./public/images";

// Map màu → mamausac trong DB
const colorMap = {
  trang: 1,
  den: 2,
  xam: 5,
  do: 4,
  hong: 3,
  xanh: 6,
};

// Regex bắt phần màu
const colorRegex = /-(den|xam|trang|do|hong|xanh)(?:-rach)?-\d+$/i;

async function run() {
  const files = fs.readdirSync(IMAGE_DIR);

  for (const file of files) {
    if (!file.endsWith(".jpg")) continue;

    console.log(`➡ Đang xử lý: ${file}`);

    const name = file.replace(".jpg", "").toLowerCase();
    const parts = name.split("-");

    if (parts.length < 4) {
      console.log(`❌ File không đúng định dạng: ${file}`);
      continue;
    }

    /**
     * 1️⃣ Lấy màu từ cuối file
     */
    const colorMatch = name.match(colorRegex);
    if (!colorMatch) {
      console.log(`❌ Không đọc được màu trong file: ${file}`);
      continue;
    }

    const mausacKey = colorMatch[1]; // den / xam / trang
    const mamausac = colorMap[mausacKey];

    /**
     * 2️⃣ Lấy giới tính (nam/nu)
     */
    let gioitinh = "";
    if (name.includes("-nam-")) gioitinh = "nam";
    else if (name.includes("-nu-")) gioitinh = "nu";
    else {
      console.log(`❌ Không tìm giới tính trong file: ${file}`);
      continue;
    }

    /**
     * 3️⃣ Lấy phần loại (aothun / aokhoac / aopolo ...)
     *    Ví dụ: "aothun-nam-trang-1" → split(`-nam`) → ["aothun", "-trang-1"]
     */
    let loai = name.split(`-${gioitinh}`)[0].trim();

    /** 4️⃣ Chuẩn hoá slug để tìm trong DB */
    const searchSlug = loai
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/_/g, "-")
      .toLowerCase();

    // Ví dụ: aokhoac → "ao-khoac%"
    const [danhmuc] = await db.query(
      "SELECT * FROM danhmuc WHERE slug LIKE ?",
      [`${searchSlug}%`]
    );

    if (danhmuc.length === 0) {
      console.log(`❌ Không tìm thấy danh mục DB cho loại: ${loai}`);
      continue;
    }

    const madanhmuc = danhmuc[0].madanhmuc;
    const tendanhmuc = danhmuc[0].tendanhmuc;

    /** 5️⃣ Tìm tất cả biến thể trong danh mục + màu */
    const [variants] = await db.query(
      "SELECT mabienthe FROM bienthesanpham WHERE masanpham IN (SELECT masanpham FROM sanpham WHERE madanhmuc = ?) AND mamausac = ?",
      [madanhmuc, mamausac]
    );

    if (variants.length === 0) {
      console.log(`❌ Không tìm biến thể cùng màu cho: ${file}`);
      continue;
    }

    /** 6️⃣ Tạo folder upload */
    const folder = getCloudinaryFolder(gioitinh, tendanhmuc);

    /** 7️⃣ Upload */
    const upload = await cloudinary.uploader.upload(
      path.join(IMAGE_DIR, file),
      { folder }
    );

    console.log(`✔ Uploaded: ${upload.secure_url}`);

    /** 8️⃣ Gắn ảnh vào DB */
    for (const v of variants) {
      await db.query(
        "INSERT INTO hinhanh (mabienthe, urlhinhanh, stt) VALUES (?, ?, ?)",
        [v.mabienthe, upload.secure_url, 1]
      );
    }

    console.log(`✔ Đã gán ảnh cho ${variants.length} biến thể`);
  }
}

run();
//C:\wamp64\www\hehe\backend>node src/scripts/uploadAll.js
