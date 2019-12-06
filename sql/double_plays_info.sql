SELECT 
    r.ball_flow, COUNT(r.ball_flow) AS cnt
FROM
    baseball.game_info g
LEFT JOIN R_info r ON g.id = r.game_info_id
WHERE aft_o - `out` = 2 AND ball_flow != ''
GROUP BY ball_flow
ORDER BY cnt DESC