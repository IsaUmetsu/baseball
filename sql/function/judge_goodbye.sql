delimiter //

CREATE FUNCTION `judge_goodbye` (order_overview_id INT, pitch_count INT)
RETURNS TINYINT
BEGIN

declare is_goodbye tinyint;

SELECT 
    EXISTS( SELECT 
            *
        FROM
            max_pitch_count mp
        WHERE
            mp.order_overview_id = order_overview_id
                AND mp.pitch_count = pitch_count)
INTO is_goodbye
;

RETURN  is_goodbye;
END //

delimiter ;