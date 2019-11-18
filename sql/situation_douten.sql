-- create table _situation_douten_all


-- SELECT
--     A.*
-- FROM
--     (
        SELECT
            oo.date,
            g.location,
            g.ining,
            g.top_bottom,
            pb.name,
            pb.team,
            g.strike,
            g.ball,
            g.out,
            g.on_all_base,
            g.runner_1b,
            g.next_1b_go,
            g.runner_2b,
            g.next_2b_go,
            g.runner_3b,
            g.next_3b_go,
            p.batter_pitch_count AS bp_count,
            p.col_8 AS result,
            gs.t_total,
            gs.b_total
        FROM
            baseball.game_info g
            LEFT JOIN order_overview oo ON g.order_overview_id = oo.id
            LEFT JOIN pitch_info p ON g.id = p.game_info_id
            LEFT JOIN baseball.player pb ON g.batter = pb.id
            LEFT JOIN no_game_info ng ON g.order_overview_id = ng.order_overview_id
            LEFT JOIN (
                SELECT
                    gs1.game_info_id AS giid,
                    gs1.total AS t_total,
                    gs2.total AS b_total
                FROM
                    baseball.game_score_info gs1
                    LEFT JOIN baseball.game_score_info gs2 ON gs1.order_overview_id = gs2.order_overview_id
                    AND gs1.game_info_id = gs2.game_info_id
                    AND gs1.top_bottom = gs2.top_bottom - 1
                WHERE
                    gs1.top_bottom = 1
            ) AS gs ON g.id = gs.giid
        WHERE
            -- pb.name = 'ウィーラー' AND 
            g.on_all_base IN (
                SELECT
                    on_all_base
                FROM
                    baseball.on_all_base_info
                WHERE
                    on_all_base REGEXP (
                        CASE
                            (
                                CASE
                                    g.top_bottom
                                    WHEN 1 THEN b_total - t_total
                                    WHEN 2 THEN t_total - b_total
                                END
                            ) -- WHEN 0 THEN '[01]{1,}'
                            WHEN 1 THEN '[0]{3}'
                            WHEN 2 THEN '0{2}|0[1]0'
                            WHEN 3 THEN '1{2}|1[0]1'
                            WHEN 4 THEN '1{3}'
                            ELSE '1+'
                        END
                    )
                    AND on_all_base REGEXP (
                        CASE
                            (
                                CASE
                                    g.top_bottom
                                    WHEN 1 THEN b_total - t_total
                                    WHEN 2 THEN t_total - b_total
                                END
                            ) -- WHEN 0 THEN '[01]{1,}'
                            WHEN 1 THEN '[0]{3}'
                            WHEN 2 THEN '1{1}'
                            WHEN 3 THEN '0{1}'
                            WHEN 4 THEN '1{3}'
                            ELSE '1+'
                        END
                    )
            )
            AND (
                CASE
                    g.top_bottom
                    WHEN 1 THEN b_total - t_total
                    WHEN 2 THEN t_total - b_total
                END
            ) < 5
            AND (
                CASE
                    g.top_bottom
                    WHEN 1 THEN t_total - b_total
                    WHEN 2 THEN b_total - t_total
                END
            ) < 0
            AND ng.remarks IS NULL -- オールスターやノーゲームを除外
        ORDER BY
            g.id
--     ) AS A
--     LEFT JOIN (
--         SELECT
--             date,
--             ining,
--             top_bottom,
--             MAX(batter_pitch_count) AS bp_count,
--             t_total,
--             b_total
--         FROM
--             (
--                 SELECT
--                     oo.date,
--                     g.ining,
--                     g.top_bottom,
--                     p.batter_pitch_count,
--                     gs.t_total,
--                     gs.b_total
--                 FROM
--                     baseball.game_info g
--                     LEFT JOIN order_overview oo ON g.order_overview_id = oo.id
--                     LEFT JOIN pitch_info p ON g.id = p.game_info_id
--                     LEFT JOIN baseball.player pb ON g.batter = pb.id
--                     LEFT JOIN (
--                         SELECT
--                             gs1.game_info_id AS giid,
--                             gs1.total AS t_total,
--                             gs2.total AS b_total
--                         FROM
--                             baseball.game_score_info gs1
--                             LEFT JOIN baseball.game_score_info gs2 ON gs1.order_overview_id = gs2.order_overview_id
--                             AND gs1.game_info_id = gs2.game_info_id
--                             AND gs1.top_bottom = gs2.top_bottom - 1
--                         WHERE
--                             gs1.top_bottom = 1
--                     ) AS gs ON g.id = gs.giid
--                 WHERE
--                     -- pb.name = 'ウィーラー' AND 
--                     g.on_all_base IN (
--                         SELECT
--                             on_all_base
--                         FROM
--                             baseball.on_all_base_info
--                         WHERE
--                             on_all_base REGEXP (
--                                 CASE
--                                     (
--                                         CASE
--                                             g.top_bottom
--                                             WHEN 1 THEN b_total - t_total
--                                             WHEN 2 THEN t_total - b_total
--                                         END
--                                     ) -- WHEN 0 THEN '[01]{1,}'
--                                     WHEN 1 THEN '[0]{3}'
--                                     WHEN 2 THEN '0{2}|0[1]0'
--                                     WHEN 3 THEN '1{2}|1[0]1'
--                                     WHEN 4 THEN '1{3}'
--                                     ELSE '1+'
--                                 END
--                             )
--                             AND on_all_base REGEXP (
--                                 CASE
--                                     (
--                                         CASE
--                                             g.top_bottom
--                                             WHEN 1 THEN b_total - t_total
--                                             WHEN 2 THEN t_total - b_total
--                                         END
--                                     ) -- WHEN 0 THEN '[01]{1,}'
--                                     WHEN 1 THEN '[0]{3}'
--                                     WHEN 2 THEN '1{1}'
--                                     WHEN 3 THEN '0{1}'
--                                     WHEN 4 THEN '1{3}'
--                                     ELSE '1+'
--                                 END
--                             )
--                     )
--                     AND (
--                         CASE
--                             g.top_bottom
--                             WHEN 1 THEN b_total - t_total
--                             WHEN 2 THEN t_total - b_total
--                         END
--                     ) < 5
--                     AND (
--                         CASE
--                             g.top_bottom
--                             WHEN 1 THEN t_total - b_total
--                             WHEN 2 THEN b_total - t_total
--                         END
--                     ) < 0
--                 ORDER BY
--                     g.id
--             ) AS A
--         group by
--             date,
--             ining,
--             top_bottom,
--             t_total,
--             b_total
--     ) AS B on A.date = B.date
--     AND A.ining = B.ining
--     AND A.bp_count = B.bp_count
--     AND A.t_total = B.t_total
--     AND A.b_total = B.b_total
-- WHERE
--     B.date is not NULL -- AND A.result = '本塁打'
-- ;