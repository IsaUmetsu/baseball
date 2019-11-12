-- create table homerun_type_team

-- insert into homerun_type_team (`homerun_type`,`team`,`cnt`,`summary_1`,`summary_2`,`team_cnt`,`percent`)
SELECT 
    CASE
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) >= GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                AND JUDGE_GOODBYE(g.order_overview_id, g.pitch_count + 1)
        THEN
            'サヨナラ'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
        THEN
            '先制'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追い上げ'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '同点'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '逆転'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '勝ち越し'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追加点'
        ELSE 'その他'
    END AS homerun_type,
    t.team_short_name AS team,
    COUNT(CASE
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) >= GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                AND JUDGE_GOODBYE(g.order_overview_id, g.pitch_count + 1)
        THEN
            'サヨナラ'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
        THEN
            '先制'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追い上げ'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '同点'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '逆転'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '勝ち越し'
        WHEN
            GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
        THEN
            '追加点'
        ELSE 'その他'
    END) AS cnt,
    -- /*
    CONCAT(t.team_short_name,
            ' ',
            COUNT(CASE
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) >= GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                        AND JUDGE_GOODBYE(g.order_overview_id, g.pitch_count + 1)
                THEN
                    'サヨナラ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                        AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
                THEN
                    '先制'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追い上げ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '同点'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '逆転'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '勝ち越し'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追加点'
                ELSE 'その他'
            END)) AS summary_1,
    CONCAT(COUNT(CASE
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) >= GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                        AND JUDGE_GOODBYE(g.order_overview_id, g.pitch_count + 1)
                THEN
                    'サヨナラ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                        AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
                THEN
                    '先制'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追い上げ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '同点'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '逆転'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '勝ち越し'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追加点'
                ELSE 'その他'
            END),
            ' ',
            t.team_short_name) AS summary_2,
            -- */
    team_hr.team_cnt,
    ROUND(COUNT(CASE
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) >= GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                        AND JUDGE_GOODBYE(g.order_overview_id, g.pitch_count + 1)
                THEN
                    'サヨナラ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = 0
                        AND GET_OWN_PREV_SCORE(g.id, g.top_bottom) = 0
                THEN
                    '先制'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追い上げ'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '同点'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) > GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '逆転'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) = GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '勝ち越し'
                WHEN
                    GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_PREV_SCORE(g.id, g.top_bottom)
                        AND GET_OPPONENT_SCORE(g.id, g.top_bottom) < GET_OWN_AFTER_SCORE(g.id, g.top_bottom)
                THEN
                    '追加点'
                ELSE 'その他'
            END) / team_hr.team_cnt * 100,
            1) AS percent
FROM
    baseball.game_info g
        LEFT JOIN
    baseball.player pp ON g.pitcher = pp.id
        LEFT JOIN
    baseball.player pb ON g.batter = pb.id
        LEFT JOIN
    baseball.player pr1b ON g.runner_1b = pr1b.id
        LEFT JOIN
    baseball.player pr2b ON g.runner_2b = pr2b.id
        LEFT JOIN
    baseball.player pr3b ON g.runner_3b = pr3b.id
        LEFT JOIN
    baseball.pitch_info pi ON g.id = pi.game_info_id
        LEFT JOIN
    order_overview oo ON g.order_overview_id = oo.id
        LEFT JOIN
    no_game_info ng ON g.order_overview_id = ng.order_overview_id
        LEFT JOIN
    (SELECT 
        team, SUM(cnt) AS team_cnt
    FROM
        baseball.homerun_king
    GROUP BY team) AS team_hr ON team_hr.team = pb.team
    left join team_info t on pb.team = t.team_initial
WHERE
    pi.col_8 = '本塁打'
        AND ng.remarks IS NULL
GROUP BY homerun_type , t.team_short_name , team_cnt
ORDER BY homerun_type DESC , cnt DESC , percent DESC
