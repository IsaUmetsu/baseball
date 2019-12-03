-- create table _tmp_strikeout_info
SELECT
    *
FROM
    (
        SELECT
            g.pitcher,
            g.`batter`,
            --         oo.`date`,
            --             oo.`visitor_team` AS V,
            --             oo.`home_team` AS H,
            g.`ining`,
            g.`top_bottom`,
            g.`batter_cnt`,
            p.`batter_pitch_count`,
            p.ball_type_id,
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
            LEFT JOIN no_game_info ng ON g.order_overview_id = ng.order_overview_id
            LEFT JOIN ball_type b ON p.ball_type_id = b.id
            LEFT JOIN order_overview oo ON g.order_overview_id = oo.id
        WHERE
            ng.remarks IS NULL -- AND pp.name = '山本' AND pp.team = 'B'
    ) AS A
WHERE
    is_commit = 1
    AND R_rst_id > 0
    AND rst_id IN (16, 17, 28);