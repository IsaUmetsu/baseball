SELECT 
	CASE
        WHEN pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NULL THEN 'ソロ'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) THEN '2ラン'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL) THEN '3ラン'
        WHEN pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL  THEN '満塁'
        ELSE 'その他'
    END AS homerun_score,
-- 	pr1b.name AS '一塁走者',
--     pr2b.name AS '二塁走者',
--     pr3b.name AS '三塁走者',
    pb.team,
    COUNT(CASE
        WHEN pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NULL THEN 'ソロ'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) THEN '2ラン'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL) THEN '3ラン'
        WHEN pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL  THEN '満塁'
        ELSE 'その他'
    END) AS homerun_score_count,
    CONCAT(COUNT(CASE
        WHEN pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NULL THEN 'ソロ'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) THEN '2ラン'
        WHEN (pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NULL) or (pr1b.name IS NOT NULL and pr2b.name IS NULL and pr3b.name IS NOT NULL) or (pr1b.name IS NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL) THEN '3ラン'
        WHEN pr1b.name IS NOT NULL and pr2b.name IS NOT NULL and pr3b.name IS NOT NULL  THEN '満塁'
        ELSE 'その他'
    END), ' ', pb.team) AS summary
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
WHERE
    pi.col_8 = '本塁打'
        AND NOT (pb.team = 'EL' OR pb.team = 'WL')
GROUP BY homerun_score ,
-- pr1b.name, pr2b.name, pr3b.name, 
pb.team
ORDER BY homerun_score DESC , homerun_score_count DESC
