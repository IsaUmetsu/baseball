-- create table _situation_tsuikaten_all

SELECT 
    batter,
    `name`,
    team,
    COUNT(rst_id = 9 OR NULL) AS hr_cnt,
    COUNT(batter) AS bat_cnt
FROM
    situation_base_commit
WHERE
  (
    CASE
      top_bottom
      WHEN 1 THEN t_total - b_total
      WHEN 2 THEN b_total - t_total
    END
  ) > 0
GROUP BY batter , `name` , team
ORDER BY hr_cnt DESC, bat_cnt