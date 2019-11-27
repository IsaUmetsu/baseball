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
  p.result,
  first_bat_inf.*
  -- first_bat_inf.result
  -- ,second_bat_inf.result
FROM
  -- 全試合における打者の全打席の最終球を表すID取得
  _bat_last_id_info g
  -- 第1打席情報抽出
  LEFT JOIN (
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
              LEFT JOIN baseball._bat_all_info bai2 ON bai1.id + 5 = bai2.id
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
  ) AS first_bat_inf ON g.order_overview_id = first_bat_inf.order_overview_id
  and g.ining = first_bat_inf.ining
  and g.top_bottom = first_bat_inf.top_bottom
  and g.batter = first_bat_inf.batter
  -- LEFT JOIN player pb ON pb.id = g.batter -- 選手名表示用
  left join pitch_info p on g.last_count = p.game_info_id
where
  first_bat_inf.batter is not null-- 第１打席のみ抽出
order by
  g.batter,
  g.order_overview_id,
  g.ining;