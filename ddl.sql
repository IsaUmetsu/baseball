-- MySQL dump 10.13  Distrib 5.7.23, for osx10.14 (x86_64)
--
-- Host: localhost    Database: baseball
-- ------------------------------------------------------
-- Server version	5.7.23
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!40101 SET NAMES utf8 */
;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;

/*!40103 SET TIME_ZONE='+00:00' */
;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

--
-- Table structure for table `game_info`
--
DROP TABLE IF EXISTS `game_info`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!40101 SET character_set_client = utf8 */
;

CREATE TABLE `game_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_overview_id` int(11) NOT NULL,
  `pitch_count` int(11) NOT NULL,
  `location` varchar(45) DEFAULT NULL,
  `ining` tinyint(2) DEFAULT NULL,
  `top_bottom` tinyint(2) DEFAULT NULL,
  `pitcher` varchar(15) DEFAULT NULL,
  `unkcol_4` varchar(45) DEFAULT NULL,
  `unkcol_5` varchar(45) DEFAULT NULL,
  `batter` varchar(15) DEFAULT NULL,
  `unkcol_7` varchar(45) DEFAULT NULL,
  `strike` tinyint(2) DEFAULT NULL,
  `ball` tinyint(2) DEFAULT NULL,
  `out` tinyint(2) DEFAULT NULL,
  `unkcol_11` varchar(45) DEFAULT NULL,
  `unkcol_12` varchar(45) DEFAULT NULL,
  `unkcol_13` varchar(45) DEFAULT NULL,
  `on_all_base` varchar(45) DEFAULT NULL,
  `runner_1b` varchar(15) DEFAULT NULL,
  `next_1b_go` varchar(2) DEFAULT NULL,
  `runner_2b` varchar(15) DEFAULT NULL,
  `next_2b_go` varchar(2) DEFAULT NULL,
  `runner_3b` varchar(15) DEFAULT NULL,
  `next_3b_go` varchar(2) DEFAULT NULL,
  `unkcol_21` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_info_idx1` (`order_overview_id`, `pitch_count`),
  CONSTRAINT `fk1` FOREIGN KEY (`order_overview_id`) REFERENCES `order_overview` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Table structure for table `order_detail`
--
DROP TABLE IF EXISTS `order_detail`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!40101 SET character_set_client = utf8 */
;

CREATE TABLE `order_detail` (
  `order_overview_id` int(11) NOT NULL,
  `top_bottom` tinyint(2) NOT NULL,
  `pitch_count` int(11) NOT NULL,
  `batting_order` tinyint(4) NOT NULL,
  `player` int(11) NOT NULL,
  `pos` tinyint(4) NOT NULL,
  `profile_number` tinyint(4) NOT NULL,
  `player_name` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (
    `order_overview_id`,
    `top_bottom`,
    `pitch_count`,
    `batting_order`
  ),
  KEY `fk_order_detail_1_idx` (`order_overview_id`),
  KEY `order_idx` (
    `order_overview_id`,
    `pitch_count`,
    `batting_order`
  ),
  CONSTRAINT `fk_order_detail_1` FOREIGN KEY (`order_overview_id`) REFERENCES `order_overview` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Table structure for table `order_overview`
--
DROP TABLE IF EXISTS `order_overview`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!40101 SET character_set_client = utf8 */
;

CREATE TABLE `order_overview` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(10) NOT NULL COMMENT 'YYYYMMDD',
  `visitor_team` varchar(2) NOT NULL COMMENT 'チーム頭文字（先攻）',
  `home_team` varchar(2) NOT NULL COMMENT 'チーム頭文字（後攻）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `date_UNIQUE` (`date`, `visitor_team`, `home_team`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Table structure for table `player`
--
DROP TABLE IF EXISTS `player`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!40101 SET character_set_client = utf8 */
;

CREATE TABLE `player` (
  `id` int(11) NOT NULL,
  `profile_number` tinyint(4) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*!40101 SET character_set_client = @saved_cs_client */
;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2019-08-06 13:46:31
