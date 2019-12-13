-- create table _runner_all 

SELECT 
    -- *
	prv_gid AS g_id,
    prv_pcr AS pitcher, 
    prv_btr AS batter,
    prv_out AS `out`,
    prv_rst_id AS rst_id,
    onbase,
    'e' AS eol
FROM
    (
    SELECT 
		l.*,        
		r.pitcher AS prv_pcr,
		r.batter AS prv_btr,
		r.`out` AS prv_out,
		r.rst_id AS prv_rst_id,
		r.result AS prv_result,
        r.bat_cnt AS prv_bat_cnt,
        CASE WHEN r.batter = l.runner_1b THEN 1 WHEN r.batter = l.runner_2b THEN 2 WHEN r.batter = l.runner_3b THEN 3 WHEN r.rst_id = 9 THEN 4 ELSE 0 END AS onbase
    FROM
        baseball._situation_base l
    LEFT JOIN _situation_base r ON l.prv_gid = r.g_id
    WHERE
        l.is_commit = 1
            OR (l.runner_1b != '' OR l.runner_2b != '' OR l.runner_3b != '')
	) AS A
WHERE
    onbase > 0
;