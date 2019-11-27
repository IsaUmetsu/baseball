-- CREATE TABLE suspect_go_once_through
SELECT
  *
FROM
  (
    SELECT
      order_overview_id,
      ining,
      top_bottom,
      MAX(diff) AS max_diff
    FROM
      (
        SELECT
          order_overview_id,
          ining,
          top_bottom,
          batter,
          TIMEDIFF(
            CAST(
              CONCAT('2020/01/01 ', MAX(game_datetime)) AS DATETIME
            ),
            CAST(
              CONCAT('2020/01/01 ', MIN(game_datetime)) AS DATETIME
            )
          ) AS diff
        FROM
          baseball.game_info
        GROUP BY
          batter,
          order_overview_id,
          ining,
          top_bottom
      ) AS D1
    GROUP BY
      ining,
      order_overview_id,
      top_bottom
  ) AS D2
WHERE
  max_diff > '00:10:00'
ORDER BY
  order_overview_id,
  ining,
  top_bottom;