create table _bat_last_id_info     
    SELECT
      MAX(id) AS last_count,
      order_overview_id,
      ining,
      top_bottom,
      batter
    FROM
      baseball.game_info
    GROUP BY
      batter,
      ining,
      top_bottom,
      order_overview_id