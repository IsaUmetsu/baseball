CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `game_cnt_per_day` AS
    SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            1 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 1)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            1 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 1)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            2 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`game_info`.`away_team_initial`)) THEN 0
                    ELSE COUNT(`game_info`.`away_team_initial`)
                END) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 2)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            2 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`game_info`.`home_team_initial`)) THEN 0
                    ELSE COUNT(`game_info`.`home_team_initial`)
                END) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 2)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            3 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 3)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            3 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 3)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            4 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 4)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            4 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 4)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            5 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 5)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            5 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 5)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            6 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 6)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            6 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 6)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`team_master` `tm`
        LEFT JOIN (SELECT 
            7 AS `dow`,
                `game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 7)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            7 AS `dow`,
                `game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `game_info`
        WHERE
            ((DAYOFWEEK(`game_info`.`date`) = 7)
                AND (`game_info`.`no_game` = 0))
        GROUP BY `game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`)));
