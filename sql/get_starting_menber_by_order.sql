SELECT 
    count(player_name) as count,
    player_name
FROM
    baseball.order_detail
where
	((
		order_overview_id in (
			SELECT 
				id
			FROM
				baseball.order_overview
			where
				visitor_team = 'H'
		) and top_bottom = 1
	) or (
		order_overview_id in (
			SELECT 
				id
			FROM
				baseball.order_overview
			where
				home_team = 'H'
		) and top_bottom = 2
    ))
    and pitch_count = 1
    and batting_order = 9
group by player_name
order by count desc
;