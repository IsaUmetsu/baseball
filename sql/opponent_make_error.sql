SELECT 
    batter,
    name,
    team,
    COUNT(batter) AS cnt,
    -- COUNT(rst_id = 10 OR NULL) AS e_cnt,
    'e' AS eol
FROM
    baseball._situation_base sb
        LEFT JOIN
    game_info_id_error ge ON sb.g_id = ge.id
WHERE
    ge.id IS NOT NULL
GROUP BY batter , name , team
;