SELECT 
    b_id, CONCAT(so_cnt, '個 ', batter) AS result, sb.cnt as total_cnt, round(so_cnt / sb.cnt, 3) as percent
FROM
    (

    SELECT 
        b_id, batter, COUNT(batter) AS so_cnt
    FROM
        (SELECT 
        oo.`date`,
            oo.`visitor_team` AS V,
            oo.`home_team` AS H,
            g.`ining`,
            g.`top_bottom`,
            g.batter as b_id,
            CONCAT(pb.name, '(', pb.team, ')') AS batter,
            g.`batter_cnt`,
            p.`batter_pitch_count`,
            b.ball_type,
            p.`col_2`,
            p.`col_3`,
            p.`col_4`,
            p.`col_5`,
            p.`speed`,
            p.`rst_id`,
            p.`result`,
            p.`col_9`,
            p.`total_batter_count`,
            r.is_commit,
            r.rst_id AS R_rst_id,
            r.result AS R_result
    FROM
        baseball._game_info_specific g
    LEFT JOIN pitch_info p ON g.game_info_id = p.game_info_id
    LEFT JOIN R_info r ON g.game_info_id = r.game_info_id
    LEFT JOIN player pp ON g.pitcher = pp.id
    LEFT JOIN player pb ON g.batter = pb.id
    LEFT JOIN no_game_info ng ON g.order_overview_id = ng.order_overview_id
    LEFT JOIN ball_type b ON p.ball_type_id = b.id
    LEFT JOIN order_overview oo ON g.order_overview_id = oo.id
    WHERE
        pp.name = '山本' AND pp.team = 'B'
            AND ng.remarks IS NULL) AS A
    WHERE
        R_rst_id > 0 AND rst_id IN (16 , 17, 28)
            AND is_commit = 1
    GROUP BY b_id, batter
    ORDER BY so_cnt DESC

    ) AS A
left join _strikeout_batter sb on A.b_id = sb.id
order by so_cnt DESC, percent 
LIMIT 15
;