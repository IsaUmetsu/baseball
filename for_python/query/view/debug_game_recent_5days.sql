CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `debug_game_bat_rc5` AS
    SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = 'ソ')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ソ')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = 'ソ')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ソ')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = 'ロ')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ロ')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = 'ロ')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ロ')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '楽')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '楽')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '楽')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '楽')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '日')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '日')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '日')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '日')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '西')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '西')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '西')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '西')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = 'オ')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'オ')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = 'オ')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'オ')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '巨')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '巨')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '巨')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '巨')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '神')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '神')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '神')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '神')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = 'デ')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'デ')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = 'デ')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'デ')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '中')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '中')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '中')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '中')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = '広')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '広')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = '広')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = '広')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`)))) 
    UNION SELECT 
        `base`.`batter` AS `batter`,
        `base`.`all_bat` AS `all_bat`,
        `base`.`pa` AS `pa`,
        `base`.`b_team` AS `b_team`,
        `base`.`bat` AS `bat`,
        `base`.`hit` AS `hit`,
        `base`.`onbase` AS `onbase`,
        `base`.`total_base` AS `total_base`,
        `base`.`average` AS `average`,
        `base`.`average_onbase` AS `average_onbase`,
        `base`.`average_slugging` AS `average_slugging`,
        (`base`.`average_onbase` + `base`.`average_slugging`) AS `ops`,
        `other`.`hr` AS `hr`,
        `other`.`rbi` AS `rbi`,
        `other`.`bb` AS `bb`,
        `other`.`hbp` AS `hbp`,
        `base`.`eol` AS `eol`
    FROM
        (((SELECT 
            REPLACE(`debug_base`.`current_batter_name`, ' ', '') AS `batter`,
                COUNT(`debug_base`.`current_batter_name`) AS `all_bat`,
                SUM(`debug_base`.`is_pa`) AS `pa`,
                `debug_base`.`b_team` AS `b_team`,
                SUM(`debug_base`.`is_ab`) AS `bat`,
                SUM(`debug_base`.`is_hit`) AS `hit`,
                SUM(`debug_base`.`is_onbase`) AS `onbase`,
                SUM(`debug_base`.`total_base`) AS `total_base`,
                ROUND((SUM(`debug_base`.`is_hit`) / SUM(`debug_base`.`is_ab`)), 3) AS `average`,
                ROUND((SUM(`debug_base`.`is_onbase`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_onbase`,
                ROUND((SUM(`debug_base`.`total_base`) / SUM(`debug_base`.`is_pa`)), 3) AS `average_slugging`,
                '' AS `eol`
        FROM
            `baseball_2020`.`debug_base`
        WHERE
            ((`debug_base`.`is_pa` = 1)
                AND (`debug_base`.`b_team` = 'ヤ')
                AND `debug_base`.`g_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ヤ')))
        GROUP BY `debug_base`.`current_batter_name` , `debug_base`.`b_team`
        HAVING (`pa` >= (3.1 * 5)))) `base`
        LEFT JOIN (SELECT 
            `baseball_2020`.`stats_batter`.`b_team` AS `b_team`,
                `baseball_2020`.`stats_batter`.`name` AS `name`,
                REPLACE(`baseball_2020`.`stats_batter`.`name`, ' ', '') AS `batter`,
                SUM(`baseball_2020`.`stats_batter`.`rbi`) AS `rbi`,
                SUM(`baseball_2020`.`stats_batter`.`hr`) AS `hr`,
                SUM(`baseball_2020`.`stats_batter`.`bb`) AS `bb`,
                SUM(`baseball_2020`.`stats_batter`.`hbp`) AS `hbp`
        FROM
            `baseball_2020`.`stats_batter`
        WHERE
            ((`baseball_2020`.`stats_batter`.`b_team` = 'ヤ')
                AND `baseball_2020`.`stats_batter`.`game_info_id` IN (SELECT 
                    `game_id_recent_5days`.`id`
                FROM
                    `baseball_2020`.`game_id_recent_5days`
                WHERE
                    (`game_id_recent_5days`.`team` = 'ヤ')))
        GROUP BY `baseball_2020`.`stats_batter`.`name` , `baseball_2020`.`stats_batter`.`b_team`) `other` ON (((`base`.`batter` = `other`.`batter`)
            AND (`base`.`b_team` = `other`.`b_team`))));
