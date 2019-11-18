-- create table _situation_tsuikaten_all
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
    p.col_8 AS result,
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
    LEFT JOIN no_game_info ng ON g.order_overview_id = ng.order_overview_id
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
--     pb.name = '吉田正' AND
--     p.col_8 = '本塁打' AND
-- 	g.on_all_base IN (
--                         SELECT
--                             on_all_base
--                         FROM
--                             baseball.on_all_base_info
--                         WHERE
--                             on_all_base REGEXP (
--                                 CASE
--                                     (
--                                         CASE
--                                             g.top_bottom
--                                             WHEN 1 THEN b_total - t_total
--                                             WHEN 2 THEN t_total - b_total
--                                         END
--                                     ) -- WHEN 0 THEN '[01]{1,}'  WHEN 1 THEN '[0]{3}'
--                                     WHEN 2 THEN '0{3}'
--                                     WHEN 3 THEN '0{2,}|010'
--                                     WHEN 4 THEN '[^1{3}]' -- 満塁以外の全パターン
--                                     ELSE '[0-1]{3}' -- その他の点差はどんな類状況でも可
--                                 END
/*
【追い上げ本塁打の条件】
・リード時、同点時はありえない
・1点差ビハインドでもありえない
・2点差ビハインドならソロ(走者なし)
・3点差ビハインドならソロ or 2ラン(走者なし・走者1人)
・4点差ビハインドならソロ or 2ラン or 3ラン(走者なし・走者1人・走者2人)
・5点差以上のビハインドなら全ての本塁打を許容(全ての走者のパターン)
*/
--                     ))
                    -- 2点差以上のビハインドのみ
--                     AND
                    (
                        CASE
                            g.top_bottom
                            WHEN 1 THEN t_total - b_total
                            WHEN 2 THEN b_total - t_total
                        END
                    ) > 0
	AND ng.remarks IS NULL -- オールスターやノーゲームを除外
ORDER BY g.id
;