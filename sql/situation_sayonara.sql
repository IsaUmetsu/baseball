-- create table _situation_sayonara_all
SELECT 
    oo.date,
    g.location,
    g.ining,
    g.top_bottom,
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
    p.result AS result,
    gs.t_total,
    gs.b_total
FROM
    baseball.game_info g
        LEFT JOIN
    order_overview oo ON g.order_overview_id = oo.id
        LEFT JOIN
    pitch_info p ON g.id = p.game_info_id
        LEFT JOIN
    baseball.player pb ON g.batter = pb.id
        LEFT JOIN
    no_game_info ng ON g.order_overview_id = ng.order_overview_id
        LEFT JOIN
    (SELECT 
        gs1.game_info_id AS giid,
            gs1.total AS t_total,
            gs2.total AS b_total
    FROM
        baseball.game_score_info gs1
    LEFT JOIN baseball.game_score_info gs2 ON gs1.order_overview_id = gs2.order_overview_id
        AND gs1.game_info_id = gs2.game_info_id
        AND gs1.top_bottom = gs2.top_bottom - 1
    WHERE
        gs1.top_bottom = 1) AS gs ON g.id = gs.giid
WHERE
    -- pb.name = 'ウィーラー' AND
    /*
	【サヨナラシチュエーション】
	・9回以上で裏の攻撃
	・同点
	・3点差以内のビハインドである場合
	　　1点差：ランナー1人以上
	　　2点差：ランナー2人以上
	　　3点差：ランナー3人

	*/
    ining >= 9
	AND top_bottom = 2
	AND ng.remarks IS NULL
    AND (b_total - t_total = 0 OR
    (t_total - b_total > 0 AND t_total - b_total < 4 AND (g.on_all_base IN (
        SELECT
            on_all_base
        FROM
            baseball.on_all_base_info
        WHERE
            on_all_base REGEXP (
                CASE
                    (
                        CASE
                            g.top_bottom
                            WHEN 1 THEN b_total - t_total
                            WHEN 2 THEN t_total - b_total
                        END
                    )
                    WHEN 1 THEN '1{1,}' -- ランナーが1人以上出ていれば逆転可能
                    WHEN 2 THEN '1{2,}|101' -- ランナーが2人以上出ていれば逆転可能
                    WHEN 3 THEN '1{3}'
                    ELSE '1+'
                END
            )))))
ORDER BY g.id
;