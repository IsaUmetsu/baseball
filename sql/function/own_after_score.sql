delimiter //

CREATE FUNCTION `get_own_after_score` (game_info_id INT, top_bottom TINYINT)
RETURNS TINYINT
BEGIN

declare score tinyint;

SELECT 
    CAST(total AS SIGNED)
INTO score FROM
    game_score_info gs
WHERE
    gs.game_info_id = game_info_id + 1
        AND gs.top_bottom = top_bottom;

RETURN  IFNULL(score, 0);
END //

delimiter ;