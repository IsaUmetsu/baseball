-- insert into homerun_type_team (homerun_type, team, cnt, team_cnt, percent)

SELECT 
    '決勝' AS homerun_type,
    t.team_short_name AS team,
    SUM(fb.cnt) AS cnt,
    team_homerun_info.team_cnt,
    ROUND(SUM(fb.cnt) / team_homerun_info.team_cnt * 100,
            1) AS percent
FROM
    baseball.homerun_type_final_batter fb
        LEFT JOIN
    (SELECT 
        team, SUM(cnt) AS team_cnt
    FROM
        baseball.homerun_king
    GROUP BY team) AS team_homerun_info ON fb.team = team_homerun_info.team
        LEFT JOIN
    team_info t ON fb.team = t.team_initial
WHERE
    is_not_final_score = 0
GROUP BY t.team_short_name , team_homerun_info.team_cnt
ORDER BY cnt DESC
;