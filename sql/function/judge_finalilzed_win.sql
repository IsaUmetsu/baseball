delimiter //

drop function if exists `judge_finalized_win`;
CREATE FUNCTION `judge_finalized_win` (ooid INT, giid INT, tb TINYINT)
RETURNS TINYINT
BEGIN

declare inning tinyint;
declare opponent_top_bottom tinyint;
declare gyakuten tinyint;

-- /**
SELECT 
    CASE
        WHEN IFNULL(aft.inning_1, 0) - IFNULL(prv.inning_1, 0) > 0 THEN 1
        WHEN IFNULL(aft.inning_2, 0) - IFNULL(prv.inning_2, 0) > 0 THEN 2
        WHEN IFNULL(aft.inning_3, 0) - IFNULL(prv.inning_3, 0) > 0 THEN 3
        WHEN IFNULL(aft.inning_4, 0) - IFNULL(prv.inning_4, 0) > 0 THEN 4
        WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 THEN 5
        WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 THEN 6
        WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 THEN 7
        WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 THEN 8
        WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 THEN 9
        WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 THEN 10
        WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 THEN 11
        WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 THEN 12
        ELSE 0
    END
INTO inning FROM
    (SELECT 
            `order_overview_id`,
            `game_info_id`,
            `top_bottom`,
            `inning_1`,
            `inning_2`,
            `inning_3`,
            `inning_4`,
            `inning_5`,
            `inning_6`,
            `inning_7`,
            `inning_8`,
            `inning_9`,
            `inning_10`,
            `inning_11`,
            `inning_12`,
            `total`
    FROM
        baseball.game_score_info gs
    WHERE
        gs.order_overview_id = ooid
            AND gs.game_info_id = giid - 1
            AND gs.top_bottom = tb) AS prv
        LEFT JOIN
    (SELECT 
            `order_overview_id`,
            `game_info_id`,
            `top_bottom`,
            `inning_1`,
            `inning_2`,
            `inning_3`,
            `inning_4`,
            `inning_5`,
            `inning_6`,
            `inning_7`,
            `inning_8`,
            `inning_9`,
            `inning_10`,
            `inning_11`,
            `inning_12`,
            `total`
    FROM
        baseball.game_score_info gs
    WHERE
        gs.order_overview_id = ooid
            AND gs.game_info_id = giid
            AND gs.top_bottom = tb) AS aft ON prv.order_overview_id = aft.order_overview_id
;
-- */

if tb = 1 then set opponent_top_bottom = 2;
elseif tb = 2 then set opponent_top_bottom = 1;
end if;


-- /**
SELECT 
    CASE
        WHEN inning = 1 THEN CASE
			WHEN IFNULL(aft.inning_1, 0) - IFNULL(prv.inning_1, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 1
			WHEN IFNULL(aft.inning_2, 0) - IFNULL(prv.inning_2, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 2
			WHEN IFNULL(aft.inning_3, 0) - IFNULL(prv.inning_3, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 3
			WHEN IFNULL(aft.inning_4, 0) - IFNULL(prv.inning_4, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 4
			WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 5
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 2 THEN CASE
			WHEN IFNULL(aft.inning_2, 0) - IFNULL(prv.inning_2, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 2
			WHEN IFNULL(aft.inning_3, 0) - IFNULL(prv.inning_3, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 3
			WHEN IFNULL(aft.inning_4, 0) - IFNULL(prv.inning_4, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 4
			WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 5
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 3 THEN CASE
			WHEN IFNULL(aft.inning_3, 0) - IFNULL(prv.inning_3, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 3
			WHEN IFNULL(aft.inning_4, 0) - IFNULL(prv.inning_4, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 4
			WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 5
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 4 THEN CASE
			WHEN IFNULL(aft.inning_4, 0) - IFNULL(prv.inning_4, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 4
			WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 5
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 5 THEN CASE
			WHEN IFNULL(aft.inning_5, 0) - IFNULL(prv.inning_5, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 5
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 6 THEN CASE
			WHEN IFNULL(aft.inning_6, 0) - IFNULL(prv.inning_6, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 6
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 7 THEN CASE
			WHEN IFNULL(aft.inning_7, 0) - IFNULL(prv.inning_7, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 7
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 8 THEN CASE
			WHEN IFNULL(aft.inning_8, 0) - IFNULL(prv.inning_8, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 8
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 9 THEN CASE
			WHEN IFNULL(aft.inning_9, 0) - IFNULL(prv.inning_9, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 9
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 10 THEN CASE
			WHEN IFNULL(aft.inning_10, 0) - IFNULL(prv.inning_10, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 10
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 11 THEN CASE
			WHEN IFNULL(aft.inning_11, 0) - IFNULL(prv.inning_11, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 11
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        WHEN inning = 12 THEN CASE
			WHEN IFNULL(aft.inning_12, 0) - IFNULL(prv.inning_12, 0) > 0 AND IFNULL(aft.total, 0) >= IFNULL(prv.total, 0) THEN 12
				ELSE 0 END
        ELSE 0
    END INTO gyakuten
FROM
    (SELECT 
			`order_overview_id`,
            `game_info_id`,
            `top_bottom`,
            `inning_1`,
            `inning_2`,
            `inning_3`,
            `inning_4`,
            `inning_5`,
            `inning_6`,
            `inning_7`,
            `inning_8`,
            `inning_9`,
            `inning_10`,
            `inning_11`,
            `inning_12`,
            `total`
    FROM
        baseball.game_score_info gs
    WHERE
        gs.order_overview_id = ooid
            AND gs.game_info_id = giid - 1
            AND gs.top_bottom = opponent_top_bottom) AS prv
        LEFT JOIN
    (SELECT 
        `order_overview_id`,
            `game_info_id`,
            `top_bottom`,
            `inning_1`,
            `inning_2`,
            `inning_3`,
            `inning_4`,
            `inning_5`,
            `inning_6`,
            `inning_7`,
            `inning_8`,
            `inning_9`,
            `inning_10`,
            `inning_11`,
            `inning_12`,
            `total`
    FROM
        baseball.game_score_info gs
    WHERE
        gs.order_overview_id = ooid
            AND gs.game_info_id = giid
            AND gs.top_bottom = opponent_top_bottom) AS aft ON prv.order_overview_id = aft.order_overview_id
;


RETURN  gyakuten;
-- */
-- RETURN  inning;
END //

delimiter ;