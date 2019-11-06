SELECT 
    CASE
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
        THEN
            '先制'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追い上げ'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '同点'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '逆転'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '勝ち越し'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追加点'
        ELSE 'サヨナラ'
    END AS homerun_type,
    pb.team,
    COUNT(CASE
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
        THEN
            '先制'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追い上げ'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '同点'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '逆転'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '勝ち越し'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追加点'
        ELSE 'サヨナラ'
    END) AS homerun_type_count,
    concat(COUNT(CASE
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
        THEN
            '先制'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追い上げ'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '同点'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '逆転'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '勝ち越し'
		WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追加点'
        ELSE 'サヨナラ'
    END), ' ', pb.team) as summary
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
    -- pb.name = 'デスパイネ' AND
    pi.col_8 = '本塁打' and not (pb.team = 'EL' or pb.team = 'WL')
group by
	homerun_type,
    pb.team
order by
	homerun_type desc,
    homerun_type_count desc,
    team desc
