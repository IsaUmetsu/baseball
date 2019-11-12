-- -- for create temporary table
-- CREATE TABLE homerun_inning_batter

-- -- for insert homerun_type_batter
-- insert into homerun_inning_batter (`season`,`name`,`team`,`cnt`,`summary_all`,`total_cnt`,`percent`)

SELECT
	'ラッキー7' AS season,
    pb.name,
    pb.team,
    COUNT(pi.col_8) AS cnt,
    CONCAT(pb.name, '(', pb.team, ')') AS summary_all,
    k.cnt AS total_cnt,
    ROUND(COUNT(pi.col_8) / k.cnt * 100, 1) AS percent FROM
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
        LEFT JOIN
    homerun_king k ON g.batter = k.player_id
WHERE
    pi.col_8 = '本塁打'
        AND ng.remarks IS NULL
        AND g.ining = 7
GROUP BY pb.name , pb.team , k.cnt
ORDER BY cnt DESC , name DESC
;