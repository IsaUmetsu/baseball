-- CREATE TABLE result_per_situation_base
-- CREATE TABLE result_per_situation_base_regulation

SELECT
	pb.id, p.name, p.team,
    IFNULL(b_000.hit, 0) AS hit_000,
    IFNULL(b_000.hr, 0) AS hr_000,
    IFNULL(b_000.rbi, 0) AS rbi_000,
    IFNULL(b_000.bat, 0) AS bat_000,
    ROUND(CASE WHEN IFNULL(b_000.bat, 0) > 0 THEN b_000.hit / b_000.bat ELSE 0 END, 5) AS rate_000,
    IFNULL(b_100.hit, 0) AS hit_100,
    IFNULL(b_100.hr, 0) AS hr_100,
    IFNULL(b_100.rbi, 0) AS rbi_100,
    IFNULL(b_100.bat, 0) AS bat_100,
    ROUND(CASE WHEN IFNULL(b_100.bat, 0) > 0 THEN b_100.hit / b_100.bat ELSE 0 END, 5) AS rate_100,
    IFNULL(b_110.hit, 0) AS hit_110,
    IFNULL(b_110.hr, 0) AS hr_110,
    IFNULL(b_110.rbi, 0) AS rbi_110,
    IFNULL(b_110.bat, 0) AS bat_110,
    ROUND(CASE WHEN IFNULL(b_110.bat, 0) > 0 THEN b_110.hit / b_110.bat ELSE 0 END, 5) AS rate_110,
    IFNULL(b_101.hit, 0) AS hit_101,
    IFNULL(b_101.hr, 0) AS hr_101,
    IFNULL(b_101.rbi, 0) AS rbi_101,
    IFNULL(b_101.bat, 0) AS bat_101,
    ROUND(CASE WHEN IFNULL(b_101.bat, 0) > 0 THEN b_101.hit / b_101.bat ELSE 0 END, 5) AS rate_101,
    IFNULL(b_010.hit, 0) AS hit_010,
    IFNULL(b_010.hr, 0) AS hr_010,
    IFNULL(b_010.rbi, 0) AS rbi_010,
    IFNULL(b_010.bat, 0) AS bat_010,
    ROUND(CASE WHEN IFNULL(b_010.bat, 0) > 0 THEN b_010.hit / b_010.bat ELSE 0 END, 5) AS rate_010,
    IFNULL(b_011.hit, 0) AS hit_011,
    IFNULL(b_011.hr, 0) AS hr_011,
    IFNULL(b_011.rbi, 0) AS rbi_011,
    IFNULL(b_011.bat, 0) AS bat_011,
    ROUND(CASE WHEN IFNULL(b_011.bat, 0) > 0 THEN b_011.hit / b_011.bat ELSE 0 END, 5) AS rate_011,
    IFNULL(b_001.hit, 0) AS hit_001,
    IFNULL(b_001.hr, 0) AS hr_001,
    IFNULL(b_001.rbi, 0) AS rbi_001,
    IFNULL(b_001.bat, 0) AS bat_001,
    ROUND(CASE WHEN IFNULL(b_001.bat, 0) > 0 THEN b_001.hit / b_001.bat ELSE 0 END, 5) AS rate_001,
    IFNULL(b_111.hit, 0) AS hit_111,
    IFNULL(b_111.hr, 0) AS hr_111,
    IFNULL(b_111.rbi, 0) AS rbi_111,
    IFNULL(b_111.bat, 0) AS bat_111,
    ROUND(CASE WHEN IFNULL(b_111.bat, 0) > 0 THEN b_111.hit / b_111.bat ELSE 0 END, 5) AS rate_111,
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
	WHERE sb.on_all_base = '000'
	GROUP BY batter
) AS b_000 ON b_000.batter = pb.id
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
	WHERE sb.on_all_base = '100'
	GROUP BY batter
) AS b_100 ON b_100.batter = pb.id
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
	WHERE sb.on_all_base = '110'
	GROUP BY batter
) AS b_110 ON b_110.batter = pb.id
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
	WHERE sb.on_all_base = '101'
	GROUP BY batter
) AS b_101 ON b_101.batter = pb.id
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
	WHERE sb.on_all_base = '010'
	GROUP BY batter
) AS b_010 ON b_010.batter = pb.id
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
	WHERE sb.on_all_base = '011'
	GROUP BY batter
) AS b_011 ON b_011.batter = pb.id
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
	WHERE sb.on_all_base = '001'
	GROUP BY batter
) AS b_001 ON b_001.batter = pb.id
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
	WHERE sb.on_all_base = '111'
	GROUP BY batter
) AS b_111 ON b_111.batter = pb.id
LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter
WHERE br.batter IS NOT NULL
;