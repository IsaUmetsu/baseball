insert into homerun_king (player_id, name, team, cnt, summary)
SELECT 
	pb.id as player_id,
	pb.name,
    pb.team,
    count(pb.name) as cnt,
    CONCAT(pb.name, '(', pb.team, ')') AS summary
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
        LEFT JOIN
    no_game_info ng ON g.order_overview_id = ng.order_overview_id
WHERE
    -- pb.name = 'デスパイネ' AND
    pi.result = '本塁打'
            AND ng.remarks IS NULL
group by pb.id, pb.name, pb.team
order by cnt desc
;