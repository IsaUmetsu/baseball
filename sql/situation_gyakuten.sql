-- create table _situation_gyakuten_all

SELECT 
    batter,
    `name`,
    team,
    COUNT(rst_id = 9 OR NULL) AS hr_cnt,
    COUNT(batter) AS bat_cnt
FROM
    situation_base_commit
WHERE
    ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) >= CASE (CASE top_bottom
			WHEN 1 THEN b_total - t_total
			WHEN 2 THEN t_total - b_total
		END)
			WHEN 1 THEN 1
			WHEN 2 THEN 2
			WHEN 3 THEN 3
			ELSE 4
		END
        AND (CASE top_bottom
        WHEN 1 THEN b_total - t_total
        WHEN 2 THEN t_total - b_total
    END) < 4
        AND (CASE top_bottom
        WHEN 1 THEN t_total - b_total
        WHEN 2 THEN b_total - t_total
    END) < 0
    AND (ining < 9 OR (ining >= 9 and top_bottom = 1)) -- サヨナラシチュエーションは除外
GROUP BY batter , `name` , team
ORDER BY hr_cnt DESC, bat_cnt