CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `game_cnt_per_month` AS
    SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            6 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 6)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            6 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 6)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            7 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`game_info`.`away_team_initial`)) THEN 0
                    ELSE COUNT(`game_info`.`away_team_initial`)
                END) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 7)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            7 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`game_info`.`home_team_initial`)) THEN 0
                    ELSE COUNT(`game_info`.`home_team_initial`)
                END) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 7)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            8 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 8)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            8 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 8)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            9 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 9)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            9 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 9)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            10 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 10)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            10 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 10)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        (CASE
            WHEN (`away`.`month` IS NOT NULL) THEN `away`.`month`
            WHEN (`home`.`month` IS NOT NULL) THEN `home`.`month`
        END) AS `month`,
        IFNULL(`away`.`game_cnt`, 0) AS `away_game_cnt`,
        IFNULL(`home`.`game_cnt`, 0) AS `home_game_cnt`,
        (IFNULL(`away`.`game_cnt`, 0) + IFNULL(`home`.`game_cnt`, 0)) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            11 AS `month`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 11)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            11 AS `month`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DATE_FORMAT(STR_TO_DATE(`game_info`.`date`, '%Y%m%d'), '%c') = 11)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`)));
