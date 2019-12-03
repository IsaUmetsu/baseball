-- create table _infield_hit 
-- SELECT 
--     COUNT(name) AS hit_cnt, name, team
-- FROM
--     (
    SELECT 
        -- r.direction, pb.name, pb.team
        pb.name, pb.team,
        count(h.rst_id IS NOT NULL or null) as hit_cnt,
        count((r.direction NOT IN (7 , 8, 9) AND r.ps_col_2 NOT IN (7, 8, 9)) or null) as infield_cnt,
        count((r.direction NOT IN (7 , 8, 9) AND r.ps_col_2 NOT IN (7, 8, 9)) or null) / count(h.rst_id IS NOT NULL or null) as average,
        concat(round(count((r.direction NOT IN (7 , 8, 9) AND r.ps_col_2 NOT IN (7, 8, 9)) or null) / count(h.rst_id IS NOT NULL or null), 2) * 100, '%') as percent
    FROM
        baseball._bat_last_id_info g
    LEFT JOIN R_info r ON g.last_count = r.game_info_id
    LEFT JOIN hit_single_id_info h ON r.rst_id = h.rst_id
    LEFT JOIN player pb ON g.batter = pb.id
    WHERE
        h.rst_id IS NOT NULL 
	group by pb.name, pb.team
    order by average DESC
--             AND r.direction NOT IN (7 , 8, 9)
--             AND r.ps_col_2 NOT IN (7, 8, 9)
            -- AND pb.name = '西川' and pb.team = 'F'
            -- AND pb.name = '源田' and pb.team = 'L'
            -- AND pb.name = '牧原' and pb.team = 'H'
            -- AND pb.name = '金子侑' and pb.team = 'L'
            -- AND pb.name = '中島卓也' and pb.team = 'F'
            -- AND pb.name = '大田' and pb.team = 'F'
            -- AND pb.name = '茂木' and pb.team = 'E'
-- ) AS A
--         LEFT JOIN
--     team_info t ON t.team_initial = A.team
-- WHERE
--     t.league = 'C'
-- GROUP BY name , team
-- ORDER BY hit_cnt DESC
;