-- delete from pitch_info where id in (select id from tmp_delete_target_id)

-- previous sql


-- /*
-- create table tmp_delete_target_id
SELECT 
        id
    FROM
        game_info
    
    WHERE
			((order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_pitch_cnt )
            OR (order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_prev_pitch_cnt))
        AND id NOT IN (SELECT 
            min_id
        FROM
            (SELECT 
                MIN(id) AS min_id, order_overview_id, speed, col_8
            FROM
                game_info
                WHERE
                    ((order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_pitch_cnt )
				OR (order_overview_id , pitch_count) IN (SELECT * FROM baseball.tmp_max_prev_pitch_cnt))
            GROUP BY order_overview_id , speed , col_8) AS C)
-- */
;