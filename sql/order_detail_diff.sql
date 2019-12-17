create table _order_detail_diff 

	SELECT 
		-- l.id,
        l.oo_id,
        l.top_bottom,
        l.pitch_count,
        l.batting_order,
        l.pos,
        l.player,
        l.player_name,
        r.pos AS prv_pos,
        r.player AS prv_player,
        r.player_name AS prv_player_name,
		CASE WHEN l.player = r.player THEN 1 ELSE 2 END AS same
	FROM
		(SELECT 
			`order_overview_id` AS oo_id,
			`top_bottom`,
			`pitch_count`,
			`batting_order`,
			`player`,`pos`,
			`profile_number`,
			`player_name`,
			pitch_count - 1 AS prv_ptc_cnt
		FROM
			baseball.order_detail) AS l
			LEFT JOIN
		(SELECT 
			`order_overview_id` AS oo_id,
			`top_bottom`,
			`pitch_count`,
			`batting_order`,
			`player`,`pos`,
			`profile_number`,
			`player_name`,
			pitch_count - 1 AS prv_ptc_cnt
		FROM
			baseball.order_detail) AS r ON l.oo_id = r.oo_id
			AND l.top_bottom = r.top_bottom
			AND l.batting_order = r.batting_order
            AND l.prv_ptc_cnt = r.pitch_count
	WHERE
		r.oo_id IS NOT NULL
;