-- create table _on_mound_order 
-- insert into _on_mound_order (`id`, `order_overview_id`, `top_bottom`, `pitcher`, `name`, `team`)
SELECT
  A.order_overview_id,
  top_bottom,
  pitcher,
  pp.`name`,
  pp.team
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
WHERE
  ng.remarks IS NULL;