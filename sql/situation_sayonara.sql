-- create table _situation_sayonara_all

SELECT 
    batter,
    `name`,
    team,
    COUNT(rst_id = 9 OR NULL) AS hr_cnt,
    COUNT(batter) AS bat_cnt
FROM
    situation_base_commit
WHERE
  ining >= 9
  AND top_bottom = 2
  AND (
    b_total - t_total = 0
    OR (
      t_total - b_total > 0
      AND t_total - b_total < 4
      AND (
        ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')),
                    0) >= CASE (CASE top_bottom
                WHEN 1 THEN b_total - t_total
                WHEN 2 THEN t_total - b_total
            END)
                WHEN 1 THEN 1
                WHEN 2 THEN 2
                WHEN 3 THEN 3
                ELSE 4
            END
        )
      )
    )
GROUP BY batter, `name`, team
ORDER BY hr_cnt DESC, bat_cnt