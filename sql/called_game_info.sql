SELECT
	game_info_id, order_overview_id, inning, `date`, visitor_team, home_team
FROM (
	SELECT 
		gs.id, game_info_id, order_overview_id, top_bottom,
		case
			when inning_1 is null then 0
			when inning_2 is null then 1
			when inning_3 is null then 2
			when inning_4 is null then 3
			when inning_5 is null then 4
			when inning_6 is null then 5
			when inning_7 is null then 6
			when inning_8 is null then 7
			when inning_9 is null then 8
			when inning_10 is null then 9
			when inning_11 is null then 10
			when inning_12 is null then 11
			else 12 end as inning,
		oo.date, oo.visitor_team, oo.home_team
	FROM
		game_score_info gs
	left join order_overview oo on oo.id = gs.order_overview_id
	WHERE
		(gs.order_overview_id , game_info_id) IN (SELECT 
				order_overview_id, MAX(game_info_id)
			FROM
				baseball.game_score_info
			GROUP BY order_overview_id)
	) AS A
WHERE inning < 9
group by game_info_id, order_overview_id, inning, `date`, visitor_team, home_team
;