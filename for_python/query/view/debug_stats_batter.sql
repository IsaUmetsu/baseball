CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `debug_stats_batter` AS
    SELECT 
        `gi`.`date` AS `date`,
        `gi`.`game_no` AS `game_no`,
        `sb`.`id` AS `id`,
        `sb`.`b_team` AS `b_team`,
        `sb`.`name` AS `name`,
        `sb`.`order` AS `order`,
        `sb`.`position` AS `position`,
        `sb`.`ave` AS `ave`,
        `sb`.`ab` AS `ab`,
        `sb`.`run` AS `run`,
        `sb`.`hit` AS `hit`,
        `sb`.`rbi` AS `rbi`,
        `sb`.`so` AS `so`,
        `sb`.`bb` AS `bb`,
        `sb`.`hbp` AS `hbp`,
        `sb`.`sh` AS `sh`,
        `sb`.`sb` AS `sb`,
        `sb`.`err` AS `err`,
        `sb`.`hr` AS `hr`,
        `sb`.`ing1` AS `ing1`,
        `sb`.`ing2` AS `ing2`,
        `sb`.`ing3` AS `ing3`,
        `sb`.`ing4` AS `ing4`,
        `sb`.`ing5` AS `ing5`,
        `sb`.`ing6` AS `ing6`,
        `sb`.`ing7` AS `ing7`,
        `sb`.`ing8` AS `ing8`,
        `sb`.`ing9` AS `ing9`,
        `sb`.`ing10` AS `ing10`,
        `sb`.`is_sm` AS `is_sm`,
        `sb`.`is_ph` AS `is_ph`,
        `sb`.`is_pr` AS `is_pr`,
        `sb`.`is_sf` AS `is_sf`,
        (CASE
            WHEN (`sb`.`b_team` = `gi`.`away_team_initial`) THEN `gi`.`home_team_initial`
            WHEN (`sb`.`b_team` = `gi`.`home_team_initial`) THEN `gi`.`away_team_initial`
        END) AS `oppo`,
        (CASE
            WHEN (`sb`.`b_team` = `gi`.`away_team_initial`) THEN 1
            WHEN (`sb`.`b_team` = `gi`.`home_team_initial`) THEN 0
        END) AS `is_away`,
        (CASE
            WHEN (`sb`.`b_team` = `gi`.`away_team_initial`) THEN 0
            WHEN (`sb`.`b_team` = `gi`.`home_team_initial`) THEN 1
        END) AS `is_home`,
        `gi`.`away_team_initial` AS `away_team_initial`,
        `gi`.`home_team_initial` AS `home_team_initial`,
        `gi`.`id` AS `game_info_id`
    FROM
        (`stats_batter` `sb`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sb`.`game_info_id`)))
    WHERE
        (`gi`.`no_game` = 0)
    ORDER BY `gi`.`date` , `gi`.`game_no` , (CASE
        WHEN (`sb`.`b_team` = `gi`.`away_team_initial`) THEN 1
        WHEN (`sb`.`b_team` = `gi`.`home_team_initial`) THEN 0
    END) DESC , `sb`.`order` , `sb`.`id`;
