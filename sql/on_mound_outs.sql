-- CREATE TABLE _on_mound_outs
SELECT
  order_overview_id,
  top_bottom,
  pitcher,
  SUM(outs) AS outs
FROM
  (
    SELECTf g.order_overview_id,
    -- ining,
    top_bottom,
    pitcher,
    aft_o - `out` AS outs
    FROM
      game_info g
      LEFT JOIN pitch_info p ON g.id = p.game_info_id
    WHERE
      aft_o > `out`
      AND p.id IS NOT NULL -- AND g.order_overview_id = 698
    ORDER BY
      order_overview_id,
      -- ining,
      top_bottom
  ) AS A
GROUP BY
  order_overview_id,
  top_bottom,
  pitcher;