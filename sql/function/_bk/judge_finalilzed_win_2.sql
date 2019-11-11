delimiter //

drop function if exists `judge_finalized_win_2`;
CREATE FUNCTION `judge_finalized_win_2` (ooid INT, giid INT, tb TINYINT)
RETURNS TINYINT
BEGIN

declare total_when_scored tinyint;
declare opponent_top_bottom tinyint;
declare not_final_score tinyint;

-- 得点直後の自チーム総得点を取得
SELECT 
    total
INTO total_when_scored FROM
    game_score_info
WHERE
    order_overview_id = ooid
        AND game_info_id = giid + 1
        AND top_bottom = tb
;

if tb = 1 then set opponent_top_bottom = 2;
elseif tb = 2 then set opponent_top_bottom = 1;
end if;

SELECT 
    EXISTS( SELECT 
            *
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
                AND aft.total >= total_when_scored
                AND aft.top_bottom = opponent_top_bottom)
INTO not_final_score
;


RETURN  not_final_score;
END //

delimiter ;