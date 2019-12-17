-- CREATE TABLE _situation_base 
-- INSERT INTO _situation_base (`g_id`,`oo_id`,`date`,`location`,`pitch_count`, `ining`,`top_bottom`,`pitcher`,`batter`,`name`,`team`,`strike`,`ball`,`out`,`on_all_base`,`runner_1b`,`next_1b_go`,`runner_2b`,`next_2b_go`,`runner_3b`,`next_3b_go`,`bp_count`,`is_commit`,`rst_id`,`result`,`t_total`,`b_total`,`prv_gid`,`bat_cnt`)

-- /*
-- set @no:=0;
-- set @prevbatter:=null;
-- */
-- /*
SELECT
	`g_id`,
	`oo_id`,
	`date`,
	`location`,
    `pitch_count`,
	`ining`,
	`top_bottom`,
	`pitcher`,
	`batter`,
	`name`,
	`team`,
	`strike`,
	`ball`,
	`out`,
	`on_all_base`,
	`runner_1b`,
	`next_1b_go`,
	`runner_2b`,
	`next_2b_go`,
	`runner_3b`,
	`next_3b_go`,
	`bp_count`,
	`is_commit`,
	`rst_id`,
	`result`,
	`t_total`,
	`b_total`,
	`prv_gid`,
    bat_cnt
FROM (
	SELECT 
		g.id AS g_id,
		oo.id AS oo_id,
		oo.date,
        g.pitch_count,
		g.location,
		g.ining,
		g.top_bottom,
		g.pitcher,
		g.batter,
		pb.name,
		pb.team,
		g.strike,
		g.ball,
		g.out,
		g.on_all_base,
		g.runner_1b,
		g.next_1b_go,
		g.runner_2b,
		g.next_2b_go,
		g.runner_3b,
		g.next_3b_go,
		p.batter_pitch_count AS bp_count,
		r.is_commit,
		r.rst_id AS rst_id,
		r.result AS result,
		gs.t_total,
		gs.b_total,
		g.id - 1 AS prv_gid,
        IF(@prevbatter = g.batter, @no, @no := @no + 1) AS bat_cnt,
		@prevbatter := g.batter
	FROM
		baseball.game_info g
		LEFT JOIN order_overview oo ON g.order_overview_id = oo.id
		LEFT JOIN pitch_info p ON g.id = p.game_info_id
		LEFT JOIN R_info r ON g.id = r.game_info_id
		LEFT JOIN baseball.player pb ON g.batter = pb.id
		LEFT JOIN no_game_info ng ON g.order_overview_id = ng.order_overview_id
		LEFT JOIN (SELECT 
			gs1.game_info_id AS giid,
				gs1.total AS t_total,
				gs2.total AS b_total
		FROM
			baseball.game_score_info gs1
		LEFT JOIN baseball.game_score_info gs2 ON gs1.order_overview_id = gs2.order_overview_id
			AND gs1.game_info_id = gs2.game_info_id
			AND gs1.top_bottom = gs2.top_bottom - 1
		WHERE
			gs1.top_bottom = 1
		) AS gs ON g.id = gs.giid
		WHERE ng.remarks IS NULL -- オールスターやノーゲームを除外
) AS A
-- */