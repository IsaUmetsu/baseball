-- CREATE TABLE _on_mound_pitched_count 

SELECT
  order_overview_id,
  top_bottom,
  pitcher,
  COUNT(pitcher) AS pitch_cnt
FROM
  (
    SELECT
		g.order_overview_id,
		top_bottom,
		pitcher
    FROM
      game_info g
      LEFT JOIN (SELECT id, game_info_id FROM pitch_info) AS p ON g.id = p.game_info_id
      LEFT JOIN (SELECT game_info_id, rst_id FROM R_info) AS r ON g.id = r.game_info_id
    WHERE
      p.id IS NOT NULL
      AND r.rst_id > 0
    ORDER BY
      g.order_overview_id,
      top_bottom
  ) AS A
GROUP BY
  order_overview_id,
  top_bottom,
  pitcher;