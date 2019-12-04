-- create table _situation_kachikoshi_all

SELECT 
    batter,
    `name`,
    team,
    COUNT(rst_id = 9 OR NULL) AS hr_cnt,
    COUNT(batter) AS bat_cnt
FROM
    situation_base_commit
WHERE
	b_total = 0 AND t_total = 0
    AND NOT (
		ining >= 9
		AND top_bottom = 2
	) -- サヨナラシチュエーションは除外
GROUP BY batter , `name` , team
ORDER BY hr_cnt DESC, bat_cnt