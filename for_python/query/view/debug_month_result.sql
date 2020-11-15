create VIEW `debug_month_result` AS
    SELECT 
        `ss1`.`b_team` AS `t_team`,
        `ss1`.`total` AS `t_total`,
        `ss2`.`b_team` AS `b_team`,
        `ss2`.`total` AS `b_total`,
        (CASE
            WHEN (CAST(`ss1`.`total` AS SIGNED) > CAST(`ss2`.`total` AS SIGNED)) THEN `ss1`.`b_team`
            WHEN (CAST(`ss1`.`total` AS SIGNED) < CAST(`ss2`.`total` AS SIGNED)) THEN `ss2`.`b_team`
            ELSE NULL
        END) AS `win_team`,
        (CASE
            WHEN (CAST(`ss1`.`total` AS SIGNED) < CAST(`ss2`.`total` AS SIGNED)) THEN `ss1`.`b_team`
            WHEN (CAST(`ss1`.`total` AS SIGNED) > CAST(`ss2`.`total` AS SIGNED)) THEN `ss2`.`b_team`
            ELSE NULL
        END) AS `lose_team`,
        (CASE
            WHEN (`ss1`.`total` = `ss2`.`total`) THEN `ss1`.`b_team`
        END) AS `draw_team_1`,
        (CASE
            WHEN (`ss1`.`total` = `ss2`.`total`) THEN `ss2`.`b_team`
        END) AS `draw_team_2`,
        `gi`.`date` AS `date`,
        `gi`.`id` AS `game_info_id`,
        CAST(DATE_FORMAT(STR_TO_DATE(`gi`.`date`, '%Y%m%d'), '%c')
            AS SIGNED) AS `month`,
        '' AS `eol`
    FROM
        ((`stats_scoreboard` `ss1`
        LEFT JOIN `stats_scoreboard` `ss2` ON (((`ss1`.`game_info_id` = `ss2`.`game_info_id`)
            AND ((`ss1`.`id` + 1) = `ss2`.`id`))))
        LEFT JOIN `game_info` `gi` ON ((`ss1`.`game_info_id` = `gi`.`id`)))
    WHERE
        (`ss2`.`id` IS NOT NULL) AND gi.no_game = 0;
