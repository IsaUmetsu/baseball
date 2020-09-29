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
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            1 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 1)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            1 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 1)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            2 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`baseball_2020`.`game_info`.`away_team_initial`)) THEN 0
                    ELSE COUNT(`baseball_2020`.`game_info`.`away_team_initial`)
                END) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 2)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            2 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                (CASE
                    WHEN ISNULL(COUNT(`baseball_2020`.`game_info`.`home_team_initial`)) THEN 0
                    ELSE COUNT(`baseball_2020`.`game_info`.`home_team_initial`)
                END) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 2)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            3 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 3)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            3 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 3)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            4 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 4)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            4 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 4)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            5 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 5)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            5 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 5)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            6 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 6)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            6 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 6)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`))) 
    UNION SELECT 
        `tm`.`team_initial_kana` AS `team_initial_kana`,
        `tm`.`team_initial` AS `team_initial`,
        `away`.`dow` AS `dow`,
        `away`.`game_cnt` AS `away_game_cnt`,
        `home`.`game_cnt` AS `home_game_cnt`,
        (`away`.`game_cnt` + `home`.`game_cnt`) AS `game_cnt`,
        '' AS `eol`
    FROM
        ((`baseball_2020`.`team_master` `tm`
        LEFT JOIN (SELECT 
            7 AS `dow`,
                `baseball_2020`.`game_info`.`away_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`away_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 7)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`away_team_initial`) `away` ON ((`away`.`team_initial` = `tm`.`team_initial_kana`)))
        LEFT JOIN (SELECT 
            7 AS `dow`,
                `baseball_2020`.`game_info`.`home_team_initial` AS `team_initial`,
                COUNT(`baseball_2020`.`game_info`.`home_team_initial`) AS `game_cnt`
        FROM
            `baseball_2020`.`game_info`
        WHERE
            ((DAYOFWEEK(`baseball_2020`.`game_info`.`date`) = 7)
                AND (`baseball_2020`.`game_info`.`no_game` = 0))
        GROUP BY `baseball_2020`.`game_info`.`home_team_initial`) `home` ON ((`home`.`team_initial` = `tm`.`team_initial_kana`)));
