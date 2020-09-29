CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `debug_dup_scenes` AS
    SELECT 
        `gi`.`date` AS `date`,
        `gi`.`away_team_initial` AS `a`,
        `gi`.`home_team_initial` AS `h`,
        `lb1`.`id` AS `prev_lb_id`,
        `lb1`.`game_info_id` AS `game_info_id`,
        `lb1`.`scene` AS `prev_scene`,
        `lb2`.`scene` AS `after_scene`,
        `lb1`.`batting_result` AS `prev_b_result`,
        `lb2`.`batting_result` AS `after_b_result`,
        `lb1`.`pitching_result` AS `prev_p_result`,
        `lb2`.`pitching_result` AS `after_p_result`,
        `lb2`.`id` AS `after_lb_id`,
        '' AS `eol`
    FROM
        ((`live_body` `lb1`
        LEFT JOIN `live_body` `lb2` ON ((`lb1`.`id` = (`lb2`.`id` + 1))))
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `lb1`.`game_info_id`)))
    WHERE
        ((`lb1`.`current_batter_name` = `lb2`.`current_batter_name`)
            AND (`lb1`.`batting_result` = `lb2`.`batting_result`)
            AND (`lb1`.`pitching_result` = `lb2`.`pitching_result`));
