SELECT t.team_short_name AS チーム, gihi.cnt + chance.cnt AS '機会', gihi.cnt AS '犠飛', round(round(gihi.cnt / (gihi.cnt + chance.cnt), 4) * 100, 1) AS '犠飛生還率' FROM (
SELECT 
    team,
    count(rst_id = 15 OR NULL) AS cnt
FROM
    baseball.situation_base_commit sb
group by team
) AS gihi LEFT JOIN (
SELECT 
    team,
    count(sb.rst_id) AS cnt
FROM
    baseball.situation_base_commit sb
left join R_info r on sb.g_id = r.game_info_id
where sb.`out` < 2 AND sb.runner_3b != '' AND sb.rst_id IN (10, 12, 13) AND r.direction IN (7, 8, 9)
group by team
) AS chance ON chance.team = gihi.team
left join team_info t on gihi.team = t.team_initial
where gihi.cnt > 0
order by '犠飛生還率' DESC
;