-- create table _bat_all_info
-- insert into _bat_all_info (`order_overview_id`, `top_bottom`, `batter`, `1_ining`, `1_result`, `1_rst_id`, `1_cnt`, `2_ining`, `2_result`, `2_rst_id`, `2_cnt`, `3_ining`, `3_result`, `3_rst_id`, `3_cnt`, `4_ining`, `4_result`, `4_rst_id`, `4_cnt`, `5_ining`, `5_result`, `5_rst_id`, `5_cnt`, `6_ining`, `6_result`, `6_rst_id`, `6_cnt`, `7_ining`, `7_result`, `7_rst_id`, `7_cnt`)

SELECT
  b1.order_overview_id,
  b1.top_bottom,
  b1.batter,
  b1.ining AS `1_ining`,
  r1.result AS `1_result`,
  r1.rst_id AS `1_rst_id`,
  b1.last_count AS `1_cnt`,
  b2.ining AS `2_ining`,
  r2.result AS `2_result`,
  r2.rst_id AS `2_rst_id`,
  b2.last_count AS `2_cnt`,
  b3.ining AS `3_ining`,
  r3.result AS `3_result`,
  r3.rst_id AS `3_rst_id`,
  b3.last_count AS `3_cnt`,
  b4.ining AS `4_ining`,
  r4.result AS `4_result`,
  r4.rst_id AS `4_rst_id`,
  b4.last_count AS `4_cnt`,
  b5.ining AS `5_ining`,
  r5.result AS `5_result`,
  r5.rst_id AS `5_rst_id`,
  b5.last_count AS `5_cnt`,
  b6.ining AS `6_ining`,
  r6.result AS `6_result`,
  r6.rst_id AS `6_rst_id`,
  b6.last_count AS `6_cnt`,
  b7.ining AS `7_ining`,
  r7.result AS `7_result`,
  r7.rst_id AS `7_rst_id`,
  b7.last_count AS `7_cnt`
FROM
  baseball._bat_last_id_info b1
  LEFT JOIN R_info r1 ON b1.last_count = r1.game_info_id
  LEFT JOIN _bat_last_id_info b2 ON b1.id + 1 = b2.id
  AND b1.order_overview_id = b2.order_overview_id
  AND b1.batter = b2.batter
  LEFT JOIN R_info r2 ON b2.last_count = r2.game_info_id
  LEFT JOIN _bat_last_id_info b3 ON b1.id + 2 = b3.id
  AND b1.order_overview_id = b3.order_overview_id
  AND b1.batter = b3.batter
  LEFT JOIN R_info r3 ON b3.last_count = r3.game_info_id
  LEFT JOIN _bat_last_id_info b4 ON b1.id + 3 = b4.id
  AND b1.order_overview_id = b4.order_overview_id
  AND b1.batter = b4.batter
  LEFT JOIN R_info r4 ON b4.last_count = r4.game_info_id
  LEFT JOIN _bat_last_id_info b5 ON b1.id + 4 = b5.id
  AND b1.order_overview_id = b5.order_overview_id
  AND b1.batter = b5.batter
  LEFT JOIN R_info r5 ON b5.last_count = r5.game_info_id
  LEFT JOIN _bat_last_id_info b6 ON b1.id + 5 = b6.id
  AND b1.order_overview_id = b6.order_overview_id
  AND b1.batter = b6.batter
  LEFT JOIN R_info r6 ON b6.last_count = r6.game_info_id
  LEFT JOIN _bat_last_id_info b7 ON b1.id + 6 = b7.id
  AND b1.order_overview_id = b7.order_overview_id
  AND b1.batter = b7.batter
  LEFT JOIN R_info r7 ON b7.last_count = r7.game_info_id
  -- 全打席情報が揃っている行だけ抽出
  LEFT JOIN (
    SELECT
      order_overview_id,
      MIN(ining) AS ining,
      top_bottom,
      batter,
      MIN(batter_cnt) AS batter_cnt
    FROM
      baseball._bat_last_id_info
    GROUP BY
      batter,
      order_overview_id,
      top_bottom
    ORDER BY
      order_overview_id,
      batter
  ) AS first_bat_info ON b1.order_overview_id = first_bat_info.order_overview_id
  AND b1.top_bottom = first_bat_info.top_bottom
  AND b1.ining = first_bat_info.ining
  AND b1.batter = first_bat_info.batter
  AND b1.batter_cnt = first_bat_info.batter_cnt -- 初回１巡した際に対応するため、打者カウントも結合条件とする
  LEFT JOIN no_game_info ng ON b1.order_overview_id = ng.order_overview_id
WHERE
  ng.remarks IS NULL AND -- ノーゲームを除外
  first_bat_info.batter IS NOT NULL
  -- and b1.batter = 1200069
ORDER BY
  b1.order_overview_id ASC,
  b1.top_bottom ASC,
  b1.ining ASC,
  b1.last_count ASC
;