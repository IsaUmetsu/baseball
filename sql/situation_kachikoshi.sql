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
  b_total - t_total = 0
  AND b_total > 0 AND t_total > 0
  AND (ining < 9 OR (ining >= 9 and top_bottom = 1)) -- サヨナラシチュエーションは除外
GROUP BY batter , `name` , team
ORDER BY hr_cnt DESC, bat_cnt