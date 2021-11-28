CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `debug_stats_pitcher` AS
    SELECT 
        `gi`.`date` AS `date`,
        `gi`.`game_no` AS `game_no`,
        `sp`.`p_team` AS `p_team`,
        `sp`.`name` AS `name`,
        `sp`.`order` AS `order`,
        `sp`.`result` AS `result`,
        `sp`.`era` AS `era`,
        `sp`.`ip` AS `ip`,
        `sp`.`outs` AS `outs`,
        `sp`.`np` AS `np`,
        `sp`.`bf` AS `bf`,
        `sp`.`ha` AS `ha`,
        `sp`.`hra` AS `hra`,
        `sp`.`so` AS `so`,
        `sp`.`bb` AS `bb`,
        `sp`.`hbp` AS `hbp`,
        `sp`.`balk` AS `balk`,
        `sp`.`ra` AS `ra`,
        `sp`.`er` AS `er`,
        `sp`.`complete` AS `complete`,
        (CASE
            WHEN (`sp`.`p_team` = `gi`.`away_team_initial`) THEN `gi`.`home_team_initial`
            WHEN (`sp`.`p_team` = `gi`.`home_team_initial`) THEN `gi`.`away_team_initial`
        END) AS `oppo`,
        (CASE
            WHEN (`sp`.`p_team` = `gi`.`away_team_initial`) THEN 1
            WHEN (`sp`.`p_team` = `gi`.`home_team_initial`) THEN 0
        END) AS `is_away`,
        (CASE
            WHEN (`sp`.`p_team` = `gi`.`away_team_initial`) THEN 0
            WHEN (`sp`.`p_team` = `gi`.`home_team_initial`) THEN 1
        END) AS `is_home`,
        `gi`.`away_team_initial` AS `away_team_initial`,
        `gi`.`home_team_initial` AS `home_team_initial`,
        `gi`.`is_rg` AS `is_rg`,
        `gi`.`id` AS `game_info_id`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        (`gi`.`no_game` = 0)
    ORDER BY `gi`.`date` , `gi`.`game_no` , (CASE
        WHEN (`sp`.`p_team` = `gi`.`away_team_initial`) THEN 1
        WHEN (`sp`.`p_team` = `gi`.`home_team_initial`) THEN 0
    END) DESC , `sp`.`order`;
