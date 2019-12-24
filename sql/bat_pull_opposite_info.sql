SELECT 
    sb.batter,
    sb.name,
    sb.team,
    COUNT(sb.batter OR NULL) AS bat,
    COUNT(hid.rst_id IS NOT NULL OR NULL) AS hit,
    COUNT(sb.rst_id IN (2, 3, 4) OR NULL) AS `1B`,
    COUNT(sb.rst_id = 6 OR NULL) AS `2B`,
    COUNT(sb.rst_id = 8 OR NULL) AS `3B`,
    COUNT(sb.rst_id = 9 OR NULL) AS hr,
    CASE
        WHEN
            COUNT(sb.batter OR NULL) > 0
        THEN
            ROUND(COUNT(hid.rst_id IS NOT NULL OR NULL) / COUNT(sb.batter OR NULL),
                    5)
        ELSE 0
    END AS ave,
    'e' AS eol
FROM
    baseball._situation_base sb
        LEFT JOIN
    game_info g ON sb.g_id = g.id
        LEFT JOIN
    R_info r ON sb.g_id = r.game_info_id
        LEFT JOIN
    hit_id_info hid ON hid.rst_id = sb.rst_id
        LEFT JOIN
    batter_reaching_regulation br ON br.batter = sb.batter
        LEFT JOIN
    exclude_batting_info eb ON eb.name = sb.result
WHERE
    sb.is_commit = 1
        AND br.batter IS NOT NULL
        AND eb.name IS NULL
        -- 流し打ち
--         AND (
-- 			(b_LR = 1 AND (direction IN (5, 7, 10, 14) or ((direction > 2 and direction < 10) AND r.col_6 < ROUND((- 1.6) * r.col_5 + 328.9, 0)))) OR 
-- 			(b_LR = 2 AND (direction IN (3, 9, 12, 13) or ((direction > 2 and direction < 10) AND r.col_6 > ROUND((- 0.6) * r.col_5 + 258.5, 0))))
--         )
		-- 引っ張り
        AND (
			(b_LR = 2 AND (direction IN (5, 7, 12) or (direction > 2 AND r.col_6 < ROUND((- 2.1) * r.col_5 + 365.8, 0)))) OR
            (b_LR = 1 AND (direction IN (3, 9, 10) or (direction > 2 AND r.col_6 > ROUND((- 0.6) * r.col_5 + 256.9, 0))))
		)
GROUP BY sb.batter , sb.name , sb.team;
