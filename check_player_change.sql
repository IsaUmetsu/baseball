SELECT
	*
FROM
(
    -- 選手交代前の前
	SELECT
		*
	FROM
	(
		(
            SELECT
                batting_order AS before_batting_order,
                player AS before_player,
                pos AS before_pos,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 37 AND pitch_count = 227
        ) AS A
        LEFT OUTER JOIN
            (
                SELECT
                    batting_order AS after_batting_order,
                    player AS after_player,
                    pos AS after_pos,
                    profile_number AS after_profile_number,
                    player_name AS after_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = 37 AND pitch_count = 228
            ) AS B
        ON  A.before_player = B.after_player AND
			A.before_pos = B.after_pos
	)
	UNION
    -- 選手交代前の後
	SELECT
		*
	FROM
	(
		(
            SELECT
                batting_order AS before_batting_order,
                player AS before_player,
                pos AS before_pos,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 37 AND pitch_count = 227
        ) AS A
        RIGHT OUTER JOIN
		(
            SELECT
                batting_order AS after_batting_order,
                player AS after_player,
                pos AS after_pos,
                profile_number AS after_profile_number,
                player_name AS after_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 37 AND pitch_count = 228
        ) AS B
        ON  A.before_player = B.after_player AND
			A.before_pos = B.after_pos
	)
) AS C
WHERE
	before_batting_order IS NULL OR
    after_player IS NULL
;