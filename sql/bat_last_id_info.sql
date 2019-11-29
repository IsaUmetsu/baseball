-- CREATE TABLE _bat_last_id_info 
-- insert into _bat_last_id_info (last_count, order_overview_id, ining, top_bottom, batter, batter_cnt) 

SELECT
  g.id AS last_count,
  g.order_overview_id,
  ining,
  top_bottom,
  batter,
  batter_cnt
FROM
  baseball._game_info_specific g
  LEFT JOIN R_info r ON g.id = r.game_info_id
WHERE
  r.is_commit = 1 -- 結果が確定した打席のみ対象
ORDER BY
  order_overview_id,
  batter,
  ining,
  top_bottom,
  batter_cnt;
