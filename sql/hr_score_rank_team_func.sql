SELECT 
    CASE
        WHEN
            pr1b.name IS NULL AND pr2b.name IS NULL
                AND pr3b.name IS NULL
        THEN
            'ソロ'
        WHEN
            (pr1b.name IS NOT NULL
                AND pr2b.name IS NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NULL AND pr2b.name IS NULL
                AND pr3b.name IS NOT NULL)
        THEN
            '2ラン'
        WHEN
            (pr1b.name IS NOT NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NOT NULL
                AND pr2b.name IS NULL
                AND pr3b.name IS NOT NULL)
                OR (pr1b.name IS NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NOT NULL)
        THEN
            '3ラン'
        WHEN
            pr1b.name IS NOT NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NOT NULL
        THEN
            '満塁'
        ELSE 'その他'
    END AS homerun_score,
    pb.team,
    COUNT(CASE
        WHEN
            pr1b.name IS NULL AND pr2b.name IS NULL
                AND pr3b.name IS NULL
        THEN
            'ソロ'
        WHEN
            (pr1b.name IS NOT NULL
                AND pr2b.name IS NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NULL AND pr2b.name IS NULL
                AND pr3b.name IS NOT NULL)
        THEN
            '2ラン'
        WHEN
            (pr1b.name IS NOT NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NULL)
                OR (pr1b.name IS NOT NULL
                AND pr2b.name IS NULL
                AND pr3b.name IS NOT NULL)
                OR (pr1b.name IS NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NOT NULL)
        THEN
            '3ラン'
        WHEN
            pr1b.name IS NOT NULL
                AND pr2b.name IS NOT NULL
                AND pr3b.name IS NOT NULL
        THEN
            '満塁'
        ELSE 'その他'
    END) AS homerun_score_count,
    CONCAT(COUNT(CASE
                WHEN
                    pr1b.name IS NULL AND pr2b.name IS NULL
                        AND pr3b.name IS NULL
                THEN
                    'ソロ'
                WHEN
                    (pr1b.name IS NOT NULL
                        AND pr2b.name IS NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NULL AND pr2b.name IS NULL
                        AND pr3b.name IS NOT NULL)
                THEN
                    '2ラン'
                WHEN
                    (pr1b.name IS NOT NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NOT NULL
                        AND pr2b.name IS NULL
                        AND pr3b.name IS NOT NULL)
                        OR (pr1b.name IS NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NOT NULL)
                THEN
                    '3ラン'
                WHEN
                    pr1b.name IS NOT NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NOT NULL
                THEN
                    '満塁'
                ELSE 'その他'
            END),
            ' ',
            pb.team) AS summary_1,
    CONCAT(COUNT(CASE
                WHEN
                    pr1b.name IS NULL AND pr2b.name IS NULL
                        AND pr3b.name IS NULL
                THEN
                    'ソロ'
                WHEN
                    (pr1b.name IS NOT NULL
                        AND pr2b.name IS NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NULL AND pr2b.name IS NULL
                        AND pr3b.name IS NOT NULL)
                THEN
                    '2ラン'
                WHEN
                    (pr1b.name IS NOT NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NULL)
                        OR (pr1b.name IS NOT NULL
                        AND pr2b.name IS NULL
                        AND pr3b.name IS NOT NULL)
                        OR (pr1b.name IS NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NOT NULL)
                THEN
                    '3ラン'
                WHEN
                    pr1b.name IS NOT NULL
                        AND pr2b.name IS NOT NULL
                        AND pr3b.name IS NOT NULL
                THEN
                    '満塁'
                ELSE 'その他'
            END),
            ' ',
            pb.team) AS summary_2
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
        LEFT JOIN
    no_game_info ng ON g.order_overview_id = ng.order_overview_id
WHERE
    pi.col_8 = '本塁打'
        AND ng.remarks IS NULL
GROUP BY homerun_score , pb.team
ORDER BY homerun_score DESC , homerun_score_count DESC
