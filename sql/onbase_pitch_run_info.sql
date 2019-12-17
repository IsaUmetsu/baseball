-- create table _onbase_pitch_run_info 
-- insert into _onbase_pitch_run_info (`g_id`,`oo_id`,`date`,`location`,`pitch_count`,`ining`,`top_bottom`,`pitcher`,`batter`,`name`,`team`,`strike`,`ball`,`out`,`on_all_base`,`runner_1b`,`next_1b_go`,`runner_2b`,`next_2b_go`,`runner_3b`,`next_3b_go`,`bp_count`,`is_commit`,`rst_id`,`result`,`t_total`,`b_total`,`prv_gid`,`bat_cnt`,`prv_pcr`,`prv_btr`,`prv_out`,`prv_rst_id`,`prv_result`,`prv_bat_cnt`,`pinch_run`,`onbase`,`eol`)

		SELECT
			l.*,
			r.pitcher AS prv_pcr,
			r.batter AS prv_btr,
			r.`out` AS prv_out,
			r.rst_id AS prv_rst_id,
			r.result AS prv_result,
			r.bat_cnt AS prv_bat_cnt,
            pr.player AS pinch_run,
			CASE
				WHEN r.batter = l.runner_1b OR pr.player = l.runner_1b THEN 1
				WHEN r.batter = l.runner_2b OR pr.player = l.runner_2b THEN 2
				WHEN r.batter = l.runner_3b OR pr.player = l.runner_3b THEN 3
				WHEN r.rst_id = 9 THEN 4
				ELSE 0
			END AS onbase,
			'e' AS eol
		FROM
			baseball._situation_base l
			LEFT JOIN _situation_base r ON l.prv_gid = r.g_id
			LEFT JOIN _order_detail_diff AS pr ON pr.oo_id = l.oo_id
				AND pr.top_bottom = l.top_bottom
				AND pr.pitch_count = l.pitch_count
				AND pr.same = 2
				AND pr.pos = 12
		WHERE
			l.is_commit = 1
			OR pr.player IS NOT NULL
			OR (
				l.runner_1b
				OR NOT l.runner_2b
				OR NOT l.runner_3b
			)
			OR r.rst_id = 9