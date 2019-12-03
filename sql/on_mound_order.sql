-- create table on_mound_order 
-- insert into on_mound_order (`order_overview_id`, `top_bottom`, `pitcher`, `name`, `team`, `pitch_cnt`)
SELECT
  A.order_overview_id,
  A.top_bottom,
  A.pitcher,
  pp.`name`,
  pp.team,
  p.pitch_cnt
FROM
  (
    SELECT
      g.order_overview_id,
      top_bottom,
      pitcher,
      MIN(game_datetime) AS min_game_datetime
    FROM
      baseball.game_info g
    GROUP BY
      order_overview_id,
      top_bottom,
      pitcher
    ORDER BY
      order_overview_id,
      top_bottom,
      min_game_datetime
  ) AS A
  LEFT JOIN no_game_info ng ON A.order_overview_id = ng.order_overview_id
  LEFT JOIN player pp on A.pitcher = pp.id
  LEFT JOIN _on_mound_pitched_count p ON A.order_overview_id = p.order_overview_id
  AND A.top_bottom = p.top_bottom
  AND A.pitcher = p.pitcher
WHERE
  ng.remarks IS NULL;