-- CREATE TABLE runner_drive_info 

SELECT
    prv_gid AS onbase_g_id,
    A.oo_id as order_overview_id,
    A.ining,
    A.top_bottom,
    prv_pcr AS pitcher,
    prv_btr AS batter,
    prv_out AS `out`,
    prv_rst_id AS rst_id,
    CASE
        WHEN onbase = 1 THEN prv_gid
        ELSE NULL
    END AS gid_at_1b,
    CASE
        WHEN onbase = 2 THEN prv_gid
        ELSE oc12.g_id
    END AS gid_at_2b,
    CASE
        WHEN onbase = 3 THEN prv_gid
        ELSE IFNULL(oc13.g_id, oc23.g_id)
    END AS gid_at_3b,
    CASE
        WHEN onbase = 4 THEN prv_gid
        ELSE IFNULL(oc14.g_id, IFNULL(oc24.g_id, oc34.g_id))
    END AS gid_at_home,
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
            CASE
                WHEN r.batter = l.runner_1b THEN 1
                WHEN r.batter = l.runner_2b THEN 2
                WHEN r.batter = l.runner_3b THEN 3
                WHEN r.rst_id = 9 THEN 4
                ELSE 0
            END AS onbase
        FROM
            baseball._situation_base l
            LEFT JOIN _situation_base r ON l.prv_gid = r.g_id
        WHERE
            l.is_commit = 1
            OR (
				l.runner_1b
                OR NOT l.runner_2b
                OR NOT l.runner_3b
            )
            OR r.rst_id = 9
    ) AS A
    LEFT JOIN _onbase_combi_all AS oc12 ON oc12.runner_1b = A.prv_btr
		AND oc12.bat_cnt - A.bat_cnt >= 0
		AND oc12.bat_cnt - A.bat_cnt < 9
		AND oc12.next_1b_go = 2
    LEFT JOIN _onbase_combi_all AS oc13 ON oc13.runner_1b = A.prv_btr
		AND oc13.bat_cnt - A.bat_cnt >= 0
		AND oc13.bat_cnt - A.bat_cnt < 9
		AND oc13.next_1b_go = 3
    LEFT JOIN _onbase_combi_all AS oc14 ON oc14.runner_1b = A.prv_btr
		AND oc14.bat_cnt - A.bat_cnt >= 0
		AND oc14.bat_cnt - A.bat_cnt < 9
		AND oc14.next_1b_go = 4
    LEFT JOIN _onbase_combi_all AS oc23 ON oc23.runner_2b = A.prv_btr
		AND oc23.bat_cnt - A.bat_cnt >= 0
		AND oc23.bat_cnt - A.bat_cnt < 9
		AND oc23.next_2b_go = 3
    LEFT JOIN _onbase_combi_all AS oc24 ON oc24.runner_2b = A.prv_btr
		AND oc24.bat_cnt - A.bat_cnt >= 0
		AND oc24.bat_cnt - A.bat_cnt < 9
		AND oc24.next_2b_go = 4
    LEFT JOIN _onbase_combi_all AS oc34 ON oc34.runner_3b = A.prv_btr
		AND oc34.bat_cnt - A.bat_cnt >= 0
		AND oc34.bat_cnt - A.bat_cnt < 9
		AND oc34.next_3b_go = 4
WHERE
    onbase > 0;