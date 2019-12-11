SELECT 
	g.id,
    g.batter,
	g.`on_all_base`,
    CASE ROUND((SELECT (CHAR_LENGTH(g.`on_all_base`) - CHAR_LENGTH(REPLACE(g.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0)
        WHEN 1 THEN '2ラン'
        WHEN 2 THEN '3ラン'
        WHEN 3 THEN '満塁'
        ELSE 'ソロ'
    END AS '種別'
FROM
    baseball.game_info g;