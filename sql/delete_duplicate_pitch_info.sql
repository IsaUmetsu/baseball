delete from pitch_info where id in (select id from tmp_delete_target_id)

-- previous sql

/*
SELECT 
        id
    FROM
        pitch_info
    
    WHERE
        game_info_id IN (SELECT 
            id
        FROM
            baseball.game_info
        
        WHERE
--             (order_overview_id , pitch_count) IN (SELECT 
--                 order_overview_id, MAX(pitch_count) AS pitch_count
--             FROM
--                 baseball.game_info
--             GROUP BY order_overview_id)
--             OR (order_overview_id , pitch_count) IN (SELECT 
--                 order_overview_id, MAX(pitch_count) - 1 AS pitch_count
--             FROM
--                 baseball.game_info
--             GROUP BY order_overview_id))
			(order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_pitch_cnt )
            OR (order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_prev_pitch_cnt))
        AND id NOT IN (SELECT 
            min_id
        FROM
            (SELECT 
                MIN(id) AS min_id, order_overview_id, speed, result
            FROM
                pitch_info
            
            WHERE
                game_info_id IN (SELECT 
                    id
                FROM
                    baseball.game_info
                
                WHERE
                    (order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_pitch_cnt )
				OR (order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_prev_pitch_cnt))
            GROUP BY order_overview_id , speed , result) AS C)
*/
;