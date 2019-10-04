-- (1) 試合でその打順に入った全選手を取得 
-- SELECT  
--   order_overview_id, 
--     top_bottom, 
--     batting_order, 
--     max(pitch_count) as max_pitch_count, 
--     player_name 
-- FROM 
--     baseball.order_detail 
-- where 
--   (( 
--     order_overview_id in ( 
--       SELECT  
--         id 
--       FROM 
--         baseball.order_overview 
--       where 
--         visitor_team = 'H' 
--     ) and top_bottom = 1 
--   ) or ( 
--     order_overview_id in ( 
--       SELECT  
--         id 
--       FROM 
--         baseball.order_overview 
--       where 
--         home_team = 'H' 
--     ) and top_bottom = 2 
--     )) 
--     and batting_order = 9 
-- group by 
--   order_overview_id, 
--     top_bottom, 
--     batting_order, 
--     player_name 
-- order by 
--   order_overview_id, 
--     top_bottom, 
--     max_pitch_count 
-- ; 



-- (2) 試合ごとのその打順の変更回数を取得 
-- SELECT 
--   A.order_overview_id, 
--     count(A.order_overview_id) AS count 
-- FROM 
-- ( 
-- SELECT  
--   order_overview_id, 
--     top_bottom, 
--     batting_order, 
--     max(pitch_count) as max_pitch_count, 
--     player_name 
-- FROM 
--     baseball.order_detail 
-- where 
--   (( 
--     order_overview_id in ( 
--       SELECT  
--         id 
--       FROM 
--         baseball.order_overview 
--       where 
--         visitor_team = 'H' 
--     ) and top_bottom = 1 
--   ) or ( 
--     order_overview_id in ( 
--       SELECT  
--         id 
--       FROM 
--         baseball.order_overview 
--       where 
--         home_team = 'H' 
--     ) and top_bottom = 2 
--     )) 
--     and batting_order = 9 
-- group by 
--   order_overview_id, 
--     top_bottom, 
--     batting_order, 
--     player_name 
-- order by 
--   order_overview_id, 
--     top_bottom, 
--     max_pitch_count 
-- ) as A 
-- group by 
--   A.order_overview_id 
-- order by count 
-- ; 


SELECT
	C.player_name,
    count(C.player_name) as count
FROM
(
    -- abount visitor
    -- ビジター試合での選手交代がなかった試合の指定打順の選手を取得
	SELECT
	   order_overview_id,
	   player_name 
	FROM
	   baseball.order_detail 
	WHERE
	   pitch_count = 1 
	   AND batting_order = 9 
	   AND top_bottom = 1 
		   AND order_overview_id IN 
		   (
               -- 選手交代なしだった試合のIDを取得
			  SELECT
				 B.order_overview_id 
			  FROM
				 (
                     -- 試合単位で、指定の打順が何人変わったか計算
					SELECT
					   A.order_overview_id,
					   Count(A.order_overview_id) AS count 
					FROM
					   (
                          -- 選手ごとの最後の試合全体球数を計算 
						  SELECT
							 order_overview_id,
							 top_bottom,
							 batting_order,
							 Max(pitch_count) AS max_pitch_count,
							 player_name 
						  FROM
							 baseball.order_detail 
						  WHERE
							 order_overview_id IN 
							 (
								SELECT
								   id 
								FROM
								   baseball.order_overview 
								WHERE
								   visitor_team = 'H'
							 )
							 AND top_bottom = 1 
							 AND batting_order = 9 
						  GROUP BY
							 order_overview_id,
							 top_bottom,
							 batting_order,
							 player_name 
						  ORDER BY
							 order_overview_id,
							 top_bottom,
							 max_pitch_count
					   )
					   AS A 
					GROUP BY
					   A.order_overview_id 
					ORDER BY
					   count
				 )
				 AS B 
			  WHERE
				 B.count = 1
		)
	union 
    -- abount home
	SELECT
	   order_overview_id,
	   player_name 
	FROM
	   baseball.order_detail 
	WHERE
	   pitch_count = 1 
	   AND batting_order = 9 
	   AND top_bottom = 2 
		   AND order_overview_id IN 
		   (
			  SELECT
				 B.order_overview_id 
			  FROM
				 (
					SELECT
					   A.order_overview_id,
					   Count(A.order_overview_id) AS count 
					FROM
					   (
						  SELECT
							 order_overview_id,
							 top_bottom,
							 batting_order,
							 Max(pitch_count) AS max_pitch_count,
							 player_name 
						  FROM
							 baseball.order_detail 
						  WHERE
							 order_overview_id IN 
							 (
								SELECT
								   id 
								FROM
								   baseball.order_overview 
								WHERE
								   home_team = 'H'
							 )
							 AND top_bottom = 2 
							 AND batting_order = 9 
						  GROUP BY
							 order_overview_id,
							 top_bottom,
							 batting_order,
							 player_name 
						  ORDER BY
							 order_overview_id,
							 top_bottom,
							 max_pitch_count
					   )
					   AS A 
					GROUP BY
					   A.order_overview_id 
					ORDER BY
					   count
				 )
				 AS B 
			  WHERE
				 B.count = 1
		)
) AS C
group by
	C.player_name
order by
	count desc
;