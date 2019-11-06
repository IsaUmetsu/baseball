delimiter //

CREATE FUNCTION `get_opponent_score` (game_info_id INT, top_bottom TINYINT)
RETURNS TINYINT
BEGIN

declare score tinyint;

SELECT 
    CAST(total AS SIGNED)
INTO score FROM
    game_score_info gs
WHERE
    gs.game_info_id = game_info_id + 1
        AND gs.top_bottom = CASE
        WHEN top_bottom = 1 THEN 2
        WHEN top_bottom = 2 THEN 1
        ELSE 0
    END;

RETURN  IFNULL(score, 0);
END //

delimiter ;