CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `debug_game_pitch_mid_rc10` AS
    SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = 'ソ'))
            AND (`sp`.`p_team` = 'ソ'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = 'ロ'))
            AND (`sp`.`p_team` = 'ロ'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '楽'))
            AND (`sp`.`p_team` = '楽'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '日'))
            AND (`sp`.`p_team` = '日'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '西'))
            AND (`sp`.`p_team` = '西'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = 'オ'))
            AND (`sp`.`p_team` = 'オ'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '巨'))
            AND (`sp`.`p_team` = '巨'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '神'))
            AND (`sp`.`p_team` = '神'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = 'デ'))
            AND (`sp`.`p_team` = 'デ'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '中'))
            AND (`sp`.`p_team` = '中'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = '広'))
            AND (`sp`.`p_team` = '広'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0) 
    UNION SELECT 
        `sp`.`p_team` AS `tm`,
        REPLACE(`sp`.`name`, ' ', '') AS `p_name`,
        COUNT(`sp`.`name`) AS `game_cnt`,
        COUNT(((`sp`.`result` = '勝') OR NULL)) AS `win`,
        COUNT(((`sp`.`result` = '敗') OR NULL)) AS `lose`,
        COUNT(((`sp`.`result` = 'H') OR NULL)) AS `hold`,
        COUNT(((`sp`.`result` = 'S') OR NULL)) AS `save`,
        ROUND(((SUM(`sp`.`er`) * 27) / SUM(`sp`.`outs`)),
                2) AS `era`,
        CONCAT((SUM(`sp`.`outs`) DIV 3),
                (CASE
                    WHEN ((SUM(`sp`.`outs`) % 3) > 0) THEN CONCAT('.', (SUM(`sp`.`outs`) % 3))
                    ELSE ''
                END)) AS `inning`,
        SUM(`sp`.`ra`) AS `ra`,
        SUM(`sp`.`er`) AS `er`,
        '' AS `eol`
    FROM
        (`stats_pitcher` `sp`
        LEFT JOIN `game_info` `gi` ON ((`gi`.`id` = `sp`.`game_info_id`)))
    WHERE
        ((`sp`.`order` > 1)
            AND `sp`.`game_info_id` IN (SELECT 
                `game_id_recent_10days`.`id`
            FROM
                `game_id_recent_10days`
            WHERE
                (`game_id_recent_10days`.`team` = 'ヤ'))
            AND (`sp`.`p_team` = 'ヤ'))
    GROUP BY `sp`.`name` , `sp`.`p_team`
    HAVING (SUM(`sp`.`outs`) > 0);
