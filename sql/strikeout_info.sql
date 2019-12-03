-- create table strikeout_info 
SELECT
  p.*,
  pp.`name`,
  pp.team,
  all_k.all_cnt as `all`,
  IFNULL(swing_k.all_cnt, 0) AS swing,
  ROUND(
    IFNULL(swing_k.all_cnt, 0) / all_k.all_cnt,
    3
  ) AS swg_rate,
  IFNULL(look_k.all_cnt, 0) AS look,
  ROUND(
    IFNULL(look_k.all_cnt, 0) / all_k.all_cnt,
    3
  ) AS look_rate,
  ROUND(p_avg.avg_cnt, 4) AS avg_cnt,
  b1.cnt as b1,
  b2.cnt as b2,
  b3.cnt as b3,
  b4.cnt as b4,
  b5.cnt as b5,
  b6.cnt as b6,
  b7.cnt as b7,
  b8.cnt as b8,
  b9.cnt as b9,
  ROUND(IFNULL(b1.cnt, 0) / all_k.all_cnt, 4) AS b1_rate,
  ROUND(IFNULL(b2.cnt, 0) / all_k.all_cnt, 4) AS b2_rate,
  ROUND(IFNULL(b3.cnt, 0) / all_k.all_cnt, 4) AS b3_rate,
  ROUND(IFNULL(b4.cnt, 0) / all_k.all_cnt, 4) AS b4_rate,
  ROUND(IFNULL(b5.cnt, 0) / all_k.all_cnt, 4) AS b5_rate,
  ROUND(IFNULL(b6.cnt, 0) / all_k.all_cnt, 4) AS b6_rate,
  ROUND(IFNULL(b7.cnt, 0) / all_k.all_cnt, 4) AS b7_rate,
  ROUND(IFNULL(b8.cnt, 0) / all_k.all_cnt, 4) AS b8_rate,
  ROUND(IFNULL(b9.cnt, 0) / all_k.all_cnt, 4) AS b9_rate
FROM
  _player_pitcher p
  LEFT JOIN player pp ON p.id = pp.id
  LEFT JOIN (
    SELECT
      pitcher,
      COUNT(*) AS all_cnt
    FROM
      _tmp_strikeout
    GROUP BY
      pitcher
  ) AS all_k ON p.id = all_k.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      COUNT(*) AS all_cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 28)
    GROUP BY
      pitcher
  ) AS swing_k ON p.id = swing_k.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      COUNT(*) AS all_cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id = 17
    GROUP BY
      pitcher
  ) AS look_k ON p.id = look_k.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 1
    GROUP BY
      pitcher,
      ball_type
  ) AS b1 ON p.id = b1.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 2
    GROUP BY
      pitcher,
      ball_type
  ) AS b2 ON p.id = b2.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 3
    GROUP BY
      pitcher,
      ball_type
  ) AS b3 ON p.id = b3.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 4
    GROUP BY
      pitcher,
      ball_type
  ) AS b4 ON p.id = b4.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 5
    GROUP BY
      pitcher,
      ball_type
  ) AS b5 ON p.id = b5.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 6
    GROUP BY
      pitcher,
      ball_type
  ) AS b6 ON p.id = b6.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 7
    GROUP BY
      pitcher,
      ball_type
  ) AS b7 ON p.id = b7.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 8
    GROUP BY
      pitcher,
      ball_type
  ) AS b8 ON p.id = b8.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = 9
    GROUP BY
      pitcher,
      ball_type
  ) AS b9 ON p.id = b9.pitcher
  LEFT JOIN (
    SELECT
      pitcher,
      AVG(batter_pitch_count) AS avg_cnt
    FROM
      _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
    GROUP BY
      pitcher
  ) AS p_avg ON p.id = p_avg.pitcher
WHERE
  all_k.all_cnt IS NOT NULL
ORDER BY
  avg_cnt desc;