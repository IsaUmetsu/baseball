SELECT 
    t.team_short_name as チーム,
    count(team) as 本塁進塁企画,
    count(next_2b_go = 4 OR NULL) as 得点,
    round(count(next_2b_go = 4 OR NULL) / count(team), 3) as 企画成功割合
FROM
    baseball.situation_base_commit sb
left join baseball.R_info r on sb.g_id = r.game_info_id 
left join team_info t on sb.team = t.team_initial
where
	sb.rst_id IN (2, 3, 4)
    and runner_2b != ''
    and (next_2b_go != 3
		AND next_2b_go != ''
	)
    -- and sb.team = 'E'
    and r.direction > 6
    and t.id is not null
group by t.team_short_name
order by 企画成功割合 DESC
;