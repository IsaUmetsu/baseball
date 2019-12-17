-- CREATE TABLE runner_drive_info 
-- insert into runner_drive_info (`onbase_gid`,`oo_id`,`ining`,`top_bottom`,`pitcher`,`batter`,`out`,`rst_id`,`gid_at_1b`,`gid_at_2b`,`gid_at_3b`,`gid_at_home`,`pinch_run`,`eol`)

SELECT
    prv_gid AS onbase_gid,
    opr.oo_id,
    opr.ining,
    opr.top_bottom,
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
        ELSE IFNULL(oc12.g_id, oc12_pr.g_id)
    END AS gid_at_2b,
    CASE
        WHEN onbase = 3 THEN prv_gid
        ELSE IFNULL(IFNULL(oc13.g_id, oc13_pr.g_id), IFNULL(oc23.g_id, oc23_pr.g_id))
    END AS gid_at_3b,
    CASE
        WHEN onbase = 4 THEN prv_gid
        ELSE IFNULL(IFNULL(oc14.g_id, oc14_pr.g_id), IFNULL(IFNULL(oc24.g_id, oc24_pr.g_id), IFNULL(oc34.g_id, oc34_pr.g_id)))
    END AS gid_at_home,
    pinch_run,
    'e' AS eol
FROM
	_onbase_pitch_run_info opr

--     (
-- 		SELECT
-- 			l.*,
-- 			r.pitcher AS prv_pcr,
-- 			r.batter AS prv_btr,
-- 			r.`out` AS prv_out,
-- 			r.rst_id AS prv_rst_id,
-- 			r.result AS prv_result,
-- 			r.bat_cnt AS prv_bat_cnt,
--             concat(pr.player) AS pinch_run,
-- 			CASE
-- 				WHEN r.batter = l.runner_1b OR pr.player THEN 1
-- 				WHEN r.batter = l.runner_2b OR pr.player THEN 2
-- 				WHEN r.batter = l.runner_3b OR pr.player THEN 3
-- 				WHEN r.rst_id = 9 THEN 4
-- 				ELSE 0
-- 			END AS onbase,
-- 			pr.player,
-- 			'e' AS eol
-- 		FROM
-- 			baseball._situation_base l
-- 			LEFT JOIN _situation_base r ON l.prv_gid = r.g_id
-- 			LEFT JOIN _order_detail_diff AS pr ON pr.oo_id = l.oo_id
-- 				AND pr.top_bottom = l.top_bottom
-- 				AND pr.pitch_count = l.pitch_count
-- 				AND pr.same = 2
-- 				AND pr.pos = 12
-- 		WHERE
-- 			l.is_commit = 1
-- 			OR pr.player IS NOT NULL
-- 			OR (
-- 				l.runner_1b
-- 				OR NOT l.runner_2b
-- 				OR NOT l.runner_3b
-- 			)
-- 			OR r.rst_id = 9
--     ) AS opr

	-- not pinch run
    LEFT JOIN _onbase_combi_all AS oc12 ON oc12.runner_1b = opr.prv_btr
		AND oc12.bat_cnt - opr.bat_cnt >= 0
		AND oc12.bat_cnt - opr.bat_cnt < 9
        AND oc12.ining = opr.ining
		AND oc12.next_1b_go = 2
    LEFT JOIN _onbase_combi_all AS oc13 ON oc13.runner_1b = opr.prv_btr
		AND oc13.bat_cnt - opr.bat_cnt >= 0
		AND oc13.bat_cnt - opr.bat_cnt < 9
        AND oc13.ining = opr.ining
		AND oc13.next_1b_go = 3
    LEFT JOIN _onbase_combi_all AS oc14 ON oc14.runner_1b = opr.prv_btr
		AND oc14.bat_cnt - opr.bat_cnt >= 0
		AND oc14.bat_cnt - opr.bat_cnt < 9
        AND oc14.ining = opr.ining
		AND oc14.next_1b_go = 4
    LEFT JOIN _onbase_combi_all AS oc23 ON oc23.runner_2b = opr.prv_btr
		AND oc23.bat_cnt - opr.bat_cnt >= 0
		AND oc23.bat_cnt - opr.bat_cnt < 9
        AND oc23.ining = opr.ining
		AND oc23.next_2b_go = 3
    LEFT JOIN _onbase_combi_all AS oc24 ON oc24.runner_2b = opr.prv_btr
		AND oc24.bat_cnt - opr.bat_cnt >= 0
		AND oc24.bat_cnt - opr.bat_cnt < 9
        AND oc24.ining = opr.ining
		AND oc24.next_2b_go = 4
    LEFT JOIN _onbase_combi_all AS oc34 ON oc34.runner_3b = opr.prv_btr
		AND oc34.bat_cnt - opr.bat_cnt >= 0
		AND oc34.bat_cnt - opr.bat_cnt < 9
        AND oc34.ining = opr.ining
		AND oc34.next_3b_go = 4
	-- pinch_run
	LEFT JOIN _onbase_combi_all AS oc12_pr ON oc12_pr.runner_1b = opr.pinch_run
		AND oc12_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc12_pr.bat_cnt - opr.bat_cnt < 9
        AND oc12_pr.ining = opr.ining
		AND oc12_pr.next_1b_go = 2
    LEFT JOIN _onbase_combi_all AS oc13_pr ON oc13_pr.runner_1b = opr.pinch_run
		AND oc13_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc13_pr.bat_cnt - opr.bat_cnt < 9
        AND oc13_pr.ining = opr.ining
		AND oc13_pr.next_1b_go = 3
    LEFT JOIN _onbase_combi_all AS oc14_pr ON oc14_pr.runner_1b = opr.pinch_run
		AND oc14_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc14_pr.bat_cnt - opr.bat_cnt < 9
        AND oc14_pr.ining = opr.ining
		AND oc14_pr.next_1b_go = 4
    LEFT JOIN _onbase_combi_all AS oc23_pr ON oc23_pr.runner_2b = opr.pinch_run
		AND oc23_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc23_pr.bat_cnt - opr.bat_cnt < 9
        AND oc23_pr.ining = opr.ining
		AND oc23_pr.next_2b_go = 3
    LEFT JOIN _onbase_combi_all AS oc24_pr ON oc24_pr.runner_2b = opr.pinch_run
		AND oc24_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc24_pr.bat_cnt - opr.bat_cnt < 9
        AND oc24_pr.ining = opr.ining
		AND oc24_pr.next_2b_go = 4
    LEFT JOIN _onbase_combi_all AS oc34_pr ON oc34_pr.runner_3b = opr.pinch_run
		AND oc34_pr.bat_cnt - opr.bat_cnt >= 0
		AND oc34_pr.bat_cnt - opr.bat_cnt < 9
        AND oc34_pr.ining = opr.ining
		AND oc34_pr.next_3b_go = 4
WHERE
    onbase > 0