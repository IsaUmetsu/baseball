CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `debug_base` AS
    SELECT 
        `gi`.`id` AS `g_id`,
        `lb`.`scene` AS `scene`,
        `gi`.`date` AS `date`,
        `gi`.`game_no` AS `game_no`,
        `lh`.`away_score` AS `away_score`,
        `lh`.`away_initial` AS `away_initial`,
        `lh`.`home_score` AS `home_score`,
        `lh`.`home_initial` AS `home_initial`,
        `lh`.`inning` AS `inning`,
        `lh`.`ing_num` AS `ing_num`,
        `lh`.`ing_tb` AS `ing_tb`,
        `lb`.`batting_result` AS `batting_result`,
        `go`.`order_no` AS `order_no`,
        `go`.`position` AS `position`,
        `lb`.`current_batter_name` AS `current_batter_name`,
        `lb`.`current_pitcher_name` AS `current_pitcher_name`,
        `lb`.`pitching_result` AS `pitching_result`,
        `lb`.`current_batter_at_bat` AS `current_batter_at_bat`,
        `lb`.`current_batter_player_no` AS `current_batter_player_no`,
        `lb`.`current_batter_domain_hand` AS `current_batter_domain_hand`,
        `lb`.`current_batter_average` AS `current_batter_average`,
        `lb`.`current_pitcher_order` AS `current_pitcher_order`,
        `lb`.`current_pitcher_player_no` AS `current_pitcher_player_no`,
        `lb`.`current_pitcher_domain_hand` AS `current_pitcher_domain_hand`,
        `lb`.`current_pitcher_pitch` AS `current_pitcher_pitch`,
        `lb`.`current_pitcher_vs_batter_cnt` AS `current_pitcher_vs_batter_cnt`,
        `lb`.`current_pitcher_era` AS `current_pitcher_era`,
        `lb`.`base1_player` AS `base1_player`,
        `lb`.`base2_player` AS `base2_player`,
        `lb`.`base3_player` AS `base3_player`,
        `lb`.`next_batter_name` AS `next_batter_name`,
        `lb`.`inning_batter_cnt` AS `inning_batter_cnt`,
        `lb`.`prev_count_ball` AS `prev_count_ball`,
        `lb`.`prev_count_strike` AS `prev_count_strike`,
        `lb`.`prev_count_out` AS `prev_count_out`,
        `lb`.`plus_score` AS `plus_score`,
        `lb`.`plus_out_count` AS `plus_out_count`,
        `lb`.`is_pa` AS `is_pa`,
        `lb`.`is_ab` AS `is_ab`,
        `lb`.`is_hit` AS `is_hit`,
        `lb`.`is_onbase` AS `is_onbase`,
        `lb`.`total_base` AS `total_base`,
        `lb`.`is_err` AS `is_err`,
        `lb`.`is_fc` AS `is_fc`,
        `lb`.`is_change_pitcher` AS `is_change_pitcher`,
        `lb`.`is_change_fileder` AS `is_change_fileder`,
        `lb`.`is_change_batter` AS `is_change_batter`,
        `lb`.`is_change_runner` AS `is_change_runner`,
        `gi`.`away_team_initial` AS `away_team_initial`,
        `gi`.`home_team_initial` AS `home_team_initial`,
        `lh`.`count_ball` AS `after_count_ball`,
        `lh`.`count_strike` AS `after_count_strike`,
        `lh`.`count_out` AS `after_count_out`,
        `lh`.`p_team` AS `p_team`,
        `lh`.`b_team` AS `b_team`,
        `lb`.`id` AS `lb_id`,
        `lb`.`game_info_id` AS `game_info_id`,
        `lh`.`id` AS `lh_id`,
        `gi`.`no_game` AS `no_game`,
        `gi`.`is_cs` AS `is_cs`,
        `gi`.`is_js` AS `is_js`,
        '' AS `eol`
    FROM
        ((((`live_body` `lb`
        LEFT JOIN `live_header` `lh` ON (((`lb`.`game_info_id` = `lh`.`game_info_id`)
            AND (`lb`.`scene` = `lh`.`scene`))))
        LEFT JOIN `game_info` `gi` ON ((`lb`.`game_info_id` = `gi`.`id`)))
        LEFT JOIN `team_info` `ti` ON (((`lb`.`game_info_id` = `ti`.`game_info_id`)
            AND (`lb`.`scene` = `ti`.`scene`)
            AND (`ti`.`team_initial_kana` = (`lh`.`b_team`)))))
        LEFT JOIN `game_order` `go` ON (((`ti`.`id` = `go`.`team_info_id`)
            AND (`go`.`name` = `lb`.`current_batter_name`))))
    WHERE
        (`gi`.`no_game` = 0)
    ORDER BY `gi`.`date` , `gi`.`game_no` , `lb`.`id`;
