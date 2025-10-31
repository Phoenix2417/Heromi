-- Cơ sở dữ liệu: `heromi`
CREATE DATABASE IF NOT EXISTS `heromi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `heromi`;

-- Cấu trúc bảng cho bảng `nguoi_dung`
CREATE TABLE `nguoi_dung` (
  `ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `matkhau` varchar(255) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng lưu bài tập
CREATE TABLE `bai_tap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `nguoi_tao` varchar(255) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoi_dung` (`ten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng lưu đề thi 
CREATE TABLE `de_thi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `nguoi_tao` varchar(255) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoi_dung` (`ten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
