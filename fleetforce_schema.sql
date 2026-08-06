-- FleetForce MySQL 8.0 Database Dump / Schema & Initial Data
-- Database: u3590013_default
-- Import this SQL file in phpMyAdmin (Tab: "Import" / "Импорт")

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `vacancies`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vacancies` (
  `id` varchar(100) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `rank_title` varchar(255) DEFAULT NULL,
  `vesselType` varchar(255) DEFAULT NULL,
  `dwt` varchar(255) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `contract` varchar(255) DEFAULT NULL,
  `joiningPort` varchar(255) DEFAULT NULL,
  `joiningDate` varchar(255) DEFAULT NULL,
  `urgent` tinyint(1) DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `requirements` longtext,
  `responsibilities` text,
  `data_json` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `vacancies` (`id`, `title`, `rank_title`, `vesselType`, `dwt`, `salary`, `contract`, `joiningPort`, `joiningDate`, `urgent`, `active`, `requirements`, `responsibilities`, `data_json`) VALUES
('1', 'Master / Captain', 'Master / Captain', 'Chemical / Product Tanker', '47,000 DWT (MAN B&W)', '$14,500', '4 months', 'Rotterdam, Netherlands', '15.08.2026', 1, 1, '["Minimum 2 contracts in rank on Chemical Tankers with FRAMO pumps","Valid Master Unlimited STCW II/2 Certificate & Flag Endorsements","Marlins English test > 85%"]', 'Overall command of vessel navigation, safety, crew operations and SIRE inspection readiness.', '{"id":1,"title":"Master / Captain","rank":"Master / Captain","vesselType":"Chemical / Product Tanker","dwt":"47,000 DWT (MAN B&W)","salary":"$14,500","contract":"4 months","joiningPort":"Rotterdam, Netherlands","joiningDate":"15.08.2026","urgent":true,"active":true,"requirements":["Minimum 2 contracts in rank on Chemical Tankers with FRAMO pumps","Valid Master Unlimited STCW II/2 Certificate & Flag Endorsements","Marlins English test > 85%"],"responsibilities":"Overall command of vessel navigation, safety, crew operations and SIRE inspection readiness."}'),
('2', 'Chief Engineer', 'Chief Engineer', 'Container Ship (5000+ TEU)', '65,000 DWT (WinGD Flex)', '$13,800', '4 months', 'Singapore', '20.08.2026', 0, 1, '["Experience with WinGD / RT-flex electronic engines","Chief Engineer Unlimited STCW III/2"]', 'Management of technical department, main engine, bunkering and dry-dock preparation.', '{"id":2,"title":"Chief Engineer","rank":"Chief Engineer","vesselType":"Container Ship (5000+ TEU)","dwt":"65,000 DWT (WinGD Flex)","salary":"$13,800","contract":"4 months","joiningPort":"Singapore","joiningDate":"20.08.2026","urgent":false,"active":true,"requirements":["Experience with WinGD / RT-flex electronic engines","Chief Engineer Unlimited STCW III/2"],"responsibilities":"Management of technical department, main engine, bunkering and dry-dock preparation."}');

-- --------------------------------------------------------
-- Table structure for `candidates`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` varchar(100) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `appliedRank` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'New',
  `submittedAt` varchar(100) DEFAULT NULL,
  `data_json` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `shipowner_requests`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `shipowner_requests` (
  `id` varchar(100) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'New',
  `createdAt` varchar(100) DEFAULT NULL,
  `data_json` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `site_config`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_config` (
  `config_key` varchar(100) NOT NULL,
  `config_val` longtext,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `site_config` (`config_key`, `config_val`) VALUES
('offices', '[{"id":1,"city":"Санкт-Петербург","cityEn":"Saint Petersburg","address":"г. Санкт-Петербург, вн. тер. г. муниципальный округ Нарвский Округ, пр-кт Стачек, д. 47, литера А, помещ. 2НС, офис 340-342","addressEn":"47 Litera A Stachek Ave, Room 2NS, Office 340-342, Saint Petersburg","phone":"","phones":[],"email":"FleetForceLLC@yandex.ru","emails":["FleetForceLLC@yandex.ru"],"flag":"⚓ Главный Офис","flagEn":"⚓ Headquarters"}]'),
('hub_blocks', '[{"id":1,"title":"FleetForce Standard Application (PDF)","description":"Официальный 5-страничный бланк морской анкеты FleetForce Crewing Alliance в формате PDF.","buttonText":"Скачать бланки анкеты Fleet Force (.PDF)","actionType":"download","filename":"Crew_Application_Form.pdf","iconType":"FileText","color":"blue"},{"id":2,"title":"FleetForce CV Form (DOC)","description":"Редактируемый Word (.DOC) бланк морской анкеты с полной матрицей плавательского ценза Fleet Force.","buttonText":"Скачать анкету Fleet Force (.DOC)","actionType":"download","filename":"Crew_Application_Form.doc","iconType":"Download","color":"gold"},{"id":3,"title":"Чек-лист документов для посадки","description":"Полный перечень рабочих дипломов, подтверждений, НБЖС и медицинских комиссий (Подплав / ОУК) для рейса.","buttonText":"Заполнить онлайн","actionType":"wizard","iconType":"FileCheck","color":"emerald"}]');

COMMIT;
