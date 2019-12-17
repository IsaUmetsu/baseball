-- create table on_mound_inning_total
SELECT
  pitcher,
  `name`,
  team,
  SUM(outs) DIV 3 AS inning,
  SUM(outs) % 3 AS outs
FROM
  (
    SELECT
      odr.*,
      outs.outs
    FROM
      on_mound_order odr
      LEFT JOIN _on_mound_outs outs ON odr.order_overview_id = outs.order_overview_id
      AND odr.top_bottom = outs.top_bottom
      AND odr.pitcher = outs.pitcher
  ) AS A
GROUP BY
  pitcher,
  `name`,
  team