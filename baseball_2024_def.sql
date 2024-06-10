-- MySQL dump 10.13  Distrib 5.7.44, for osx10.19 (x86_64)
--
-- Host: localhost    Database: baseball_2024
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `battery_info`
--

DROP TABLE IF EXISTS `battery_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battery_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  `current_p` varchar(20) DEFAULT NULL,
  `current_c` varchar(20) DEFAULT NULL,
  `pitcher` varchar(100) DEFAULT NULL,
  `catcher` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_battery_info` (`game_info_id`,`pitcher`,`catcher`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bench_master`
--

DROP TABLE IF EXISTS `bench_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bench_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  `team_info_id` int(11) NOT NULL,
  `team_name` varchar(10) DEFAULT NULL,
  `member_count` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bench_master` (`game_info_id`,`scene`)
) ENGINE=InnoDB AUTO_INCREMENT=4241 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bench_member_info`
--

DROP TABLE IF EXISTS `bench_member_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bench_member_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_info_id` int(11) NOT NULL,
  `position` varchar(5) DEFAULT NULL,
  `player_name` varchar(45) DEFAULT NULL,
  `domain_hand` varchar(2) DEFAULT NULL,
  `average` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bench_1` (`team_info_id`),
  KEY `idx_bench_2` (`position`)
) ENGINE=InnoDB AUTO_INCREMENT=8166 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `check_not_match_plus_out`
--

DROP TABLE IF EXISTS `check_not_match_plus_out`;
/*!50001 DROP VIEW IF EXISTS `check_not_match_plus_out`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `check_not_match_plus_out` AS SELECT 
 1 AS `g_id`,
 1 AS `date`,
 1 AS `game_no`,
 1 AS `away_team_initial`,
 1 AS `home_team_initial`,
 1 AS `lb_id`,
 1 AS `inning`,
 1 AS `batting_result`,
 1 AS `pitching_result`,
 1 AS `current_batter_name`,
 1 AS `current_pitcher_name`,
 1 AS `prev_count_out`,
 1 AS `plus_out_count`,
 1 AS `after_count_out`,
 1 AS `plus_out_count_new`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_base`
--

DROP TABLE IF EXISTS `debug_base`;
/*!50001 DROP VIEW IF EXISTS `debug_base`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_base` AS SELECT 
 1 AS `g_id`,
 1 AS `scene`,
 1 AS `date`,
 1 AS `game_no`,
 1 AS `away_score`,
 1 AS `away_initial`,
 1 AS `home_score`,
 1 AS `home_initial`,
 1 AS `inning`,
 1 AS `ing_num`,
 1 AS `ing_tb`,
 1 AS `batting_result`,
 1 AS `order_no`,
 1 AS `position`,
 1 AS `current_batter_name`,
 1 AS `current_pitcher_name`,
 1 AS `pitching_result`,
 1 AS `current_batter_at_bat`,
 1 AS `current_batter_player_no`,
 1 AS `current_batter_domain_hand`,
 1 AS `current_batter_average`,
 1 AS `current_pitcher_order`,
 1 AS `current_pitcher_player_no`,
 1 AS `current_pitcher_domain_hand`,
 1 AS `current_pitcher_pitch`,
 1 AS `current_pitcher_vs_batter_cnt`,
 1 AS `current_pitcher_era`,
 1 AS `base1_player`,
 1 AS `base2_player`,
 1 AS `base3_player`,
 1 AS `next_batter_name`,
 1 AS `inning_batter_cnt`,
 1 AS `prev_count_ball`,
 1 AS `prev_count_strike`,
 1 AS `prev_count_out`,
 1 AS `plus_score`,
 1 AS `plus_out_count`,
 1 AS `is_pa`,
 1 AS `is_ab`,
 1 AS `is_hit`,
 1 AS `is_onbase`,
 1 AS `total_base`,
 1 AS `is_err`,
 1 AS `is_fc`,
 1 AS `is_change_pitcher`,
 1 AS `is_change_fileder`,
 1 AS `is_change_batter`,
 1 AS `is_change_runner`,
 1 AS `away_team_initial`,
 1 AS `home_team_initial`,
 1 AS `after_count_ball`,
 1 AS `after_count_strike`,
 1 AS `after_count_out`,
 1 AS `p_team`,
 1 AS `b_team`,
 1 AS `lb_id`,
 1 AS `game_info_id`,
 1 AS `lh_id`,
 1 AS `no_game`,
 1 AS `is_cs`,
 1 AS `is_js`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_dup_scenes`
--

DROP TABLE IF EXISTS `debug_dup_scenes`;
/*!50001 DROP VIEW IF EXISTS `debug_dup_scenes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_dup_scenes` AS SELECT 
 1 AS `date`,
 1 AS `a`,
 1 AS `h`,
 1 AS `prev_lb_id`,
 1 AS `game_info_id`,
 1 AS `prev_scene`,
 1 AS `after_scene`,
 1 AS `prev_b_result`,
 1 AS `after_b_result`,
 1 AS `prev_p_result`,
 1 AS `after_p_result`,
 1 AS `after_lb_id`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_first_game`
--

DROP TABLE IF EXISTS `debug_first_game`;
/*!50001 DROP VIEW IF EXISTS `debug_first_game`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_first_game` AS SELECT 
 1 AS `game_info_id`,
 1 AS `team`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_game_bat_rc5`
--

DROP TABLE IF EXISTS `debug_game_bat_rc5`;
/*!50001 DROP VIEW IF EXISTS `debug_game_bat_rc5`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_game_bat_rc5` AS SELECT 
 1 AS `batter`,
 1 AS `all_bat`,
 1 AS `pa`,
 1 AS `b_team`,
 1 AS `bat`,
 1 AS `hit`,
 1 AS `onbase`,
 1 AS `total_base`,
 1 AS `average`,
 1 AS `average_onbase`,
 1 AS `average_slugging`,
 1 AS `ops`,
 1 AS `hr`,
 1 AS `rbi`,
 1 AS `bb`,
 1 AS `hbp`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_game_pitch_mid_rc10`
--

DROP TABLE IF EXISTS `debug_game_pitch_mid_rc10`;
/*!50001 DROP VIEW IF EXISTS `debug_game_pitch_mid_rc10`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_game_pitch_mid_rc10` AS SELECT 
 1 AS `tm`,
 1 AS `p_name`,
 1 AS `game_cnt`,
 1 AS `win`,
 1 AS `lose`,
 1 AS `hold`,
 1 AS `save`,
 1 AS `era`,
 1 AS `inning`,
 1 AS `ra`,
 1 AS `er`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_month_result`
--

DROP TABLE IF EXISTS `debug_month_result`;
/*!50001 DROP VIEW IF EXISTS `debug_month_result`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_month_result` AS SELECT 
 1 AS `t_team`,
 1 AS `t_total`,
 1 AS `b_team`,
 1 AS `b_total`,
 1 AS `win_team`,
 1 AS `lose_team`,
 1 AS `draw_team_1`,
 1 AS `draw_team_2`,
 1 AS `date`,
 1 AS `game_info_id`,
 1 AS `month`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_pitch_base`
--

DROP TABLE IF EXISTS `debug_pitch_base`;
/*!50001 DROP VIEW IF EXISTS `debug_pitch_base`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_pitch_base` AS SELECT 
 1 AS `date`,
 1 AS `game_no`,
 1 AS `inning`,
 1 AS `ing_num`,
 1 AS `ing_tb`,
 1 AS `judge_icon`,
 1 AS `pitch_cnt`,
 1 AS `pitch_type`,
 1 AS `pitch_speed`,
 1 AS `pitch_judge_detail`,
 1 AS `current_batter_name`,
 1 AS `current_batter_at_bat`,
 1 AS `current_pitcher_name`,
 1 AS `current_pitcher_order`,
 1 AS `is_swing`,
 1 AS `is_missed`,
 1 AS `base1_player`,
 1 AS `base2_player`,
 1 AS `base3_player`,
 1 AS `next_batter_name`,
 1 AS `inning_batter_cnt`,
 1 AS `current_batter_player_no`,
 1 AS `current_batter_domain_hand`,
 1 AS `current_pitcher_player_no`,
 1 AS `current_pitcher_domain_hand`,
 1 AS `current_pitcher_vs_batter_cnt`,
 1 AS `current_pitcher_era`,
 1 AS `away_score`,
 1 AS `away_initial`,
 1 AS `home_score`,
 1 AS `home_initial`,
 1 AS `away_team_initial`,
 1 AS `home_team_initial`,
 1 AS `b_team`,
 1 AS `p_team`,
 1 AS `game_info_id`,
 1 AS `scene`,
 1 AS `pitch_info_id`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_stats_batter`
--

DROP TABLE IF EXISTS `debug_stats_batter`;
/*!50001 DROP VIEW IF EXISTS `debug_stats_batter`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_stats_batter` AS SELECT 
 1 AS `date`,
 1 AS `game_no`,
 1 AS `id`,
 1 AS `b_team`,
 1 AS `name`,
 1 AS `order`,
 1 AS `position`,
 1 AS `ave`,
 1 AS `ab`,
 1 AS `run`,
 1 AS `hit`,
 1 AS `rbi`,
 1 AS `so`,
 1 AS `bb`,
 1 AS `hbp`,
 1 AS `sh`,
 1 AS `sb`,
 1 AS `err`,
 1 AS `hr`,
 1 AS `ing1`,
 1 AS `ing2`,
 1 AS `ing3`,
 1 AS `ing4`,
 1 AS `ing5`,
 1 AS `ing6`,
 1 AS `ing7`,
 1 AS `ing8`,
 1 AS `ing9`,
 1 AS `ing10`,
 1 AS `is_sm`,
 1 AS `is_ph`,
 1 AS `is_pr`,
 1 AS `is_sf`,
 1 AS `oppo`,
 1 AS `is_away`,
 1 AS `is_home`,
 1 AS `away_team_initial`,
 1 AS `home_team_initial`,
 1 AS `is_rg`,
 1 AS `game_info_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `debug_stats_pitcher`
--

DROP TABLE IF EXISTS `debug_stats_pitcher`;
/*!50001 DROP VIEW IF EXISTS `debug_stats_pitcher`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `debug_stats_pitcher` AS SELECT 
 1 AS `date`,
 1 AS `game_no`,
 1 AS `p_team`,
 1 AS `name`,
 1 AS `order`,
 1 AS `result`,
 1 AS `era`,
 1 AS `ip`,
 1 AS `outs`,
 1 AS `np`,
 1 AS `bf`,
 1 AS `ha`,
 1 AS `hra`,
 1 AS `so`,
 1 AS `bb`,
 1 AS `hbp`,
 1 AS `balk`,
 1 AS `ra`,
 1 AS `er`,
 1 AS `complete`,
 1 AS `oppo`,
 1 AS `is_away`,
 1 AS `is_home`,
 1 AS `away_team_initial`,
 1 AS `home_team_initial`,
 1 AS `is_rg`,
 1 AS `game_info_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `game_cnt_per_day`
--

DROP TABLE IF EXISTS `game_cnt_per_day`;
/*!50001 DROP VIEW IF EXISTS `game_cnt_per_day`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `game_cnt_per_day` AS SELECT 
 1 AS `team_initial_kana`,
 1 AS `team_initial`,
 1 AS `dow`,
 1 AS `away_game_cnt`,
 1 AS `home_game_cnt`,
 1 AS `game_cnt`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `game_cnt_per_month`
--

DROP TABLE IF EXISTS `game_cnt_per_month`;
/*!50001 DROP VIEW IF EXISTS `game_cnt_per_month`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `game_cnt_per_month` AS SELECT 
 1 AS `team_initial_kana`,
 1 AS `team_initial`,
 1 AS `month`,
 1 AS `away_game_cnt`,
 1 AS `home_game_cnt`,
 1 AS `game_cnt`,
 1 AS `eol`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `game_id_recent_10days`
--

DROP TABLE IF EXISTS `game_id_recent_10days`;
/*!50001 DROP VIEW IF EXISTS `game_id_recent_10days`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `game_id_recent_10days` AS SELECT 
 1 AS `team`,
 1 AS `id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `game_id_recent_5days`
--

DROP TABLE IF EXISTS `game_id_recent_5days`;
/*!50001 DROP VIEW IF EXISTS `game_id_recent_5days`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `game_id_recent_5days` AS SELECT 
 1 AS `team`,
 1 AS `id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `game_info`
--

DROP TABLE IF EXISTS `game_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(8) NOT NULL,
  `away_team_initial` varchar(2) NOT NULL,
  `home_team_initial` varchar(2) NOT NULL,
  `game_no` varchar(2) NOT NULL,
  `no_game` tinyint(4) NOT NULL DEFAULT '0',
  `is_op` tinyint(4) DEFAULT '0',
  `is_rg` tinyint(4) DEFAULT '0',
  `is_il` tinyint(4) DEFAULT '0',
  `is_cs` tinyint(4) DEFAULT '0',
  `is_js` tinyint(4) DEFAULT '0',
  `is_em` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`),
  KEY `idx_no_game` (`no_game`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_order`
--

DROP TABLE IF EXISTS `game_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_info_id` int(11) NOT NULL,
  `order_no` tinyint(4) NOT NULL,
  `position` varchar(3) NOT NULL,
  `name` varchar(20) NOT NULL,
  `domain_hand` varchar(2) NOT NULL,
  `average` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_game_order` (`team_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28387 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homerun_info`
--

DROP TABLE IF EXISTS `homerun_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homerun_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  `homerun` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_homerun_info` (`game_info_id`,`scene`,`homerun`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `judge_icon`
--

DROP TABLE IF EXISTS `judge_icon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `judge_icon` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `live_body`
--

DROP TABLE IF EXISTS `live_body`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `live_body` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` int(11) NOT NULL,
  `batting_result` varchar(200) DEFAULT NULL,
  `pitching_result` varchar(200) DEFAULT NULL,
  `current_batter_name` varchar(20) DEFAULT NULL,
  `current_batter_player_no` varchar(5) DEFAULT NULL,
  `current_batter_domain_hand` varchar(3) DEFAULT NULL,
  `current_batter_average` varchar(20) DEFAULT NULL,
  `current_batter_at_bat` tinyint(4) DEFAULT NULL,
  `current_pitcher_name` varchar(20) DEFAULT NULL,
  `current_pitcher_player_no` varchar(5) DEFAULT NULL,
  `current_pitcher_domain_hand` varchar(3) DEFAULT NULL,
  `current_pitcher_pitch` smallint(6) DEFAULT NULL,
  `current_pitcher_vs_batter_cnt` tinyint(4) DEFAULT NULL,
  `current_pitcher_era` varchar(10) DEFAULT NULL,
  `current_pitcher_order` tinyint(4) DEFAULT NULL,
  `base1_player` varchar(20) DEFAULT NULL,
  `base2_player` varchar(20) DEFAULT NULL,
  `base3_player` varchar(20) DEFAULT NULL,
  `next_batter_name` varchar(45) DEFAULT NULL,
  `inning_batter_cnt` varchar(5) DEFAULT NULL,
  `prev_count_ball` tinyint(4) DEFAULT NULL,
  `prev_count_strike` tinyint(4) DEFAULT NULL,
  `prev_count_out` tinyint(4) DEFAULT NULL,
  `plus_score` tinyint(4) NOT NULL DEFAULT '0',
  `plus_out_count` tinyint(4) DEFAULT NULL,
  `is_pa` tinyint(4) DEFAULT NULL,
  `is_ab` tinyint(4) DEFAULT NULL,
  `is_hit` tinyint(4) DEFAULT NULL,
  `is_onbase` tinyint(4) DEFAULT NULL,
  `total_base` tinyint(4) DEFAULT NULL,
  `is_err` tinyint(4) DEFAULT NULL,
  `is_fc` tinyint(4) DEFAULT NULL,
  `is_change_pitcher` tinyint(4) DEFAULT NULL,
  `is_change_fileder` tinyint(4) DEFAULT NULL,
  `is_change_batter` tinyint(4) DEFAULT NULL,
  `is_change_runner` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_live_body` (`game_info_id`,`scene`)
) ENGINE=InnoDB AUTO_INCREMENT=1596 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `live_header`
--

DROP TABLE IF EXISTS `live_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `live_header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  `inning` varchar(5) NOT NULL,
  `away_score` tinyint(4) NOT NULL,
  `away_initial` varchar(2) NOT NULL,
  `home_score` tinyint(4) NOT NULL,
  `home_initial` varchar(2) NOT NULL,
  `count_ball` tinyint(4) NOT NULL,
  `count_strike` tinyint(4) NOT NULL,
  `count_out` tinyint(4) NOT NULL,
  `ing_num` tinyint(4) NOT NULL,
  `ing_tb` tinyint(4) DEFAULT NULL,
  `p_team` varchar(2) DEFAULT NULL,
  `b_team` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_live_header` (`game_info_id`,`scene`),
  KEY `idx_b_team` (`b_team`)
) ENGINE=InnoDB AUTO_INCREMENT=1596 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pitch_course`
--

DROP TABLE IF EXISTS `pitch_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pitch_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_info_id` int(11) NOT NULL,
  `pitch_cnt` smallint(6) DEFAULT NULL,
  `top` smallint(6) DEFAULT NULL,
  `left` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pitch_course` (`pitch_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5070 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pitch_details`
--

DROP TABLE IF EXISTS `pitch_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pitch_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_info_id` int(11) NOT NULL,
  `judge_icon` tinyint(4) DEFAULT NULL,
  `pitch_cnt` smallint(6) DEFAULT NULL,
  `pitch_type` varchar(10) DEFAULT NULL,
  `pitch_speed` varchar(10) DEFAULT NULL,
  `pitch_judge_detail` varchar(100) DEFAULT NULL,
  `is_swing` tinyint(4) DEFAULT NULL,
  `is_missed` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pitch_details` (`pitch_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5070 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pitch_info`
--

DROP TABLE IF EXISTS `pitch_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pitch_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pitch_info` (`game_info_id`,`scene`)
) ENGINE=InnoDB AUTO_INCREMENT=1578 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pitcher_batter`
--

DROP TABLE IF EXISTS `pitcher_batter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pitcher_batter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pitch_info_id` int(11) NOT NULL,
  `left_title` varchar(5) DEFAULT NULL,
  `left_name` varchar(20) DEFAULT NULL,
  `left_domain_hand` varchar(2) DEFAULT NULL,
  `right_title` varchar(5) DEFAULT NULL,
  `right_name` varchar(45) DEFAULT NULL,
  `right_domain_hand` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pitcher_batter` (`pitch_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1578 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stats_batter`
--

DROP TABLE IF EXISTS `stats_batter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats_batter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `b_team` varchar(2) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `order` tinyint(4) DEFAULT NULL,
  `position` varchar(10) DEFAULT NULL,
  `ave` varchar(10) DEFAULT NULL,
  `ab` tinyint(4) DEFAULT NULL,
  `run` tinyint(4) DEFAULT NULL,
  `hit` tinyint(4) DEFAULT NULL,
  `rbi` tinyint(4) DEFAULT NULL,
  `so` tinyint(4) DEFAULT NULL,
  `bb` tinyint(4) DEFAULT NULL,
  `hbp` tinyint(4) DEFAULT NULL,
  `sh` tinyint(4) DEFAULT NULL,
  `sb` tinyint(4) DEFAULT NULL,
  `err` tinyint(4) DEFAULT NULL,
  `hr` tinyint(4) DEFAULT NULL,
  `ing1` varchar(10) DEFAULT NULL,
  `ing2` varchar(10) DEFAULT NULL,
  `ing3` varchar(10) DEFAULT NULL,
  `ing4` varchar(10) DEFAULT NULL,
  `ing5` varchar(10) DEFAULT NULL,
  `ing6` varchar(10) DEFAULT NULL,
  `ing7` varchar(10) DEFAULT NULL,
  `ing8` varchar(10) DEFAULT NULL,
  `ing9` varchar(10) DEFAULT NULL,
  `ing10` varchar(10) DEFAULT NULL,
  `is_sm` tinyint(4) DEFAULT NULL,
  `is_ph` tinyint(4) DEFAULT NULL,
  `is_pr` tinyint(4) DEFAULT NULL,
  `is_sf` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stats_batter` (`game_info_id`,`b_team`,`order`)
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stats_pitcher`
--

DROP TABLE IF EXISTS `stats_pitcher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats_pitcher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `p_team` varchar(2) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `order` tinyint(4) DEFAULT NULL,
  `result` varchar(5) DEFAULT NULL,
  `era` varchar(10) DEFAULT NULL,
  `ip` varchar(5) DEFAULT NULL,
  `outs` tinyint(4) DEFAULT NULL,
  `np` smallint(6) DEFAULT NULL,
  `bf` tinyint(4) DEFAULT NULL,
  `ha` tinyint(4) DEFAULT NULL,
  `hra` tinyint(4) DEFAULT NULL,
  `so` tinyint(4) DEFAULT NULL,
  `bb` tinyint(4) DEFAULT NULL,
  `hbp` tinyint(4) DEFAULT NULL,
  `balk` tinyint(4) DEFAULT NULL,
  `ra` tinyint(4) DEFAULT NULL,
  `er` tinyint(4) DEFAULT NULL,
  `complete` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stats_pitcher` (`game_info_id`,`p_team`,`order`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stats_scoreboard`
--

DROP TABLE IF EXISTS `stats_scoreboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats_scoreboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `b_team` varchar(2) NOT NULL,
  `ing1` varchar(3) DEFAULT NULL,
  `ing2` varchar(3) DEFAULT NULL,
  `ing3` varchar(3) DEFAULT NULL,
  `ing4` varchar(3) DEFAULT NULL,
  `ing5` varchar(3) DEFAULT NULL,
  `ing6` varchar(3) DEFAULT NULL,
  `ing7` varchar(3) DEFAULT NULL,
  `ing8` varchar(3) DEFAULT NULL,
  `ing9` varchar(3) DEFAULT NULL,
  `ing10` varchar(3) DEFAULT NULL,
  `total` varchar(3) DEFAULT NULL,
  `hit` varchar(3) DEFAULT NULL,
  `err` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `summary_point`
--

DROP TABLE IF EXISTS `summary_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `summary_point` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `inning` varchar(5) DEFAULT NULL,
  `team` varchar(10) DEFAULT NULL,
  `no` varchar(3) DEFAULT NULL,
  `order` varchar(3) DEFAULT NULL,
  `batter` varchar(20) DEFAULT NULL,
  `detail` varchar(200) DEFAULT NULL,
  `is_rbi_hit` tinyint(4) DEFAULT NULL,
  `is_first` tinyint(4) DEFAULT NULL,
  `is_tie` tinyint(4) DEFAULT NULL,
  `is_win` tinyint(4) DEFAULT NULL,
  `is_reversal` tinyint(4) DEFAULT NULL,
  `is_walkoff` tinyint(4) DEFAULT NULL,
  `is_hr` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_summary_point` (`game_info_id`,`inning`,`no`),
  KEY `idx_sp_2` (`game_info_id`,`inning`,`team`,`no`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_info`
--

DROP TABLE IF EXISTS `team_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_info_id` int(11) NOT NULL,
  `scene` smallint(6) NOT NULL,
  `home_away` varchar(5) NOT NULL,
  `team_name` varchar(10) NOT NULL,
  `team_initial_kana` varchar(2) DEFAULT NULL,
  `battery_info_id` int(11) DEFAULT NULL,
  `homerun_info_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_team_info_2` (`home_away`,`team_name`),
  KEY `idx_team_info_1` (`game_info_id`,`scene`,`home_away`)
) ENGINE=InnoDB AUTO_INCREMENT=3155 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_master`
--

DROP TABLE IF EXISTS `team_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_master` (
  `team_initial_kana` varchar(5) DEFAULT NULL,
  `team_initial` varchar(5) NOT NULL,
  `team_name` text,
  `league` text,
  `hashtag` text,
  PRIMARY KEY (`team_initial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tweet`
--

DROP TABLE IF EXISTS `tweet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tweet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `script_name` varchar(30) DEFAULT NULL,
  `team` varchar(20) DEFAULT NULL,
  `tweeted_day` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `check_not_match_plus_out`
--

/*!50001 DROP VIEW IF EXISTS `check_not_match_plus_out`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `check_not_match_plus_out` AS select `l`.`g_id` AS `g_id`,`l`.`date` AS `date`,`l`.`game_no` AS `game_no`,`l`.`away_team_initial` AS `away_team_initial`,`l`.`home_team_initial` AS `home_team_initial`,`l`.`lb_id` AS `lb_id`,`l`.`inning` AS `inning`,`l`.`batting_result` AS `batting_result`,`l`.`pitching_result` AS `pitching_result`,`l`.`current_batter_name` AS `current_batter_name`,`l`.`current_pitcher_name` AS `current_pitcher_name`,`l`.`prev_count_out` AS `prev_count_out`,`l`.`plus_out_count` AS `plus_out_count`,`l`.`after_count_out` AS `after_count_out`,(case when isnull(`r`.`after_count_out`) then `l`.`after_count_out` else (`l`.`after_count_out` - `r`.`after_count_out`) end) AS `plus_out_count_new`,`l`.`eol` AS `eol` from (((select `debug_base`.`g_id` AS `g_id`,`debug_base`.`date` AS `date`,`debug_base`.`game_no` AS `game_no`,`debug_base`.`away_team_initial` AS `away_team_initial`,`debug_base`.`home_team_initial` AS `home_team_initial`,`debug_base`.`lb_id` AS `lb_id`,`debug_base`.`inning` AS `inning`,`debug_base`.`batting_result` AS `batting_result`,`debug_base`.`pitching_result` AS `pitching_result`,`debug_base`.`current_batter_name` AS `current_batter_name`,`debug_base`.`current_pitcher_name` AS `current_pitcher_name`,`debug_base`.`prev_count_out` AS `prev_count_out`,`debug_base`.`plus_out_count` AS `plus_out_count`,`debug_base`.`after_count_out` AS `after_count_out`,`debug_base`.`eol` AS `eol` from `baseball_2022`.`debug_base`)) `L` left join (select `debug_base`.`g_id` AS `g_id`,`debug_base`.`date` AS `date`,`debug_base`.`game_no` AS `game_no`,`debug_base`.`away_team_initial` AS `away_team_initial`,`debug_base`.`home_team_initial` AS `home_team_initial`,`debug_base`.`lb_id` AS `lb_id`,`debug_base`.`inning` AS `inning`,`debug_base`.`batting_result` AS `batting_result`,`debug_base`.`pitching_result` AS `pitching_result`,`debug_base`.`current_batter_name` AS `current_batter_name`,`debug_base`.`current_pitcher_name` AS `current_pitcher_name`,`debug_base`.`prev_count_out` AS `prev_count_out`,`debug_base`.`plus_out_count` AS `plus_out_count`,`debug_base`.`after_count_out` AS `after_count_out`,`debug_base`.`eol` AS `eol` from `baseball_2022`.`debug_base`) `R` on(((`l`.`g_id` = `r`.`g_id`) and (`l`.`lb_id` = (`r`.`lb_id` + 1)) and (`l`.`inning` = `r`.`inning`)))) where (`l`.`plus_out_count` <> (case when isnull(`r`.`after_count_out`) then `l`.`after_count_out` else (`l`.`after_count_out` - `r`.`after_count_out`) end)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_base`
--

/*!50001 DROP VIEW IF EXISTS `debug_base`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_base` AS select `gi`.`id` AS `g_id`,`lb`.`scene` AS `scene`,`gi`.`date` AS `date`,`gi`.`game_no` AS `game_no`,`lh`.`away_score` AS `away_score`,`lh`.`away_initial` AS `away_initial`,`lh`.`home_score` AS `home_score`,`lh`.`home_initial` AS `home_initial`,`lh`.`inning` AS `inning`,`lh`.`ing_num` AS `ing_num`,`lh`.`ing_tb` AS `ing_tb`,`lb`.`batting_result` AS `batting_result`,`go`.`order_no` AS `order_no`,`go`.`position` AS `position`,`lb`.`current_batter_name` AS `current_batter_name`,`lb`.`current_pitcher_name` AS `current_pitcher_name`,`lb`.`pitching_result` AS `pitching_result`,`lb`.`current_batter_at_bat` AS `current_batter_at_bat`,`lb`.`current_batter_player_no` AS `current_batter_player_no`,`lb`.`current_batter_domain_hand` AS `current_batter_domain_hand`,`lb`.`current_batter_average` AS `current_batter_average`,`lb`.`current_pitcher_order` AS `current_pitcher_order`,`lb`.`current_pitcher_player_no` AS `current_pitcher_player_no`,`lb`.`current_pitcher_domain_hand` AS `current_pitcher_domain_hand`,`lb`.`current_pitcher_pitch` AS `current_pitcher_pitch`,`lb`.`current_pitcher_vs_batter_cnt` AS `current_pitcher_vs_batter_cnt`,`lb`.`current_pitcher_era` AS `current_pitcher_era`,`lb`.`base1_player` AS `base1_player`,`lb`.`base2_player` AS `base2_player`,`lb`.`base3_player` AS `base3_player`,`lb`.`next_batter_name` AS `next_batter_name`,`lb`.`inning_batter_cnt` AS `inning_batter_cnt`,`lb`.`prev_count_ball` AS `prev_count_ball`,`lb`.`prev_count_strike` AS `prev_count_strike`,`lb`.`prev_count_out` AS `prev_count_out`,`lb`.`plus_score` AS `plus_score`,`lb`.`plus_out_count` AS `plus_out_count`,`lb`.`is_pa` AS `is_pa`,`lb`.`is_ab` AS `is_ab`,`lb`.`is_hit` AS `is_hit`,`lb`.`is_onbase` AS `is_onbase`,`lb`.`total_base` AS `total_base`,`lb`.`is_err` AS `is_err`,`lb`.`is_fc` AS `is_fc`,`lb`.`is_change_pitcher` AS `is_change_pitcher`,`lb`.`is_change_fileder` AS `is_change_fileder`,`lb`.`is_change_batter` AS `is_change_batter`,`lb`.`is_change_runner` AS `is_change_runner`,`gi`.`away_team_initial` AS `away_team_initial`,`gi`.`home_team_initial` AS `home_team_initial`,`lh`.`count_ball` AS `after_count_ball`,`lh`.`count_strike` AS `after_count_strike`,`lh`.`count_out` AS `after_count_out`,`lh`.`p_team` AS `p_team`,`lh`.`b_team` AS `b_team`,`lb`.`id` AS `lb_id`,`lb`.`game_info_id` AS `game_info_id`,`lh`.`id` AS `lh_id`,`gi`.`no_game` AS `no_game`,`gi`.`is_cs` AS `is_cs`,`gi`.`is_js` AS `is_js`,'' AS `eol` from ((((`live_body` `lb` left join `live_header` `lh` on(((`lb`.`game_info_id` = `lh`.`game_info_id`) and (`lb`.`scene` = `lh`.`scene`)))) left join `game_info` `gi` on((`lb`.`game_info_id` = `gi`.`id`))) left join `team_info` `ti` on(((`lb`.`game_info_id` = `ti`.`game_info_id`) and (`lb`.`scene` = `ti`.`scene`) and (`ti`.`team_initial_kana` = `lh`.`b_team`)))) left join `game_order` `go` on(((`ti`.`id` = `go`.`team_info_id`) and (`go`.`name` = `lb`.`current_batter_name`)))) where ((`gi`.`no_game` = 0) and (`gi`.`is_rg` = 1)) order by `gi`.`date`,`gi`.`game_no`,`lb`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_dup_scenes`
--

/*!50001 DROP VIEW IF EXISTS `debug_dup_scenes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_dup_scenes` AS select `gi`.`date` AS `date`,`gi`.`away_team_initial` AS `a`,`gi`.`home_team_initial` AS `h`,`lb1`.`id` AS `prev_lb_id`,`lb1`.`game_info_id` AS `game_info_id`,`lb1`.`scene` AS `prev_scene`,`lb2`.`scene` AS `after_scene`,`lb1`.`batting_result` AS `prev_b_result`,`lb2`.`batting_result` AS `after_b_result`,`lb1`.`pitching_result` AS `prev_p_result`,`lb2`.`pitching_result` AS `after_p_result`,`lb2`.`id` AS `after_lb_id`,'' AS `eol` from ((`live_body` `lb1` left join `live_body` `lb2` on((`lb1`.`id` = (`lb2`.`id` + 1)))) left join `game_info` `gi` on((`gi`.`id` = `lb1`.`game_info_id`))) where ((`lb1`.`current_batter_name` = `lb2`.`current_batter_name`) and (`lb1`.`batting_result` = `lb2`.`batting_result`) and (`lb1`.`pitching_result` = `lb2`.`pitching_result`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_first_game`
--

/*!50001 DROP VIEW IF EXISTS `debug_first_game`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_first_game` AS select 1 AS `game_info_id`,1 AS `team` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_game_bat_rc5`
--

/*!50001 DROP VIEW IF EXISTS `debug_game_bat_rc5`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_game_bat_rc5` AS select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = 'ソ') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ソ'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = 'ソ') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ソ'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = 'ロ') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ロ'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = 'ロ') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ロ'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '楽') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '楽'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '楽') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '楽'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '日') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '日'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '日') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '日'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '西') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '西'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '西') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '西'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = 'オ') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'オ'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = 'オ') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'オ'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '巨') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '巨'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '巨') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '巨'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '神') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '神'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '神') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '神'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = 'デ') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'デ'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = 'デ') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'デ'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '中') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '中'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '中') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '中'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = '広') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '広'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = '広') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = '広'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) union select `base`.`batter` AS `batter`,`base`.`all_bat` AS `all_bat`,`base`.`pa` AS `pa`,`base`.`b_team` AS `b_team`,`base`.`bat` AS `bat`,`base`.`hit` AS `hit`,`base`.`onbase` AS `onbase`,`base`.`total_base` AS `total_base`,`base`.`average` AS `average`,`base`.`average_onbase` AS `average_onbase`,`base`.`average_slugging` AS `average_slugging`,(`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,`other`.`hr` AS `hr`,`other`.`rbi` AS `rbi`,`other`.`bb` AS `bb`,`other`.`hbp` AS `hbp`,`base`.`eol` AS `eol` from (((select replace(`debug_base`.`current_batter_name`,' ','') AS `batter`,count(`debug_base`.`current_batter_name`) AS `all_bat`,sum(`debug_base`.`is_pa`) AS `pa`,`debug_base`.`b_team` AS `b_team`,sum(`debug_base`.`is_ab`) AS `bat`,sum(`debug_base`.`is_hit`) AS `hit`,sum(`debug_base`.`is_onbase`) AS `onbase`,sum(`debug_base`.`total_base`) AS `total_base`,round((sum(`debug_base`.`is_hit`) / sum(`debug_base`.`is_ab`)),3) AS `average`,round((sum(`debug_base`.`is_onbase`) / sum(`debug_base`.`is_pa`)),3) AS `average_onbase`,round((sum(`debug_base`.`total_base`) / sum(`debug_base`.`is_pa`)),3) AS `average_slugging`,'' AS `eol` from `baseball_2023`.`debug_base` where ((`debug_base`.`is_pa` = 1) and (`debug_base`.`b_team` = 'ヤ') and `debug_base`.`g_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ヤ'))) group by `debug_base`.`current_batter_name`,`debug_base`.`b_team` having (`pa` >= (3.1 * 5)))) `base` left join (select `baseball_2023`.`stats_batter`.`b_team` AS `b_team`,`baseball_2023`.`stats_batter`.`name` AS `name`,replace(`baseball_2023`.`stats_batter`.`name`,' ','') AS `batter`,sum(`baseball_2023`.`stats_batter`.`rbi`) AS `rbi`,sum(`baseball_2023`.`stats_batter`.`hr`) AS `hr`,sum(`baseball_2023`.`stats_batter`.`bb`) AS `bb`,sum(`baseball_2023`.`stats_batter`.`hbp`) AS `hbp` from `baseball_2023`.`stats_batter` where ((`baseball_2023`.`stats_batter`.`b_team` = 'ヤ') and `baseball_2023`.`stats_batter`.`game_info_id` in (select `game_id_recent_5days`.`id` from `baseball_2023`.`game_id_recent_5days` where (convert(`game_id_recent_5days`.`team` using utf8mb4) = 'ヤ'))) group by `baseball_2023`.`stats_batter`.`name`,`baseball_2023`.`stats_batter`.`b_team`) `other` on(((`base`.`batter` = `other`.`batter`) and (`base`.`b_team` = `other`.`b_team`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_game_pitch_mid_rc10`
--

/*!50001 DROP VIEW IF EXISTS `debug_game_pitch_mid_rc10`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_game_pitch_mid_rc10` AS select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = 'ソ')) and (`sp`.`p_team` = 'ソ')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = 'ロ')) and (`sp`.`p_team` = 'ロ')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '楽')) and (`sp`.`p_team` = '楽')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '日')) and (`sp`.`p_team` = '日')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '西')) and (`sp`.`p_team` = '西')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = 'オ')) and (`sp`.`p_team` = 'オ')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '巨')) and (`sp`.`p_team` = '巨')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '神')) and (`sp`.`p_team` = '神')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = 'デ')) and (`sp`.`p_team` = 'デ')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '中')) and (`sp`.`p_team` = '中')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = '広')) and (`sp`.`p_team` = '広')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) union select `sp`.`p_team` AS `tm`,replace(`sp`.`name`,' ','') AS `p_name`,count(`sp`.`name`) AS `game_cnt`,count(((`sp`.`result` = '勝') or NULL)) AS `win`,count(((`sp`.`result` = '敗') or NULL)) AS `lose`,count(((`sp`.`result` = 'H') or NULL)) AS `hold`,count(((`sp`.`result` = 'S') or NULL)) AS `save`,round(((sum(`sp`.`er`) * 27) / sum(`sp`.`outs`)),2) AS `era`,concat((sum(`sp`.`outs`) DIV 3),(case when ((sum(`sp`.`outs`) % 3) > 0) then concat('.',(sum(`sp`.`outs`) % 3)) else '' end)) AS `inning`,sum(`sp`.`ra`) AS `ra`,sum(`sp`.`er`) AS `er`,'' AS `eol` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where ((`sp`.`order` > 1) and `sp`.`game_info_id` in (select `game_id_recent_10days`.`id` from `game_id_recent_10days` where (`game_id_recent_10days`.`team` = 'ヤ')) and (`sp`.`p_team` = 'ヤ')) group by `sp`.`name`,`sp`.`p_team` having (sum(`sp`.`outs`) > 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_month_result`
--

/*!50001 DROP VIEW IF EXISTS `debug_month_result`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_month_result` AS select 1 AS `t_team`,1 AS `t_total`,1 AS `b_team`,1 AS `b_total`,1 AS `win_team`,1 AS `lose_team`,1 AS `draw_team_1`,1 AS `draw_team_2`,1 AS `date`,1 AS `game_info_id`,1 AS `month`,1 AS `eol` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_pitch_base`
--

/*!50001 DROP VIEW IF EXISTS `debug_pitch_base`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_pitch_base` AS select `gi`.`date` AS `date`,`gi`.`game_no` AS `game_no`,`lh`.`inning` AS `inning`,substring_index(`lh`.`inning`,'回',1) AS `ing_num`,(case substring_index(`lh`.`inning`,'回',-(1)) when '表' then 1 when '裏' then 2 end) AS `ing_tb`,`pd`.`judge_icon` AS `judge_icon`,`pd`.`pitch_cnt` AS `pitch_cnt`,`pd`.`pitch_type` AS `pitch_type`,`pd`.`pitch_speed` AS `pitch_speed`,`pd`.`pitch_judge_detail` AS `pitch_judge_detail`,`lb`.`current_batter_name` AS `current_batter_name`,`lb`.`current_batter_at_bat` AS `current_batter_at_bat`,`lb`.`current_pitcher_name` AS `current_pitcher_name`,`lb`.`current_pitcher_order` AS `current_pitcher_order`,`pd`.`is_swing` AS `is_swing`,`pd`.`is_missed` AS `is_missed`,`lb`.`base1_player` AS `base1_player`,`lb`.`base2_player` AS `base2_player`,`lb`.`base3_player` AS `base3_player`,`lb`.`next_batter_name` AS `next_batter_name`,`lb`.`inning_batter_cnt` AS `inning_batter_cnt`,`lb`.`current_batter_player_no` AS `current_batter_player_no`,`lb`.`current_batter_domain_hand` AS `current_batter_domain_hand`,`lb`.`current_pitcher_player_no` AS `current_pitcher_player_no`,`lb`.`current_pitcher_domain_hand` AS `current_pitcher_domain_hand`,`lb`.`current_pitcher_vs_batter_cnt` AS `current_pitcher_vs_batter_cnt`,`lb`.`current_pitcher_era` AS `current_pitcher_era`,`lh`.`away_score` AS `away_score`,`lh`.`away_initial` AS `away_initial`,`lh`.`home_score` AS `home_score`,`lh`.`home_initial` AS `home_initial`,`gi`.`away_team_initial` AS `away_team_initial`,`gi`.`home_team_initial` AS `home_team_initial`,(case substring_index(`lh`.`inning`,'回',-(1)) when '表' then `lh`.`away_initial` when '裏' then `lh`.`home_initial` end) AS `b_team`,(case substring_index(`lh`.`inning`,'回',-(1)) when '裏' then `lh`.`away_initial` when '表' then `lh`.`home_initial` end) AS `p_team`,`pi`.`game_info_id` AS `game_info_id`,`pi`.`scene` AS `scene`,`pd`.`pitch_info_id` AS `pitch_info_id`,'' AS `eol` from ((((`pitch_details` `pd` left join `pitch_info` `pi` on((`pd`.`pitch_info_id` = `pi`.`id`))) left join `live_body` `lb` on(((`lb`.`game_info_id` = `pi`.`game_info_id`) and (`lb`.`scene` = `pi`.`scene`)))) left join `live_header` `lh` on(((`lb`.`game_info_id` = `lh`.`game_info_id`) and (`lb`.`scene` = `lh`.`scene`)))) left join `game_info` `gi` on((`lb`.`game_info_id` = `gi`.`id`))) where (`gi`.`no_game` = 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_stats_batter`
--

/*!50001 DROP VIEW IF EXISTS `debug_stats_batter`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_stats_batter` AS select `gi`.`date` AS `date`,`gi`.`game_no` AS `game_no`,`sb`.`id` AS `id`,`sb`.`b_team` AS `b_team`,`sb`.`name` AS `name`,`sb`.`order` AS `order`,`sb`.`position` AS `position`,`sb`.`ave` AS `ave`,`sb`.`ab` AS `ab`,`sb`.`run` AS `run`,`sb`.`hit` AS `hit`,`sb`.`rbi` AS `rbi`,`sb`.`so` AS `so`,`sb`.`bb` AS `bb`,`sb`.`hbp` AS `hbp`,`sb`.`sh` AS `sh`,`sb`.`sb` AS `sb`,`sb`.`err` AS `err`,`sb`.`hr` AS `hr`,`sb`.`ing1` AS `ing1`,`sb`.`ing2` AS `ing2`,`sb`.`ing3` AS `ing3`,`sb`.`ing4` AS `ing4`,`sb`.`ing5` AS `ing5`,`sb`.`ing6` AS `ing6`,`sb`.`ing7` AS `ing7`,`sb`.`ing8` AS `ing8`,`sb`.`ing9` AS `ing9`,`sb`.`ing10` AS `ing10`,`sb`.`is_sm` AS `is_sm`,`sb`.`is_ph` AS `is_ph`,`sb`.`is_pr` AS `is_pr`,`sb`.`is_sf` AS `is_sf`,(case when (`sb`.`b_team` = `gi`.`away_team_initial`) then `gi`.`home_team_initial` when (`sb`.`b_team` = `gi`.`home_team_initial`) then `gi`.`away_team_initial` end) AS `oppo`,(case when (`sb`.`b_team` = `gi`.`away_team_initial`) then 1 when (`sb`.`b_team` = `gi`.`home_team_initial`) then 0 end) AS `is_away`,(case when (`sb`.`b_team` = `gi`.`away_team_initial`) then 0 when (`sb`.`b_team` = `gi`.`home_team_initial`) then 1 end) AS `is_home`,`gi`.`away_team_initial` AS `away_team_initial`,`gi`.`home_team_initial` AS `home_team_initial`,`gi`.`is_rg` AS `is_rg`,`gi`.`id` AS `game_info_id` from (`stats_batter` `sb` left join `game_info` `gi` on((`gi`.`id` = `sb`.`game_info_id`))) where (`gi`.`no_game` = 0) order by `gi`.`date`,`gi`.`game_no`,(case when (`sb`.`b_team` = `gi`.`away_team_initial`) then 1 when (`sb`.`b_team` = `gi`.`home_team_initial`) then 0 end) desc,`sb`.`order`,`sb`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `debug_stats_pitcher`
--

/*!50001 DROP VIEW IF EXISTS `debug_stats_pitcher`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `debug_stats_pitcher` AS select `gi`.`date` AS `date`,`gi`.`game_no` AS `game_no`,`sp`.`p_team` AS `p_team`,`sp`.`name` AS `name`,`sp`.`order` AS `order`,`sp`.`result` AS `result`,`sp`.`era` AS `era`,`sp`.`ip` AS `ip`,`sp`.`outs` AS `outs`,`sp`.`np` AS `np`,`sp`.`bf` AS `bf`,`sp`.`ha` AS `ha`,`sp`.`hra` AS `hra`,`sp`.`so` AS `so`,`sp`.`bb` AS `bb`,`sp`.`hbp` AS `hbp`,`sp`.`balk` AS `balk`,`sp`.`ra` AS `ra`,`sp`.`er` AS `er`,`sp`.`complete` AS `complete`,(case when (`sp`.`p_team` = `gi`.`away_team_initial`) then `gi`.`home_team_initial` when (`sp`.`p_team` = `gi`.`home_team_initial`) then `gi`.`away_team_initial` end) AS `oppo`,(case when (`sp`.`p_team` = `gi`.`away_team_initial`) then 1 when (`sp`.`p_team` = `gi`.`home_team_initial`) then 0 end) AS `is_away`,(case when (`sp`.`p_team` = `gi`.`away_team_initial`) then 0 when (`sp`.`p_team` = `gi`.`home_team_initial`) then 1 end) AS `is_home`,`gi`.`away_team_initial` AS `away_team_initial`,`gi`.`home_team_initial` AS `home_team_initial`,`gi`.`is_rg` AS `is_rg`,`gi`.`id` AS `game_info_id` from (`stats_pitcher` `sp` left join `game_info` `gi` on((`gi`.`id` = `sp`.`game_info_id`))) where (`gi`.`no_game` = 0) order by `gi`.`date`,`gi`.`game_no`,(case when (`sp`.`p_team` = `gi`.`away_team_initial`) then 1 when (`sp`.`p_team` = `gi`.`home_team_initial`) then 0 end) desc,`sp`.`order` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `game_cnt_per_day`
--

/*!50001 DROP VIEW IF EXISTS `game_cnt_per_day`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `game_cnt_per_day` AS select 1 AS `team_initial_kana`,1 AS `team_initial`,1 AS `dow`,1 AS `away_game_cnt`,1 AS `home_game_cnt`,1 AS `game_cnt`,1 AS `eol` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `game_cnt_per_month`
--

/*!50001 DROP VIEW IF EXISTS `game_cnt_per_month`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `game_cnt_per_month` AS select 1 AS `team_initial_kana`,1 AS `team_initial`,1 AS `month`,1 AS `away_game_cnt`,1 AS `home_game_cnt`,1 AS `game_cnt`,1 AS `eol` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `game_id_recent_10days`
--

/*!50001 DROP VIEW IF EXISTS `game_id_recent_10days`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `game_id_recent_10days` AS select 1 AS `team`,1 AS `id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `game_id_recent_5days`
--

/*!50001 DROP VIEW IF EXISTS `game_id_recent_5days`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `game_id_recent_5days` AS (select 'ソ' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = 'ソ') or (`game_info`.`home_team_initial` = 'ソ')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select 'ロ' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = 'ロ') or (`game_info`.`home_team_initial` = 'ロ')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '楽' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '楽') or (`game_info`.`home_team_initial` = '楽')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '日' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '日') or (`game_info`.`home_team_initial` = '日')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '西' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '西') or (`game_info`.`home_team_initial` = '西')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select 'オ' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = 'オ') or (`game_info`.`home_team_initial` = 'オ')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '巨' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '巨') or (`game_info`.`home_team_initial` = '巨')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '神' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '神') or (`game_info`.`home_team_initial` = '神')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select 'デ' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = 'デ') or (`game_info`.`home_team_initial` = 'デ')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '中' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '中') or (`game_info`.`home_team_initial` = '中')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select '広' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = '広') or (`game_info`.`home_team_initial` = '広')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) union (select 'ヤ' AS `team`,`game_info`.`id` AS `id` from `game_info` where (((`game_info`.`away_team_initial` = 'ヤ') or (`game_info`.`home_team_initial` = 'ヤ')) and (`game_info`.`no_game` = 0)) order by `game_info`.`date` desc limit 5) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-13 22:24:28
