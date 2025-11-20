export function getCloudinaryFolder(gioitinh, tendanhmuc) {
  const lower = tendanhmuc.toLowerCase();

  let genderFolder = "Nu";
  if (lower.includes("nam")) genderFolder = "Nam"; // <--- FIX ở đây

  let cateFolder = "Khac";

  if (lower.includes("áo thun")) cateFolder = "AoThun";
  else if (lower.includes("áo cotton")) cateFolder = "AoCotton";
  else if (lower.includes("sơ mi")) cateFolder = "SoMi";
  else if (lower.includes("quần short")) cateFolder = "QuanShort";
  else if (lower.includes("quần jean")) cateFolder = "QuanJean";
  else if (lower.includes("đầm")) cateFolder = "Dam";
  else if (lower.includes("váy")) cateFolder = "ChanVay";
  else if (lower.includes("khoác")) cateFolder = "Khoac";

  return `ShopQuanAo/${genderFolder}/${cateFolder}`;
}
