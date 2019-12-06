SELECT 
    pb.name, 
    pb.team,
	COUNT((sbc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS rbi_hit,
	COUNT(e.name IS NULL OR NULL) AS bat_cnt,
	SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
FROM
    baseball.situation_base_commit sbc
LEFT JOIN exclude_batting_info e ON sbc.result = e.name
LEFT JOIN _rbi_all rbi ON sbc.g_id = rbi.g_id
left join player pb on pb.id = sbc.batter
WHERE
    sbc.on_all_base = '100'
GROUP BY sbc.batter
;