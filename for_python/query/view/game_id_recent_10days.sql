CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `game_id_recent_10days` AS
    (SELECT 
        'ソ' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = 'ソ')
            OR (`game_info`.`home_team_initial` = 'ソ'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        'ロ' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = 'ロ')
            OR (`game_info`.`home_team_initial` = 'ロ'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '楽' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '楽')
            OR (`game_info`.`home_team_initial` = '楽'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '日' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '日')
            OR (`game_info`.`home_team_initial` = '日'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '西' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '西')
            OR (`game_info`.`home_team_initial` = '西'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        'オ' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = 'オ')
            OR (`game_info`.`home_team_initial` = 'オ'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '巨' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '巨')
            OR (`game_info`.`home_team_initial` = '巨'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '神' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '神')
            OR (`game_info`.`home_team_initial` = '神'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        'デ' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = 'デ')
            OR (`game_info`.`home_team_initial` = 'デ'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '中' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '中')
            OR (`game_info`.`home_team_initial` = '中'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        '広' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = '広')
            OR (`game_info`.`home_team_initial` = '広'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10) UNION (SELECT 
        'ヤ' AS `team`, `game_info`.`id` AS `id`
    FROM
        `game_info`
    WHERE
        (((`game_info`.`away_team_initial` = 'ヤ')
            OR (`game_info`.`home_team_initial` = 'ヤ'))
            AND (`game_info`.`no_game` = 0))
    ORDER BY `game_info`.`date` DESC
    LIMIT 10);
