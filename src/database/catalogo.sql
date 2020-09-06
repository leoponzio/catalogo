-- --------------------------------------------------------
-- Host:                         192.160.10.37
-- Server version:               10.4.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for db_catalogo
CREATE DATABASE IF NOT EXISTS `db_catalogo` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `db_catalogo`;

-- Dumping structure for procedure db_catalogo.dashboard
DELIMITER //
CREATE PROCEDURE `dashboard`()
BEGIN
  declare dpto int;
  declare prod int;
 
 select count(*) into dpto from departamentos where dp_activo!=0;
 select count(*) into prod from productos where activo!=0;
 
 select dpto,prod;  
END//
DELIMITER ;

-- Dumping structure for table db_catalogo.departamentos
CREATE TABLE IF NOT EXISTS `departamentos` (
  `dp_id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_cod` varchar(50) NOT NULL,
  `dp_des` varchar(50) DEFAULT '',
  `dp_activo` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`dp_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.depositos
CREATE TABLE IF NOT EXISTS `depositos` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_cod` varchar(50) NOT NULL,
  `d_des` varchar(50) DEFAULT NULL,
  `d_activo` int(11) NOT NULL,
  PRIMARY KEY (`d_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.empresa
CREATE TABLE IF NOT EXISTS `empresa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL DEFAULT '0',
  `rif` varchar(15) NOT NULL DEFAULT '0',
  `tlf` varchar(50) NOT NULL DEFAULT '0',
  `dir` varchar(100) NOT NULL DEFAULT '0',
  `email` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.precios
CREATE TABLE IF NOT EXISTS `precios` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_cod` varchar(50) NOT NULL,
  `costoact` float DEFAULT NULL,
  `costopro` float DEFAULT NULL,
  `costoult` float DEFAULT NULL,
  `iva` float DEFAULT NULL,
  `precio1` float DEFAULT NULL,
  `mto_iva1` float DEFAULT NULL,
  `preciof1` float DEFAULT NULL,
  `precio2` float DEFAULT NULL,
  `mto_iva2` float DEFAULT NULL,
  `preciof2` float DEFAULT NULL,
  `precio3` float DEFAULT NULL,
  `mto_iva3` float DEFAULT NULL,
  `preciof3` float DEFAULT NULL,
  `precioy1` float DEFAULT NULL,
  `precioy2` float DEFAULT NULL,
  `precioy3` float DEFAULT NULL,
  `preciod1` float DEFAULT NULL,
  `preciod2` float DEFAULT NULL,
  `preciod3` float DEFAULT NULL,
  `p_activo` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`p_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cod` varchar(50) NOT NULL DEFAULT '',
  `dpto` varchar(50) DEFAULT NULL,
  `des` varchar(50) NOT NULL DEFAULT '',
  `detalle` varchar(50) DEFAULT NULL,
  `img` varchar(50) DEFAULT NULL,
  `activo` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_catalogo.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_usuario` varchar(50) NOT NULL,
  `u_clave` varchar(100) NOT NULL,
  `u_nombre` varchar(50) NOT NULL,
  `u_activo` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`u_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
