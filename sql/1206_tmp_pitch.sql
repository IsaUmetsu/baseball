SELECT `name` AS 選手名, team AS チーム, ストレート, カーブ, シュート, スライダー, フォーク, シンカー, チェンジアップ, カットボール, 合計投球数 FROM (
	SELECT 
		`name`, team, 
		CONCAT(round((IFNULL(b1_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS ストレート,
		CONCAT(round((IFNULL(b2_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS カーブ,
		CONCAT(round((IFNULL(b3_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS シュート,
		CONCAT(round((IFNULL(b4_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS スライダー,
		CONCAT(round((IFNULL(b5_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS フォーク,
		CONCAT(round((IFNULL(b6_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS シンカー,
		CONCAT(round((IFNULL(b7_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS チェンジアップ,
		CONCAT(round((IFNULL(b9_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) * 100, 2), '%') AS カットボール,
		(IFNULL(b1_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b1_rate,
		(IFNULL(b2_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b2_rate,
		(IFNULL(b3_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b3_rate,
		(IFNULL(b4_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b4_rate,
		(IFNULL(b5_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b5_rate,
		(IFNULL(b6_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b6_rate,
		(IFNULL(b7_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b7_rate,
		(IFNULL(b9_mes_cnt, 0) / (IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0))) AS b9_rate,
		IFNULL(b1_mes_cnt, 0) + IFNULL(b2_mes_cnt, 0) + IFNULL(b3_mes_cnt, 0) + IFNULL(b4_mes_cnt, 0) + IFNULL(b5_mes_cnt, 0) + IFNULL(b6_mes_cnt, 0) + IFNULL(b7_mes_cnt, 0) + IFNULL(b8_mes_cnt, 0) + IFNULL(b9_mes_cnt, 0) AS 合計投球数
	FROM
		baseball.pitched_ball_info
	WHERE
		b3_mes_cnt > 0
		-- AND (`name` = '原' AND team = 'S') OR (`name` like '菊池%' AND team = 'C')
	ORDER BY b3_rate DESC
) AS A
-- WHERE 合計投球数 >= 1000