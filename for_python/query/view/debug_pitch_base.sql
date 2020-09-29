CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `debug_pitch_base` AS
    SELECT 
        `gi`.`date` AS `date`,
        `gi`.`game_no` AS `game_no`,
        `lh`.`inning` AS `inning`,
        SUBSTRING_INDEX(`lh`.`inning`, '回', 1) AS `ing_num`,
        (CASE SUBSTRING_INDEX(`lh`.`inning`, '回', -(1))
            WHEN '表' THEN 1
            WHEN '裏' THEN 2
        END) AS `ing_tb`,
        `pd`.`judge_icon` AS `judge_icon`,
        `pd`.`pitch_cnt` AS `pitch_cnt`,
        `pd`.`pitch_type` AS `pitch_type`,
        `pd`.`pitch_speed` AS `pitch_speed`,
        `pd`.`pitch_judge_detail` AS `pitch_judge_detail`,
        `lb`.`current_batter_name` AS `current_batter_name`,
        `lb`.`current_batter_at_bat` AS `current_batter_at_bat`,
        `lb`.`current_pitcher_name` AS `current_pitcher_name`,
        `lb`.`current_pitcher_order` AS `current_pitcher_order`,
        `pd`.`is_swing` AS `is_swing`,
        `pd`.`is_missed` AS `is_missed`,
        `lb`.`base1_player` AS `base1_player`,
        `lb`.`base2_player` AS `base2_player`,
        `lb`.`base3_player` AS `base3_player`,
        `lb`.`next_batter_name` AS `next_batter_name`,
        `lb`.`inning_batter_cnt` AS `inning_batter_cnt`,
        `lb`.`current_batter_player_no` AS `current_batter_player_no`,
        `lb`.`current_batter_domain_hand` AS `current_batter_domain_hand`,
        `lb`.`current_pitcher_player_no` AS `current_pitcher_player_no`,
        `lb`.`current_pitcher_domain_hand` AS `current_pitcher_domain_hand`,
        `lb`.`current_pitcher_vs_batter_cnt` AS `current_pitcher_vs_batter_cnt`,
        `lb`.`current_pitcher_era` AS `current_pitcher_era`,
        `lh`.`away_score` AS `away_score`,
        `lh`.`away_initial` AS `away_initial`,
        `lh`.`home_score` AS `home_score`,
        `lh`.`home_initial` AS `home_initial`,
        `gi`.`away_team_initial` AS `away_team_initial`,
        `gi`.`home_team_initial` AS `home_team_initial`,
        (CASE SUBSTRING_INDEX(`lh`.`inning`, '回', -(1))
            WHEN '表' THEN `lh`.`away_initial`
            WHEN '裏' THEN `lh`.`home_initial`
        END) AS `b_team`,
        (CASE SUBSTRING_INDEX(`lh`.`inning`, '回', -(1))
            WHEN '裏' THEN `lh`.`away_initial`
            WHEN '表' THEN `lh`.`home_initial`
        END) AS `p_team`,
        `pi`.`game_info_id` AS `game_info_id`,
        `pi`.`scene` AS `scene`,
        `pd`.`pitch_info_id` AS `pitch_info_id`,
        '' AS `eol`
    FROM
        ((((`pitch_details` `pd`
        LEFT JOIN `pitch_info` `pi` ON ((`pd`.`pitch_info_id` = `pi`.`id`)))
        LEFT JOIN `live_body` `lb` ON (((`lb`.`game_info_id` = `pi`.`game_info_id`)
            AND (`lb`.`scene` = `pi`.`scene`))))
        LEFT JOIN `live_header` `lh` ON (((`lb`.`game_info_id` = `lh`.`game_info_id`)
            AND (`lb`.`scene` = `lh`.`scene`))))
        LEFT JOIN `game_info` `gi` ON ((`lb`.`game_info_id` = `gi`.`id`)))
    WHERE
        (`gi`.`no_game` = 0);
