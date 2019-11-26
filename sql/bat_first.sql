-- create table _bat_sixth

-- 第１打席の結果を取得
SELECT
  g.last_count,
  g.order_overview_id,
  g.ining,
  g.top_bottom,
  -- pb.name,
  --   pb.team,
  g.batter,
  p.rst_id,
  p.result
FROM
  (
    -- 全試合における打者の全打席の最終球を表すID取得
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
  ) AS g
  LEFT JOIN (
    -- 第１打席情報抽出
    SELECT
      g.order_overview_id,
      g.ining,
      g.top_bottom,
      g.batter
    FROM
      (
        SELECT
          bat_info.order_overview_id,
          MIN(bat_info.ining) AS ining,
          bat_info.top_bottom,
          bat_info.batter
        FROM
          (
            SELECT
              bai2.*
            FROM
              baseball._bat_all_info bai1
              LEFT JOIN baseball._bat_all_info bai2 ON bai1.id + 0 = bai2.id
              AND bai1.batter = bai2.batter
            WHERE
              bai2.batter IS NOT NULL
          ) AS bat_info
        group by
          bat_info.batter,
          bat_info.top_bottom,
          bat_info.order_overview_id
        order by
          bat_info.batter,
          bat_info.order_overview_id
      ) AS g
  ) AS first_batting_info ON g.order_overview_id = first_batting_info.order_overview_id
  and g.ining = first_batting_info.ining
  and g.top_bottom = first_batting_info.top_bottom
  and g.batter = first_batting_info.batter -- LEFT JOIN player pb ON pb.id = g.batter -- 選手名表示用
  left join pitch_info p on g.last_count = p.game_info_id
where
  first_batting_info.batter is not null -- 第１打席のみ抽出
order by
  g.batter,
  g.order_overview_id,
  g.ining;