-- SELECT 
--     pitcher, ball_type, AVG(speed) AS `avg`, MAX(speed) AS `max`
-- FROM
--     (
-- create table _pitched_ball
-- insert into _pitched_ball (`pitcher`, `date`, `V`, `H`, `ining`, `top_bottom`, `batter`, `batter_cnt`, `batter_pitch_count`, `ball_type_id`, `ball_type`, `col_2`, `col_3`, `col_4`, `col_5`, `speed`, `rst_id`, `result`, `col_9`, `total_batter_count`, `R_rst_id`, `R_result`)
SELECT
    g.pitcher,
    oo.`date`,
    oo.`visitor_team` AS V,
    oo.`home_team` AS H,
    g.`ining`,
    g.`top_bottom`,
    g.`batter`,
    g.`batter_cnt`,
    p.`batter_pitch_count`,
    p.`ball_type_id`,
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
    ng.remarks IS NULL --             AND pp.name = '山本'
    --             AND pp.team = 'B'
    --             ) AS A
    -- WHERE
    --     R_rst_id > 0
    -- GROUP BY pitcher, ball_type
;