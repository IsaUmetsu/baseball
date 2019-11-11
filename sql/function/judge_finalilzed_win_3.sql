delimiter //

-- latest version, 1 and 2 is not used
drop function if exists `judge_finalized_win_3`;
CREATE FUNCTION `judge_finalized_win_3` (ooid INT, giid INT, tb TINYINT)
RETURNS TINYINT
BEGIN

declare total_when_scored tinyint;
declare opponent_top_bottom tinyint;
declare not_final_score tinyint;

if tb = 1 then set opponent_top_bottom = 2;
elseif tb = 2 then set opponent_top_bottom = 1;
end if;

-- 自チームの本塁打による得点以降、相手チームで得点があった際に、自チームの点数より下であるかを都度判定
SELECT 
    EXISTS( SELECT 
            gst.game_info_id AS game_info_id, t_total, b_total
        FROM
            (SELECT 
                total AS t_total,
                    order_overview_id,
                    game_info_id,
                    top_bottom
            FROM
                game_score_info
            WHERE
                top_bottom = 1
                    AND order_overview_id = ooid
                    AND game_info_id >= giid) AS gst
                LEFT JOIN
            (SELECT 
                total AS b_total,
                    order_overview_id,
                    game_info_id,
                    top_bottom
            FROM
                game_score_info
            WHERE
                top_bottom = 2
                    AND order_overview_id = ooid
                    AND game_info_id >= giid) gsb ON gst.game_info_id = gsb.game_info_id
                AND gst.top_bottom = gsb.top_bottom - 1
        WHERE
			-- 相手チームが得点した際の情報のみ抽出
            gst.game_info_id IN (SELECT 
                    aft.game_info_id
                FROM
                    (SELECT 
                        game_info_id, top_bottom, total
                    FROM
                        baseball.game_score_info
                    WHERE
                        order_overview_id = ooid) AS prv
                        LEFT JOIN
                    (SELECT 
                        game_info_id, top_bottom, total
                    FROM
                        baseball.game_score_info
                    WHERE
                        order_overview_id = ooid) AS aft ON prv.game_info_id = aft.game_info_id - 1
                        AND prv.top_bottom = aft.top_bottom
                WHERE
                    aft.total > prv.total
                        AND aft.game_info_id >= giid
                        AND aft.top_bottom = opponent_top_bottom)
                AND (CASE tb
                WHEN 1 THEN b_total - t_total
                WHEN 2 THEN t_total - b_total
            END) >= 0)
INTO not_final_score
;

RETURN  not_final_score;
END //

delimiter ;