-- CREATE TABLE _bat_last_id_info 
-- insert into _bat_last_id_info (last_count, order_overview_id, ining, top_bottom, batter, batter_cnt) 

-- /*

-- 改良案
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
  r.is_commit = 1
ORDER BY
  order_overview_id,
  batter,
  ining,
  top_bottom,
  batter_cnt;

-- */

/*
SELECT
  MAX(id) AS last_count,
  order_overview_id,
  ining,
  top_bottom,
  batter,
  batter_cnt
FROM
  baseball._game_info_specific
-- where order_overview_id = 63 and ining = 10 and top_bottom = 1 -- 打者１巡の試合
GROUP BY
  batter,
  ining,
  top_bottom,
  order_overview_id,
  batter_cnt
ORDER BY
  order_overview_id,
  batter,
  ining,
  top_bottom,
  batter_cnt
;
*/
