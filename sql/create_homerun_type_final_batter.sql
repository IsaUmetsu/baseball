-- create table homerun_type_final_batter
SELECT 
    h.*, g.id as game_info_id, g.top_bottom, judge_finalized_win_3(h.order_overview_id, g.id, g.top_bottom) as is_not_final_score
FROM
    baseball.tmp_homerun_type_rank h
        LEFT JOIN
    game_info g ON g.order_overview_id = h.order_overview_id
        AND g.pitch_count = h.pitch_count
        LEFT JOIN
    game_score_info gs ON gs.game_info_id = g.id
        AND gs.top_bottom = g.top_bottom
WHERE
    h.homerun_type IN ('勝ち越し' , '逆転', 'サヨナラ')
;


-- [ insert to `homerun_type_batter` ]

-- insert into homerun_type_batter (homerun_type, name, team, cnt, summary, summary_all, total_cnt, percent)
/*
SELECT 
    '決勝' AS homerun_type,
    name,
    team,
    SUM(cnt) AS cnt,
    summary,
    summary_all,
    total_cnt,
    ROUND(SUM(cnt) / total_cnt * 100, 1) AS percent
FROM
    baseball.homerun_type_final_batter
WHERE
    is_not_final_score = 0 -- only flag true
GROUP BY name , team, summary , summary_all , total_cnt
ORDER BY cnt DESC
;
*/