-- CREATE TABLE _rbi_all 
-- insert into _rbi_all (`g_id`,`oo_id`,`date`,`location`,`ining`,`top_bottom`,`batter`,`name`,`team`,`strike`,`ball`,`out`,`on_all_base`,`runner_1b`,`next_1b_go`,`runner_2b`,`next_2b_go`,`runner_3b`,`next_3b_go`,`bp_count`,`is_commit`,`rst_id`,`result`,`t_total`,`b_total`,`ball_flow`,`RBI`) 

-- SELECT
-- 	-- `mnt`,
--     batter, name, team, sum(RBI) AS RBI from (

	SELECT 
		sb.*,
		r.ball_flow,
-- 		CASE
-- 			WHEN date < 20190401 THEN 3
-- 			WHEN date >= 20190401 AND date < 20190501 THEN 4
-- 			WHEN date >= 20190501 AND date < 20190601 THEN 5
-- 			WHEN date >= 20190601 AND date < 20190701 THEN 6
-- 			WHEN date >= 20190701 AND date < 20190801 THEN 7
-- 			WHEN date >= 20190801 AND date < 20190901 THEN 8
-- 			WHEN date >= 20190901 AND date < 20191001 THEN 9
-- 			END AS mnt,
		-- エラー絡みの得点の場合は手動計算結果を適用、通常得点はそのまま出力
		CASE WHEN ger.id IS NULL THEN CHAR_LENGTH(CONCAT(sb.next_1b_go, sb.next_2b_go, sb.next_3b_go)) - CHAR_LENGTH(REPLACE(CONCAT(sb.next_1b_go, sb.next_2b_go, sb.next_3b_go), '4', '')) + (CASE WHEN sb.rst_id = 9 THEN 1 ELSE 0 END) ELSE ger.runs END AS RBI
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN game_info_id_double_playes_run gd ON gd.id = sb.g_id
	-- LEFT JOIN game_info_id_error ge ON ge.id = sb.g_id
    LEFT JOIN game_info_id_error_runs ger ON ger.id = sb.g_id
	LEFT JOIN R_info r ON r.game_info_id = sb.g_id
	WHERE
		-- name = '中村' AND team = 'L' AND 
			((sb.next_1b_go = 4 OR sb.next_2b_go = 4 OR sb.next_3b_go = 4) OR sb.rst_id = 9)
			AND gd.id IS NULL -- 併殺の間の生還はノーカウント
	ORDER BY oo_id , ining

-- ) AS A group by
-- 	-- `mnt`,
--     batter, name, team
;