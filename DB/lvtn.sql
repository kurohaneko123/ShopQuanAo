-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th10 21, 2025 lúc 02:43 PM
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
  `trangthaihoatdongbtsp` enum('hoạt động','không hoạt động') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
  PRIMARY KEY (`mabienthe`),
  KEY `masanpham` (`masanpham`),
  KEY `makichthuoc` (`makichthuoc`),
  KEY `mamausac` (`mamausac`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bienthesanpham`
--

INSERT INTO `bienthesanpham` (`mabienthe`, `masanpham`, `makichthuoc`, `mamausac`, `soluongton`, `giaban`, `ngaytao`, `trangthaihoatdongbtsp`) VALUES
(9, 1, 2, 1, 50, 199000.00, '2025-11-04 18:29:05', 'hoạt động'),
(10, 1, 3, 1, 50, 199000.00, '2025-11-04 18:29:05', 'hoạt động'),
(11, 1, 2, 2, 50, 199000.00, '2025-11-04 18:29:05', 'hoạt động'),
(12, 1, 3, 2, 50, 199000.00, '2025-11-04 18:29:05', 'hoạt động'),
(13, 2, 2, 2, 50, 199000.00, '2025-11-19 18:37:54', 'hoạt động'),
(14, 2, 2, 5, 50, 199000.00, '2025-11-19 18:37:54', 'hoạt động'),
(15, 2, 3, 2, 50, 199000.00, '2025-11-19 18:37:54', 'hoạt động'),
(16, 2, 3, 5, 50, 199000.00, '2025-11-19 18:37:54', 'hoạt động'),
(17, 3, 2, 2, 50, 199000.00, '2025-11-19 18:38:13', 'hoạt động'),
(18, 3, 2, 5, 50, 199000.00, '2025-11-19 18:38:13', 'hoạt động'),
(19, 3, 3, 2, 50, 199000.00, '2025-11-19 18:38:13', 'hoạt động'),
(20, 3, 3, 5, 50, 199000.00, '2025-11-19 18:38:13', 'hoạt động'),
(21, 4, 2, 4, 50, 199000.00, '2025-11-19 18:38:25', 'hoạt động'),
(22, 4, 2, 5, 50, 199000.00, '2025-11-19 18:38:25', 'hoạt động'),
(23, 4, 3, 4, 50, 199000.00, '2025-11-19 18:38:25', 'hoạt động'),
(24, 4, 3, 5, 50, 199000.00, '2025-11-19 18:38:25', 'hoạt động'),
(25, 5, 2, 2, 50, 199000.00, '2025-11-19 18:38:39', 'hoạt động'),
(26, 5, 2, 4, 50, 199000.00, '2025-11-19 18:38:39', 'hoạt động'),
(27, 5, 3, 2, 50, 199000.00, '2025-11-19 18:38:39', 'hoạt động'),
(28, 5, 3, 4, 50, 199000.00, '2025-11-19 18:38:39', 'hoạt động'),
(29, 8, 2, 2, 50, 199000.00, '2025-11-19 18:38:48', 'hoạt động'),
(30, 8, 2, 5, 50, 199000.00, '2025-11-19 18:38:48', 'hoạt động'),
(31, 8, 3, 2, 50, 199000.00, '2025-11-19 18:38:48', 'hoạt động'),
(32, 8, 3, 5, 50, 199000.00, '2025-11-19 18:38:48', 'hoạt động');

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
  `gioitinh` enum('Nam','Nu') NOT NULL,
  PRIMARY KEY (`madanhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`madanhmuc`, `tendanhmuc`, `ngaytao`, `slug`, `gioitinh`) VALUES
(1, 'Áo thun nam', '2025-11-20 07:07:54', 'aothun-nam', 'Nam'),
(2, 'Áo sơ mi nữ', '2025-11-20 07:08:00', 'aosomi-nu', 'Nu'),
(3, 'Quần jeans nam', '2025-11-20 07:08:04', 'quanjeans-nam', 'Nam'),
(4, 'Áo khoác nam', '2025-11-20 07:08:10', 'aokhoac-nam', 'Nam'),
(5, 'Đầm váy nữ', '2025-11-20 07:08:16', 'damvay-nu', 'Nu'),
(8, 'Áo polo nam', '2025-11-20 07:08:21', 'aopolo-nam', 'Nam');

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
  `urlhinhanh` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stt` int DEFAULT NULL,
  PRIMARY KEY (`mahinhanh`),
  KEY `mabienthe` (`mabienthe`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinhanh`
--

INSERT INTO `hinhanh` (`mahinhanh`, `mabienthe`, `urlhinhanh`, `ngaytao`, `stt`) VALUES
(71, 21, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624394/ShopQuanAo/Nam/Khoac/ax7etutrwtlvl6ue2xmb.jpg', '2025-11-20 07:39:55', 1),
(72, 23, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624394/ShopQuanAo/Nam/Khoac/ax7etutrwtlvl6ue2xmb.jpg', '2025-11-20 07:39:55', 1),
(73, 21, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624395/ShopQuanAo/Nam/Khoac/t9zptzkg8o6jwj9fqvlv.jpg', '2025-11-20 07:39:56', 1),
(74, 23, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624395/ShopQuanAo/Nam/Khoac/t9zptzkg8o6jwj9fqvlv.jpg', '2025-11-20 07:39:56', 1),
(75, 22, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624396/ShopQuanAo/Nam/Khoac/whusgkofdbdxurwunxni.jpg', '2025-11-20 07:39:57', 1),
(76, 24, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624396/ShopQuanAo/Nam/Khoac/whusgkofdbdxurwunxni.jpg', '2025-11-20 07:39:57', 1),
(77, 22, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624397/ShopQuanAo/Nam/Khoac/ba8dxoubwrgjfhxt3gcl.jpg', '2025-11-20 07:39:58', 1),
(78, 24, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624397/ShopQuanAo/Nam/Khoac/ba8dxoubwrgjfhxt3gcl.jpg', '2025-11-20 07:39:58', 1),
(79, 29, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624398/ShopQuanAo/Nam/Khac/qqpyzyxxntpdpz2dlazz.webp', '2025-11-20 07:39:59', 1),
(80, 31, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624398/ShopQuanAo/Nam/Khac/qqpyzyxxntpdpz2dlazz.webp', '2025-11-20 07:39:59', 1),
(81, 29, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624399/ShopQuanAo/Nam/Khac/jvpowbo87epiyztl8ip5.webp', '2025-11-20 07:40:00', 1),
(82, 31, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624399/ShopQuanAo/Nam/Khac/jvpowbo87epiyztl8ip5.webp', '2025-11-20 07:40:00', 1),
(83, 30, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624400/ShopQuanAo/Nam/Khac/klrajmplxlssdk9k7nbz.jpg', '2025-11-20 07:40:01', 1),
(84, 32, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624400/ShopQuanAo/Nam/Khac/klrajmplxlssdk9k7nbz.jpg', '2025-11-20 07:40:01', 1),
(85, 30, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624401/ShopQuanAo/Nam/Khac/vubzrh3f0pwtfmg8dfn7.jpg', '2025-11-20 07:40:02', 1),
(86, 32, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624401/ShopQuanAo/Nam/Khac/vubzrh3f0pwtfmg8dfn7.jpg', '2025-11-20 07:40:02', 1),
(87, 13, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624402/ShopQuanAo/Nu/SoMi/vhrmxy5rmoezpzlygyoh.webp', '2025-11-20 07:40:03', 1),
(88, 15, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624402/ShopQuanAo/Nu/SoMi/vhrmxy5rmoezpzlygyoh.webp', '2025-11-20 07:40:03', 1),
(89, 13, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624404/ShopQuanAo/Nu/SoMi/myiougwkeogsh2lsxaih.webp', '2025-11-20 07:40:05', 1),
(90, 15, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624404/ShopQuanAo/Nu/SoMi/myiougwkeogsh2lsxaih.webp', '2025-11-20 07:40:05', 1),
(91, 14, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624405/ShopQuanAo/Nu/SoMi/xbmmgijcclrmah6qqjbe.webp', '2025-11-20 07:40:06', 1),
(92, 16, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624405/ShopQuanAo/Nu/SoMi/xbmmgijcclrmah6qqjbe.webp', '2025-11-20 07:40:06', 1),
(93, 14, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624406/ShopQuanAo/Nu/SoMi/uylcdjypxa6pcxkh4dcb.webp', '2025-11-20 07:40:08', 1),
(94, 16, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624406/ShopQuanAo/Nu/SoMi/uylcdjypxa6pcxkh4dcb.webp', '2025-11-20 07:40:08', 1),
(99, 25, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624409/ShopQuanAo/Nu/Dam/nlj9a8d4pim5o84up5rq.webp', '2025-11-20 07:40:11', 1),
(100, 27, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624409/ShopQuanAo/Nu/Dam/nlj9a8d4pim5o84up5rq.webp', '2025-11-20 07:40:11', 1),
(101, 25, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624411/ShopQuanAo/Nu/Dam/izf43kslu1qqxnfok8bo.webp', '2025-11-20 07:40:11', 1),
(102, 27, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624411/ShopQuanAo/Nu/Dam/izf43kslu1qqxnfok8bo.webp', '2025-11-20 07:40:11', 1),
(103, 26, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624411/ShopQuanAo/Nu/Dam/nczx5mkpbfql6nxgcr58.jpg', '2025-11-20 07:40:12', 1),
(104, 28, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624411/ShopQuanAo/Nu/Dam/nczx5mkpbfql6nxgcr58.jpg', '2025-11-20 07:40:12', 1),
(105, 26, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624412/ShopQuanAo/Nu/Dam/jonfksnzr1ti8cwy86ai.jpg', '2025-11-20 07:40:14', 1),
(106, 28, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624412/ShopQuanAo/Nu/Dam/jonfksnzr1ti8cwy86ai.jpg', '2025-11-20 07:40:14', 1),
(107, 17, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624414/ShopQuanAo/Nam/QuanJean/a9ijgnmgyzaukiwa81g5.jpg', '2025-11-20 07:40:15', 1),
(108, 19, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624414/ShopQuanAo/Nam/QuanJean/a9ijgnmgyzaukiwa81g5.jpg', '2025-11-20 07:40:15', 1),
(109, 17, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624415/ShopQuanAo/Nam/QuanJean/xoygcxphvhonzsxqkys7.jpg', '2025-11-20 07:40:16', 1),
(110, 19, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624415/ShopQuanAo/Nam/QuanJean/xoygcxphvhonzsxqkys7.jpg', '2025-11-20 07:40:16', 1),
(111, 18, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624416/ShopQuanAo/Nam/QuanJean/kflqafri4ykgnzuwfk8y.png', '2025-11-20 07:40:17', 1),
(112, 20, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624416/ShopQuanAo/Nam/QuanJean/kflqafri4ykgnzuwfk8y.png', '2025-11-20 07:40:17', 1),
(113, 18, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624417/ShopQuanAo/Nam/QuanJean/jzjmk6qdraavtqoum85o.png', '2025-11-20 07:40:18', 1),
(114, 20, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763624417/ShopQuanAo/Nam/QuanJean/jzjmk6qdraavtqoum85o.png', '2025-11-20 07:40:18', 1),
(115, 9, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763628699/ShopQuanAo/Nam/AoThun/rpesa2ncaclzoq8it4bo.webp', '2025-11-20 08:51:40', 1),
(116, 10, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763628699/ShopQuanAo/Nam/AoThun/rpesa2ncaclzoq8it4bo.webp', '2025-11-20 08:51:40', 1),
(117, 9, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763628700/ShopQuanAo/Nam/AoThun/we8c7ffdy2kn17ywcde8.webp', '2025-11-20 08:51:41', 1),
(118, 10, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763628700/ShopQuanAo/Nam/AoThun/we8c7ffdy2kn17ywcde8.webp', '2025-11-20 08:51:41', 1),
(119, 11, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763629393/ShopQuanAo/Nam/AoThun/owv9pd0kufimbrmodkvh.jpg', '2025-11-20 09:03:13', 1),
(120, 12, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763629393/ShopQuanAo/Nam/AoThun/owv9pd0kufimbrmodkvh.jpg', '2025-11-20 09:03:13', 1),
(121, 11, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763629394/ShopQuanAo/Nam/AoThun/orxkfgzyl3kbqgjk3mbc.jpg', '2025-11-20 09:03:14', 1),
(122, 12, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763629394/ShopQuanAo/Nam/AoThun/orxkfgzyl3kbqgjk3mbc.jpg', '2025-11-20 09:03:14', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kichthuoc`
--

DROP TABLE IF EXISTS `kichthuoc`;
CREATE TABLE IF NOT EXISTS `kichthuoc` (
  `makichthuoc` int NOT NULL AUTO_INCREMENT,
  `tenkichthuoc` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `tenmausac` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hexcode` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `matkhau` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoten` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sodienthoai` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diachi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vaitro` enum('client','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `trangthai` enum('hoạt động','không hoạt động') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
  `ngaytao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngaycapnhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resettoken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoigianhethan` datetime DEFAULT NULL,
  PRIMARY KEY (`manguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`manguoidung`, `email`, `matkhau`, `hoten`, `sodienthoai`, `diachi`, `vaitro`, `trangthai`, `ngaytao`, `ngaycapnhat`, `resettoken`, `thoigianhethan`) VALUES
(1, 'hau@example.com', '$2b$10$zeMkgSF9QWnHfXEsWym9s./PUl/lHNCj1UQOxEMx5nHOZhPGoXedi', 'Nguyễn Thanh Hậu', '0909123456', NULL, 'client', 'hoạt động', '2025-10-30 18:05:41', '2025-10-30 18:05:41', NULL, NULL),
(2, 'san@gmail.com', '$2b$10$ZdspotbnGKJGrCJmsNaahOqPXfBq/kixvwIrn1qAXFV.1jhWmC96u', NULL, NULL, NULL, 'admin', 'hoạt động', '2025-11-01 17:36:35', '2025-11-02 16:08:58', NULL, NULL),
(3, 'test@gmail.com', '$2b$10$iMZRcvZtF.4z4EhMPmXZ.eX/uP0.qYOUmebNYCxYu89/NH4N3pyUy', 'test thoi', '0123456789', NULL, 'client', 'hoạt động', '2025-11-01 17:59:07', '2025-11-01 18:32:59', NULL, NULL);

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
  `anhdaidien` varchar(250) NOT NULL,
  PRIMARY KEY (`masanpham`),
  KEY `madanhmuc` (`madanhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`masanpham`, `tensanpham`, `thuonghieu`, `mota`, `chatlieu`, `kieudang`, `baoquan`, `ngaytao`, `ngaycapnhat`, `madanhmuc`, `anhdaidien`) VALUES
(1, 'Áo Thun Nam Basic Cotton', 'Coolmate', 'Áo thun cotton thoáng mát, form rộng trẻ trung.', 'Cotton 100%', 'Regular Fit', 'Giặt máy, không tẩy', '2025-11-20 08:27:47', NULL, 1, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735738/ShopQuanAo/Nam/AoThun/avatar_1_1763735740080.jpg'),
(2, 'Áo Sơ Mi Nữ Tay Dài ', 'Routine', 'Thiết kế thanh lịch, dễ phối đồ, phù hợp môi trường công sở.', 'Vải lanh pha polyester', 'Slim Fit', 'Giặt tay, không vắt mạnh', '2025-11-19 18:04:59', NULL, 2, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735752/ShopQuanAo/Nu/SoMi/avatar_2_1763735754595.jpg'),
(3, 'Quần Jeans Nam  Rách Nhẹ', 'Levis', 'Chất denim co giãn nhẹ, phong cách năng động.', 'Denim co giãn', 'Slim Taper', 'Giặt trong nước lạnh', '2025-11-19 18:05:12', NULL, 3, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735769/ShopQuanAo/Nam/QuanJean/avatar_3_1763735771366.jpg'),
(4, 'Áo Khoác Nam Dù Chống Nước', 'YODY', 'Áo khoác chống gió, chống nước nhẹ, thích hợp đi chơi hoặc đi học.', 'Polyester cao cấp', 'Bomber', 'Phơi nơi thoáng mát', '2025-11-21 14:35:14', NULL, 4, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735783/ShopQuanAo/Nam/Khoac/avatar_4_1763735785497.webp'),
(5, 'Đầm Nữ Hoa Nhí Dáng Xòe', 'IVY Moda', 'Đầm hoa nhí dịu dàng, tôn dáng, phù hợp đi dạo hoặc dự tiệc nhẹ.', 'Voan mềm', 'Xòe', 'Giặt nhẹ, không sấy', '2025-10-27 16:06:48', NULL, 5, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735809/ShopQuanAo/Nu/Dam/avatar_5_1763735804018.jpg'),
(8, 'Áo Polo Nam Cá Sấu ', 'Lacoste', 'Áo polo chất cá sấu cao cấp, logo thêu tinh tế.', 'Cotton pique', 'Regular Fit', 'Giặt nhẹ, không ủi trực tiếp lên logo', '2025-11-19 18:05:31', NULL, 8, 'https://res.cloudinary.com/dt3ol8mcr/image/upload/v1763735825/ShopQuanAo/Nam/Khac/avatar_8_1763735826958.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

DROP TABLE IF EXISTS `voucher`;
CREATE TABLE IF NOT EXISTS `voucher` (
  `mavoucher` int NOT NULL AUTO_INCREMENT,
  `magiamgia` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mota` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loaikhuyenmai` enum('tiền','%') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tiền',
  `giatrigiam` int DEFAULT NULL,
  `giantoida` int DEFAULT NULL,
  `dontoithieu` int DEFAULT NULL,
  `apdungtoanbo` tinyint(1) DEFAULT NULL,
  `masanpham` int DEFAULT NULL,
  `madanhmuc` int DEFAULT NULL,
  `ngaybatdau` timestamp NULL DEFAULT NULL,
  `ngayketthuc` timestamp NULL DEFAULT NULL,
  `trangthai` enum('hoạt động','hết hạn','vô hiệu') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoạt động',
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
