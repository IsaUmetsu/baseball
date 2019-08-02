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
                player_id AS before_player_id,
                pos_id AS before_pos_id,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 33 AND pitch_count = 227
        ) AS A
        LEFT OUTER JOIN
            (
                SELECT
                    batting_order AS after_batting_order,
                    player_id AS after_player_id,
                    pos_id AS after_pos_id,
                    profile_number AS after_profile_number,
                    player_name AS after_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = 33 AND pitch_count = 228
            ) AS B
        ON  A.before_player_id = B.after_player_id AND
			A.before_pos_id = B.after_pos_id
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
                player_id AS before_player_id,
                pos_id AS before_pos_id,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 33 AND pitch_count = 227
        ) AS A
        RIGHT OUTER JOIN
		(
            SELECT
                batting_order AS after_batting_order,
                player_id AS after_player_id,
                pos_id AS after_pos_id,
                profile_number AS after_profile_number,
                player_name AS after_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = 33 AND pitch_count = 228
        ) AS B
        ON  A.before_player_id = B.after_player_id AND
			A.before_pos_id = B.after_pos_id
	)
) AS C
WHERE
	before_batting_order IS NULL OR
    after_player_id IS NULL
;