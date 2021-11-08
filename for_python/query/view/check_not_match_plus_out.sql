CREATE VIEW `check_not_match_plus_out` AS
    SELECT 
        `l`.`g_id` AS `g_id`,
        `l`.`date` AS `date`,
        `l`.`game_no` AS `game_no`,
        `l`.`away_team_initial` AS `away_team_initial`,
        `l`.`home_team_initial` AS `home_team_initial`,
        `l`.`lb_id` AS `lb_id`,
        `l`.`inning` AS `inning`,
        `l`.`batting_result` AS `batting_result`,
        `l`.`pitching_result` AS `pitching_result`,
        `l`.`current_batter_name` AS `current_batter_name`,
        `l`.`current_pitcher_name` AS `current_pitcher_name`,
        `l`.`prev_count_out` AS `prev_count_out`,
        `l`.`plus_out_count` AS `plus_out_count`,
        `l`.`after_count_out` AS `after_count_out`,
        (CASE
            WHEN ISNULL(`r`.`after_count_out`) THEN `l`.`after_count_out`
            ELSE (`l`.`after_count_out` - `r`.`after_count_out`)
        END) AS `plus_out_count_new`,
        `l`.`eol` AS `eol`
    FROM
        (((SELECT 
            `debug_base`.`g_id` AS `g_id`,
                `debug_base`.`date` AS `date`,
                `debug_base`.`game_no` AS `game_no`,
                `debug_base`.`away_team_initial` AS `away_team_initial`,
                `debug_base`.`home_team_initial` AS `home_team_initial`,
                `debug_base`.`lb_id` AS `lb_id`,
                `debug_base`.`inning` AS `inning`,
                `debug_base`.`batting_result` AS `batting_result`,
                `debug_base`.`pitching_result` AS `pitching_result`,
                `debug_base`.`current_batter_name` AS `current_batter_name`,
                `debug_base`.`current_pitcher_name` AS `current_pitcher_name`,
                `debug_base`.`prev_count_out` AS `prev_count_out`,
                `debug_base`.`plus_out_count` AS `plus_out_count`,
                `debug_base`.`after_count_out` AS `after_count_out`,
                `debug_base`.`eol` AS `eol`
        FROM
            `baseball_2021`.`debug_base`)) `L`
        LEFT JOIN (SELECT 
            `debug_base`.`g_id` AS `g_id`,
                `debug_base`.`date` AS `date`,
                `debug_base`.`game_no` AS `game_no`,
                `debug_base`.`away_team_initial` AS `away_team_initial`,
                `debug_base`.`home_team_initial` AS `home_team_initial`,
                `debug_base`.`lb_id` AS `lb_id`,
                `debug_base`.`inning` AS `inning`,
                `debug_base`.`batting_result` AS `batting_result`,
                `debug_base`.`pitching_result` AS `pitching_result`,
                `debug_base`.`current_batter_name` AS `current_batter_name`,
                `debug_base`.`current_pitcher_name` AS `current_pitcher_name`,
                `debug_base`.`prev_count_out` AS `prev_count_out`,
                `debug_base`.`plus_out_count` AS `plus_out_count`,
                `debug_base`.`after_count_out` AS `after_count_out`,
                `debug_base`.`eol` AS `eol`
        FROM
            `baseball_2021`.`debug_base`) `R` ON (((`l`.`g_id` = `r`.`g_id`)
            AND (`l`.`lb_id` = (`r`.`lb_id` + 1))
            AND (`l`.`inning` = `r`.`inning`))))
    WHERE
        (`l`.`plus_out_count` <> (CASE
            WHEN ISNULL(`r`.`after_count_out`) THEN `l`.`after_count_out`
            ELSE (`l`.`after_count_out` - `r`.`after_count_out`)
        END))