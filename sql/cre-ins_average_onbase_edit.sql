-- create table average_onbase 

-- insert into baseball.average_onbase (what_bat, `name`, team, bat_cnt, onbase_cnt, average) 

SELECT
  1 as what_bat,
  pb.name,
  pb.team,
  -- all_bat.all_bat_cnt,
  bat.bat_cnt,
  IFNULL(hit.hit_cnt, 0) AS hit_cnt,
  ROUND(IFNULL(hit.hit_cnt, 0) / bat.bat_cnt, 4) AS average
FROM
  -- 打席数
  (
    SELECT
      bf.batter,
      COUNT(bf.batter) AS all_bat_cnt
    FROM
      baseball._bat_first bf
    GROUP BY
      bf.batter
  ) AS all_bat
	-- 打数
    LEFT JOIN (
    SELECT
      bf.batter,
      COUNT(bf.batter) AS bat_cnt
    FROM
      baseball._bat_first bf
	LEFT JOIN exclude_onbase_info e ON bf.result = e.name
    where
	  e.name IS NULL
    GROUP BY
      bf.batter
  ) AS bat ON all_bat.batter = bat.batter
  -- 出塁数
  LEFT JOIN (
    SELECT
      bf.batter,
      COUNT(bf.batter) AS hit_cnt
    FROM
      baseball._bat_first bf
    WHERE
      bf.rst_id IN (
		2, 3, 4, 6, 8, 9, -- hits
        5, -- dead ball
        19 -- four ball
	  )
    GROUP BY
      bf.batter
  ) AS hit ON bat.batter = hit.batter
  LEFT JOIN player pb ON bat.batter = pb.id
WHERE
	pb.name is not null
  AND all_bat_cnt >=  30 -- 第1打席: 100, 第2打席: 80
ORDER BY
  average DESC, bat_cnt DESC;