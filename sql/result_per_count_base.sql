-- CREATE TABLE result_per_count_base
-- CREATE TABLE result_per_count_regulation

SELECT
	pb.id, p.name, p.team,
    IFNULL(c_00.hit, 0) AS hit_00,
    IFNULL(c_00.hr, 0) AS hr_00,
    IFNULL(c_00.rbi, 0) AS rbi_00,
    IFNULL(c_00.bat, 0) AS bat_00,
    ROUND(CASE WHEN IFNULL(c_00.bat, 0) > 0 THEN c_00.hit / c_00.bat ELSE 0 END, 5) AS rate_00,
    IFNULL(c_01.hit, 0) AS hit_01,
    IFNULL(c_01.hr, 0) AS hr_01,
    IFNULL(c_01.rbi, 0) AS rbi_01,
    IFNULL(c_01.bat, 0) AS bat_01,
    ROUND(CASE WHEN IFNULL(c_01.bat, 0) > 0 THEN c_01.hit / c_01.bat ELSE 0 END, 5) AS rate_01,
    IFNULL(c_02.hit, 0) AS hit_02,
    IFNULL(c_02.hr, 0) AS hr_02,
    IFNULL(c_02.rbi, 0) AS rbi_02,
    IFNULL(c_02.bat, 0) AS bat_02,
    ROUND(CASE WHEN IFNULL(c_02.bat, 0) > 0 THEN c_02.hit / c_02.bat ELSE 0 END, 5) AS rate_02,
    IFNULL(c_10.hit, 0) AS hit_10,
    IFNULL(c_10.hr, 0) AS hr_10,
    IFNULL(c_10.rbi, 0) AS rbi_10,
    IFNULL(c_10.bat, 0) AS bat_10,
    ROUND(CASE WHEN IFNULL(c_10.bat, 0) > 0 THEN c_10.hit / c_10.bat ELSE 0 END, 5) AS rate_10,
    IFNULL(c_11.hit, 0) AS hit_11,
    IFNULL(c_11.hr, 0) AS hr_11,
    IFNULL(c_11.rbi, 0) AS rbi_11,
    IFNULL(c_11.bat, 0) AS bat_11,
    ROUND(CASE WHEN IFNULL(c_11.bat, 0) > 0 THEN c_11.hit / c_11.bat ELSE 0 END, 5) AS rate_11,
    IFNULL(c_12.hit, 0) AS hit_12,
    IFNULL(c_12.hr, 0) AS hr_12,
    IFNULL(c_12.rbi, 0) AS rbi_12,
    IFNULL(c_12.bat, 0) AS bat_12,
    ROUND(CASE WHEN IFNULL(c_12.bat, 0) > 0 THEN c_12.hit / c_12.bat ELSE 0 END, 5) AS rate_12,
    IFNULL(c_20.hit, 0) AS hit_20,
    IFNULL(c_20.hr, 0) AS hr_20,
    IFNULL(c_20.rbi, 0) AS rbi_20,
    IFNULL(c_20.bat, 0) AS bat_20,
    ROUND(CASE WHEN IFNULL(c_20.bat, 0) > 0 THEN c_20.hit / c_20.bat ELSE 0 END, 5) AS rate_20,
    IFNULL(c_21.hit, 0) AS hit_21,
    IFNULL(c_21.hr, 0) AS hr_21,
    IFNULL(c_21.rbi, 0) AS rbi_21,
    IFNULL(c_21.bat, 0) AS bat_21,
    ROUND(CASE WHEN IFNULL(c_21.bat, 0) > 0 THEN c_21.hit / c_21.bat ELSE 0 END, 5) AS rate_21,
	IFNULL(c_22.hit, 0) AS hit_22,
    IFNULL(c_22.hr, 0) AS hr_22,
    IFNULL(c_22.rbi, 0) AS rbi_22,
    IFNULL(c_22.bat, 0) AS bat_22,
    ROUND(CASE WHEN IFNULL(c_22.bat, 0) > 0 THEN c_22.hit / c_22.bat ELSE 0 END, 5) AS rate_22,
	IFNULL(c_30.hit, 0) AS hit_30,
    IFNULL(c_30.hr, 0) AS hr_30,
    IFNULL(c_30.rbi, 0) AS rbi_30,
    IFNULL(c_30.bat, 0) AS bat_30,
    ROUND(CASE WHEN IFNULL(c_30.bat, 0) > 0 THEN c_30.hit / c_30.bat ELSE 0 END, 5) AS rate_30,
	IFNULL(c_31.hit, 0) AS hit_31,
    IFNULL(c_31.hr, 0) AS hr_31,
    IFNULL(c_31.rbi, 0) AS rbi_31,
    IFNULL(c_31.bat, 0) AS bat_31,
    ROUND(CASE WHEN IFNULL(c_31.bat, 0) > 0 THEN c_31.hit / c_31.bat ELSE 0 END, 5) AS rate_31,
	IFNULL(c_32.hit, 0) AS hit_32,
    IFNULL(c_32.hr, 0) AS hr_32,
    IFNULL(c_32.rbi, 0) AS rbi_32,
    IFNULL(c_32.bat, 0) AS bat_32,
    ROUND(CASE WHEN IFNULL(c_32.bat, 0) > 0 THEN c_32.hit / c_32.bat ELSE 0 END, 5) AS rate_32,
    'e' AS `eol`
FROM
	_player_batter pb
LEFT JOIN player p on pb.id = p.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) AS bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 0 AND sb.strike = 0
	GROUP BY batter
) AS c_00 ON c_00.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 0 AND sb.strike = 1
	GROUP BY batter
) AS c_01 ON c_01.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 0 AND sb.strike = 2
	GROUP BY batter
) AS c_02 ON c_02.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 1 AND sb.strike = 0
	GROUP BY batter
) AS c_10 ON c_10.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 1 AND sb.strike = 1
	GROUP BY batter
) AS c_11 ON c_11.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 1 AND sb.strike = 2
	GROUP BY batter
) AS c_12 ON c_12.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 2 AND sb.strike = 0
	GROUP BY batter
) AS c_20 ON c_20.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 2 AND sb.strike = 1
	GROUP BY batter
) AS c_21 ON c_21.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 2 AND sb.strike = 2
	GROUP BY batter
) AS c_22 ON c_22.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 3 AND sb.strike = 0
	GROUP BY batter
) AS c_30 ON c_30.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 3 AND sb.strike = 1
	GROUP BY batter
) AS c_31 ON c_31.batter = pb.id
LEFT JOIN (
	SELECT 
        sb.batter,
		COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
        COUNT(h.rst_id = 9 OR NULL) AS hr,
        SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
		COUNT(e.name IS NULL OR NULL) as bat
	FROM
		baseball.situation_base_commit sb
	LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
	LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
	WHERE sb.ball = 3 AND sb.strike = 2
	GROUP BY batter
) AS c_32 ON c_32.batter = pb.id
LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;