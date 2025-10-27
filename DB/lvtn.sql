-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th10 27, 2025 lúc 04:24 PM
-- Phiên bản máy phục vụ: 8.3.0
-- Phiên bản PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `lvtn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bienthesanpham`
--

DROP TABLE IF EXISTS `bienthesanpham`;
CREATE TABLE IF NOT EXISTS `bienthesanpham` (
  `mabienthe` int NOT NULL AUTO_INCREMENT,
  `masanpham` int DEFAULT NULL,
  `makichthuoc` int DEFAULT NULL,
  `mamausac` int DEFAULT NULL,
  `soluongton` int DEFAULT '0',
  `giaban` decimal(10,2) DEFAULT NULL,
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `trangthaihoatdongbtsp` enum('hoạt động','không hoạt động') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
  PRIMARY KEY (`mabienthe`),
  KEY `masanpham` (`masanpham`),
  KEY `makichthuoc` (`makichthuoc`),
  KEY `mamausac` (`mamausac`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bienthesanpham`
--

INSERT INTO `bienthesanpham` (`mabienthe`, `masanpham`, `makichthuoc`, `mamausac`, `soluongton`, `giaban`, `ngaytao`, `trangthaihoatdongbtsp`) VALUES
(1, 1, 2, 1, 50, 199000.00, '2025-10-27 16:14:10', 'hoạt động'),
(2, 1, 3, 2, 40, 199000.00, '2025-10-27 16:14:10', 'hoạt động'),
(3, 2, 2, 3, 30, 259000.00, '2025-10-27 16:14:10', 'hoạt động'),
(4, 2, 3, 1, 25, 259000.00, '2025-10-27 16:14:10', 'hoạt động'),
(5, 3, 3, 2, 20, 399000.00, '2025-10-27 16:14:10', 'hoạt động'),
(6, 3, 4, 5, 15, 399000.00, '2025-10-27 16:14:10', 'hoạt động'),
(7, 4, 3, 4, 25, 499000.00, '2025-10-27 16:14:10', 'hoạt động'),
(8, 4, 4, 2, 15, 499000.00, '2025-10-27 16:14:10', 'hoạt động');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE IF NOT EXISTS `chitietdonhang` (
  `machitietdonhang` int NOT NULL AUTO_INCREMENT,
  `madonhang` int DEFAULT NULL,
  `mabienthe` int DEFAULT NULL,
  `soluong` int DEFAULT NULL,
  `giagoc` decimal(15,2) DEFAULT NULL,
  `loaikhuyenmai` enum('%','tiền') DEFAULT NULL,
  `giakhuyenmai` decimal(15,2) DEFAULT '0.00',
  `giasaukhuyenmai` decimal(15,2) DEFAULT NULL,
  `ghichu` text,
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`machitietdonhang`),
  KEY `chitietdonhang_ibfk_1` (`madonhang`),
  KEY `chitietdonhang_ibfk_2` (`mabienthe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
CREATE TABLE IF NOT EXISTS `danhmuc` (
  `madanhmuc` int NOT NULL AUTO_INCREMENT,
  `tendanhmuc` varchar(250) NOT NULL,
  `ngaytao` timestamp NOT NULL,
  `slug` varchar(250) NOT NULL,
  PRIMARY KEY (`madanhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`madanhmuc`, `tendanhmuc`, `ngaytao`, `slug`) VALUES
(1, 'Áo thun nam', '2025-10-27 16:04:32', 'ao-thun-nam'),
(2, 'Áo sơ mi nữ', '2025-10-27 16:04:32', 'ao-so-mi-nu'),
(3, 'Quần jeans', '2025-10-27 16:04:32', 'quan-jeans'),
(4, 'Áo khoác', '2025-10-27 16:04:32', 'ao-khoac'),
(5, 'Đầm váy', '2025-10-27 16:04:32', 'dam-vay'),
(6, 'Phụ kiện', '2025-10-27 16:04:32', 'phu-kien'),
(7, 'Giày dép', '2025-10-27 16:04:32', 'giay-dep'),
(8, 'Áo polo', '2025-10-27 16:04:32', 'ao-polo');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

DROP TABLE IF EXISTS `donhang`;
CREATE TABLE IF NOT EXISTS `donhang` (
  `madonhang` int NOT NULL AUTO_INCREMENT,
  `manguoidung` int DEFAULT NULL,
  `tennguoinhan` varchar(250) DEFAULT NULL,
  `sodienthoai` varchar(20) DEFAULT NULL,
  `diachigiao` text,
  `donvivanchuyen` varchar(250) DEFAULT NULL,
  `ngaydukiengiao` datetime DEFAULT NULL,
  `hinhthucthanhtoan` varchar(250) DEFAULT NULL,
  `dathanhtoan` tinyint(1) DEFAULT '0',
  `ngaythanhtoan` datetime DEFAULT NULL,
  `tongtien` decimal(15,2) DEFAULT NULL,
  `phivanchuyen` decimal(15,2) DEFAULT NULL,
  `tongthanhtoan` decimal(15,2) DEFAULT NULL,
  `trangthai` enum('Chờ xác nhận','Đã xác nhận','Đang chuẩn bị hàng','Đang giao hàng','Giao thành công','Đã hủy','Hoàn hàng') DEFAULT 'Chờ xác nhận',
  `ghichu` text,
  `ngaytao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`madonhang`),
  KEY `donhang_ibfk_1` (`manguoidung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinhanh`
--

DROP TABLE IF EXISTS `hinhanh`;
CREATE TABLE IF NOT EXISTS `hinhanh` (
  `mahinhanh` int NOT NULL AUTO_INCREMENT,
  `mabienthe` int DEFAULT NULL,
  `urlhinhanh` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stt` int DEFAULT NULL,
  PRIMARY KEY (`mahinhanh`),
  KEY `mabienthe` (`mabienthe`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinhanh`
--

INSERT INTO `hinhanh` (`mahinhanh`, `mabienthe`, `urlhinhanh`, `ngaytao`, `stt`) VALUES
(1, 1, 'https://cdn.shopthucong.com/images/ao-thun-trang-1.jpg', '2025-10-27 16:16:24', 1),
(2, 1, 'https://cdn.shopthucong.com/images/ao-thun-trang-2.jpg', '2025-10-27 16:16:24', 2),
(3, 2, 'https://cdn.shopthucong.com/images/ao-thun-den-1.jpg', '2025-10-27 16:16:24', 1),
(4, 3, 'https://cdn.shopthucong.com/images/so-mi-be-1.jpg', '2025-10-27 16:16:24', 1),
(5, 5, 'https://cdn.shopthucong.com/images/quan-jeans-den-1.jpg', '2025-10-27 16:16:24', 1),
(6, 5, 'https://cdn.shopthucong.com/images/quan-jeans-den-2.jpg', '2025-10-27 16:16:24', 2),
(7, 7, 'https://cdn.shopthucong.com/images/ao-khoac-navy-1.jpg', '2025-10-27 16:16:24', 1),
(8, 7, 'https://cdn.shopthucong.com/images/ao-khoac-navy-2.jpg', '2025-10-27 16:16:24', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kichthuoc`
--

DROP TABLE IF EXISTS `kichthuoc`;
CREATE TABLE IF NOT EXISTS `kichthuoc` (
  `makichthuoc` int NOT NULL AUTO_INCREMENT,
  `tenkichthuoc` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text COLLATE utf8mb4_unicode_ci,
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`makichthuoc`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `kichthuoc`
--

INSERT INTO `kichthuoc` (`makichthuoc`, `tenkichthuoc`, `mota`, `ngaytao`) VALUES
(1, 'S', 'Cỡ nhỏ – phù hợp dáng người nhỏ gọn', '2025-10-27 16:10:32'),
(2, 'M', 'Cỡ trung bình – vừa vặn cho đa số', '2025-10-27 16:10:32'),
(3, 'L', 'Cỡ lớn – thoải mái, phổ biến nhất', '2025-10-27 16:10:32'),
(4, 'XL', 'Cỡ rất lớn – form rộng, phong cách unisex', '2025-10-27 16:10:32'),
(5, '2XL', 'Cỡ ngoại cỡ – dành cho dáng người to hơn', '2025-10-27 16:10:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mausac`
--

DROP TABLE IF EXISTS `mausac`;
CREATE TABLE IF NOT EXISTS `mausac` (
  `mamausac` int NOT NULL AUTO_INCREMENT,
  `tenmausac` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text COLLATE utf8mb4_unicode_ci,
  `hexcode` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mamausac`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `mausac`
--

INSERT INTO `mausac` (`mamausac`, `tenmausac`, `mota`, `hexcode`, `ngaytao`) VALUES
(1, 'Trắng', 'Màu trắng tinh khôi, dễ phối với mọi trang phục', '#FFFFFF', '2025-10-27 16:12:17'),
(2, 'Đen', 'Màu đen cổ điển, mang lại cảm giác sang trọng', '#000000', '2025-10-27 16:12:17'),
(3, 'Be', 'Màu be nhẹ nhàng, phù hợp phong cách tối giản', '#F5F5DC', '2025-10-27 16:12:17'),
(4, 'Xanh Navy', 'Màu xanh đậm thanh lịch, hợp thời trang nam/nữ', '#001F3F', '2025-10-27 16:12:17'),
(5, 'Xám Tro', 'Màu xám trung tính, mang phong cách hiện đại', '#808080', '2025-10-27 16:12:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE IF NOT EXISTS `nguoidung` (
  `manguoidung` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matkhau` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoten` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sodienthoai` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diachi` text COLLATE utf8mb4_unicode_ci,
  `vaitro` enum('client','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `trangthai` enum('hoạt động','không hoạt động') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`manguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE IF NOT EXISTS `sanpham` (
  `masanpham` int NOT NULL AUTO_INCREMENT,
  `tensanpham` varchar(250) NOT NULL,
  `thuonghieu` varchar(250) NOT NULL,
  `mota` varchar(250) NOT NULL,
  `chatlieu` varchar(250) NOT NULL,
  `kieudang` varchar(250) NOT NULL,
  `baoquan` varchar(250) NOT NULL,
  `ngaytao` timestamp NOT NULL,
  `ngaycapnhat` timestamp NULL DEFAULT NULL,
  `madanhmuc` int NOT NULL,
  PRIMARY KEY (`masanpham`),
  KEY `madanhmuc` (`madanhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`masanpham`, `tensanpham`, `thuonghieu`, `mota`, `chatlieu`, `kieudang`, `baoquan`, `ngaytao`, `ngaycapnhat`, `madanhmuc`) VALUES
(1, 'Áo Thun Nam Basic Cotton', 'Coolmate', 'Áo thun cotton thoáng mát, form rộng trẻ trung.', 'Cotton 100%', 'Regular Fit', 'Giặt máy, không tẩy', '2025-10-27 16:06:48', NULL, 1),
(2, 'Áo Sơ Mi Nữ Tay Dài Trắng', 'Routine', 'Thiết kế thanh lịch, dễ phối đồ, phù hợp môi trường công sở.', 'Vải lanh pha polyester', 'Slim Fit', 'Giặt tay, không vắt mạnh', '2025-10-27 16:06:48', NULL, 2),
(3, 'Quần Jeans Nam Xanh Đậm Rách Nhẹ', 'Levis', 'Chất denim co giãn nhẹ, phong cách năng động.', 'Denim co giãn', 'Slim Taper', 'Giặt trong nước lạnh', '2025-10-27 16:06:48', NULL, 3),
(4, 'Áo Khoác Nam Dù Chống Nước', 'YODY', 'Áo khoác chống gió, chống nước nhẹ, thích hợp đi chơi hoặc đi học.', 'Polyester cao cấp', 'Bomber', 'Phơi nơi thoáng mát', '2025-10-27 16:06:48', NULL, 4),
(5, 'Đầm Nữ Hoa Nhí Dáng Xòe', 'IVY Moda', 'Đầm hoa nhí dịu dàng, tôn dáng, phù hợp đi dạo hoặc dự tiệc nhẹ.', 'Voan mềm', 'Xòe', 'Giặt nhẹ, không sấy', '2025-10-27 16:06:48', NULL, 5),
(6, 'Thắt Lưng Da Nam Màu Đen', 'Pedro', 'Thắt lưng da bò thật, bền đẹp, khóa kim loại sáng bóng.', 'Da bò thật', 'Cổ điển', 'Tránh ẩm mốc, lau bằng khăn khô', '2025-10-27 16:06:48', NULL, 6),
(7, 'Giày Sneaker Trắng Classic', 'Adidas', 'Giày sneaker trắng cổ điển, dễ phối đồ, êm ái khi di chuyển.', 'Da tổng hợp & vải lưới', 'Low-top', 'Tránh ngâm nước', '2025-10-27 16:06:48', NULL, 7),
(8, 'Áo Polo Nam Cá Sấu Xanh Navy', 'Lacoste', 'Áo polo chất cá sấu cao cấp, logo thêu tinh tế.', 'Cotton pique', 'Regular Fit', 'Giặt nhẹ, không ủi trực tiếp lên logo', '2025-10-27 16:06:48', NULL, 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

DROP TABLE IF EXISTS `voucher`;
CREATE TABLE IF NOT EXISTS `voucher` (
  `mavoucher` int NOT NULL AUTO_INCREMENT,
  `magiamgia` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mota` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loaikhuyenmai` enum('tiền','%') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tiền',
  `giatrigiam` int DEFAULT NULL,
  `giantoida` int DEFAULT NULL,
  `dontoithieu` int DEFAULT NULL,
  `apdungtoanbo` tinyint(1) DEFAULT NULL,
  `masanpham` int DEFAULT NULL,
  `madanhmuc` int DEFAULT NULL,
  `ngaybatdau` timestamp NULL DEFAULT NULL,
  `ngayketthuc` timestamp NULL DEFAULT NULL,
  `trangthai` enum('hoạt động','hết hạn','vô hiệu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
  `ngaytao` timestamp NOT NULL,
  PRIMARY KEY (`mavoucher`),
  UNIQUE KEY `magiamgia` (`magiamgia`),
  KEY `masanpham` (`masanpham`),
  KEY `madanhmuc` (`madanhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`mavoucher`, `magiamgia`, `mota`, `loaikhuyenmai`, `giatrigiam`, `giantoida`, `dontoithieu`, `apdungtoanbo`, `masanpham`, `madanhmuc`, `ngaybatdau`, `ngayketthuc`, `trangthai`, `ngaytao`) VALUES
(5, 'SALE20', 'Giảm 20% cho toàn bộ sản phẩm trong cửa hàng', '%', 20, 100000, 200000, 1, NULL, NULL, '2025-09-30 17:00:00', '2025-12-31 16:59:59', 'hoạt động', '0000-00-00 00:00:00'),
(6, 'THUN15', 'Giảm 15% cho tất cả sản phẩm trong danh mục Áo thun nam', '%', 15, 80000, 200000, 0, NULL, 1, '2025-10-26 17:00:00', '2025-12-31 16:59:59', 'hoạt động', '0000-00-00 00:00:00');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bienthesanpham`
--
ALTER TABLE `bienthesanpham`
  ADD CONSTRAINT `FK_makichthuoc` FOREIGN KEY (`makichthuoc`) REFERENCES `kichthuoc` (`makichthuoc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_mamausac(btsp)` FOREIGN KEY (`mamausac`) REFERENCES `mausac` (`mamausac`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_msp2(btsp)` FOREIGN KEY (`masanpham`) REFERENCES `sanpham` (`masanpham`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `chitietdonhang_ibfk_1` FOREIGN KEY (`madonhang`) REFERENCES `donhang` (`madonhang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chitietdonhang_ibfk_2` FOREIGN KEY (`mabienthe`) REFERENCES `bienthesanpham` (`mabienthe`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`manguoidung`) REFERENCES `nguoidung` (`manguoidung`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hinhanh`
--
ALTER TABLE `hinhanh`
  ADD CONSTRAINT `FK_mabienthe` FOREIGN KEY (`mabienthe`) REFERENCES `bienthesanpham` (`mabienthe`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `FK_mdm` FOREIGN KEY (`madanhmuc`) REFERENCES `danhmuc` (`madanhmuc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD CONSTRAINT `FK_madanhmuc` FOREIGN KEY (`madanhmuc`) REFERENCES `danhmuc` (`madanhmuc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_masanpham` FOREIGN KEY (`masanpham`) REFERENCES `sanpham` (`masanpham`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
