SELECT 
	-- g.id,
    oo.date,
    CASE
        WHEN g.top_bottom = 1 THEN oo.home_team
        WHEN g.top_bottom = 2 THEN oo.visitor_team
        ELSE ''
    END AS team,
    pi.batter_pitch_count AS p_count,
    CONCAT(g.ining,
            '回',
            CASE
                WHEN g.top_bottom = 1 THEN '表'
                WHEN g.top_bottom = 2 THEN '裏'
                ELSE ''
            END) AS ining_full,
    pp.name,
    IFNULL((SELECT total
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = case when g.top_bottom = 1 then 2 when g.top_bottom = 2 then 1 else 0 end),
            0) AS oppo_scr,
    IFNULL((SELECT total
--                     CASE
--                             WHEN g.ining = 1 THEN inning_1
--                             WHEN g.ining = 2 THEN inning_2
--                             WHEN g.ining = 3 THEN inning_3
--                             WHEN g.ining = 4 THEN inning_4
--                             WHEN g.ining = 5 THEN inning_5
--                             WHEN g.ining = 6 THEN inning_6
--                             WHEN g.ining = 7 THEN inning_7
--                             WHEN g.ining = 8 THEN inning_8
--                             WHEN g.ining = 9 THEN inning_9
--                             WHEN g.ining = 10 THEN inning_10
--                             WHEN g.ining = 11 THEN inning_11
--                             WHEN g.ining = 12 THEN inning_12
--                             ELSE 0
--                         END
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                        AND top_bottom = g.top_bottom),
            0) AS prev_scr,
    (SELECT total
--             CASE
--                     WHEN g.ining = 1 THEN inning_1
--                     WHEN g.ining = 2 THEN inning_2
--                     WHEN g.ining = 3 THEN inning_3
--                     WHEN g.ining = 4 THEN inning_4
--                     WHEN g.ining = 5 THEN inning_5
--                     WHEN g.ining = 6 THEN inning_6
--                     WHEN g.ining = 7 THEN inning_7
--                     WHEN g.ining = 8 THEN inning_8
--                     WHEN g.ining = 9 THEN inning_9
--                     WHEN g.ining = 10 THEN inning_10
--                     WHEN g.ining = 11 THEN inning_11
--                     WHEN g.ining = 12 THEN inning_12
--                     ELSE 0
--                 END
        FROM
            game_score_info
        WHERE
            game_info_id = g.id + 1
                AND top_bottom = g.top_bottom) AS atr_scr,
    (SELECT 
            CASE
                    WHEN g.ining = 1 THEN inning_1
                    WHEN g.ining = 2 THEN inning_2
                    WHEN g.ining = 3 THEN inning_3
                    WHEN g.ining = 4 THEN inning_4
                    WHEN g.ining = 5 THEN inning_5
                    WHEN g.ining = 6 THEN inning_6
                    WHEN g.ining = 7 THEN inning_7
                    WHEN g.ining = 8 THEN inning_8
                    WHEN g.ining = 9 THEN inning_9
                    WHEN g.ining = 10 THEN inning_10
                    WHEN g.ining = 11 THEN inning_11
                    WHEN g.ining = 12 THEN inning_12
                    ELSE 0
                END
        FROM
            game_score_info
        WHERE
            game_info_id = g.id
                AND top_bottom = g.top_bottom) - IFNULL((SELECT 
                    CASE
                            WHEN g.ining = 1 THEN inning_1
                            WHEN g.ining = 2 THEN inning_2
                            WHEN g.ining = 3 THEN inning_3
                            WHEN g.ining = 4 THEN inning_4
                            WHEN g.ining = 5 THEN inning_5
                            WHEN g.ining = 6 THEN inning_6
                            WHEN g.ining = 7 THEN inning_7
                            WHEN g.ining = 8 THEN inning_8
                            WHEN g.ining = 9 THEN inning_9
                            WHEN g.ining = 10 THEN inning_10
                            WHEN g.ining = 11 THEN inning_11
                            WHEN g.ining = 12 THEN inning_12
                            ELSE 0
                        END
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id - 1
                        AND top_bottom = g.top_bottom),
            0) AS diff,
	CASE
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) = 0
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0) = 0
        THEN
            '先制'
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) > IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0)
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) > (SELECT 
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = g.top_bottom)
        THEN
            '追い上げ'
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) > IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0)
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) = (SELECT 
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = g.top_bottom)
        THEN
            '同点'
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) > IFNULL((SELECT 
                            cast(total as signed)l
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0)
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) < (SELECT 
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = g.top_bottom)
        THEN
            '逆転'
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) = IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0)
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) < (SELECT 
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = g.top_bottom)
        THEN
            '勝ち越し'
        WHEN
            IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) < IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id
                                AND top_bottom = g.top_bottom),
                    0)
                AND IFNULL((SELECT 
                            cast(total as signed)
                        FROM
                            game_score_info
                        WHERE
                            game_info_id = g.id + 1
                                AND top_bottom = CASE
                                WHEN g.top_bottom = 1 THEN 2
                                WHEN g.top_bottom = 2 THEN 1
                                ELSE 0
                            END),
                    0) < (SELECT 
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                        AND top_bottom = g.top_bottom)
        THEN
            '追加点'
        ELSE 'その他'
    END AS homerun_type,
-- 	case
-- 		when oppo_scr = 0 and prev_scr = 0 then '先制'
--         when oppo_scr > prev_scr and oppo_scr > aft_scr then '追い上げ'
--         when oppo_scr > prev_scr and oppo_scr = aft_scr then '同点'
--         when oppo_scr > prev_scr and oppo_scr < aft_scr then '逆転'
--         when oppo_scr = prev_scr and oppo_scr < aft_scr then '勝ち越し'
--         when oppo_scr < prev_scr and oppo_scr < aft_scr then 'ダメ押し' else 'その他' end as homerun_type,
    pp.profile_number AS p_no,
    pb.name,
    pb.profile_number AS b_no,
    g.strike,
    g.ball,
    g.out,
    pi.col_8,
    g.on_all_base,
    g.runner_1b,
    pr1b.name AS '一塁走者',
    g.next_1b_go,
    g.runner_2b,
    pr2b.name AS '二塁走者',
    g.next_2b_go,
    g.runner_3b,
    pr3b.name AS '三塁走者',
    g.next_3b_go,
    g.game_datetime
FROM
    baseball.game_info g
        LEFT JOIN
    baseball.player pp ON g.pitcher = pp.id
        LEFT JOIN
    baseball.player pb ON g.batter = pb.id
        LEFT JOIN
    baseball.player pr1b ON g.runner_1b = pr1b.id
        LEFT JOIN
    baseball.player pr2b ON g.runner_2b = pr2b.id
        LEFT JOIN
    baseball.player pr3b ON g.runner_3b = pr3b.id
        LEFT JOIN
    baseball.pitch_info pi ON g.id = pi.game_info_id
        LEFT JOIN
    order_overview oo ON g.order_overview_id = oo.id
--         LEFT JOIN
--     game_score_info gs ON g.id = gs.game_info_id and g.top_bottom = gs.top_bottom
WHERE
    pb.name = 'デスパイネ' AND
    pi.col_8 = '本塁打'

/*
Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'INT)l                         FROM                             game_score_info  ' at line 113


*/