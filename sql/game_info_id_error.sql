-- CREATE TABLE game_info_id_error

-- SELECT id
--     -- , top_bottom, order_overview_id
-- FROM (
    SELECT 
        base.*, prv.b_err AS prv_b_err, prv.t_err AS prv_t_err
    FROM
        (
        SELECT 
			g.id,
            g.top_bottom,
            g.order_overview_id,
            g.on_all_base,
            g.next_3b_go,
            r.rst_id,
            r.result,
            r.ball_flow,
            TR.b_err,
            TR.t_err
    FROM
        baseball.game_info g
	LEFT JOIN R_info r ON g.id = r.game_info_id
    LEFT JOIN TR_info tr ON g.id = tr.game_info_id) AS base
    LEFT JOIN (SELECT 
			g.id,
            g.top_bottom,
            g.order_overview_id,
            g.on_all_base,
            g.next_3b_go,
            r.rst_id,
            r.result,
            r.ball_flow,
            TR.b_err,
            TR.t_err
    FROM
        baseball.game_info g
	LEFT JOIN R_info r ON g.id = r.game_info_id
    LEFT JOIN TR_info tr ON g.id = tr.game_info_id) AS prv ON base.id - 1 = prv.id
    WHERE
        prv.id IS NOT NULL
            AND (CASE base.top_bottom
            WHEN 1 THEN base.b_err - prv.b_err
            WHEN 2 THEN base.t_err - prv.t_err
        END) > 0
-- 	) AS A
;