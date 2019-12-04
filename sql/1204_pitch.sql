select * from (
SELECT 
    -- g.`game_info_id`,
    oo.`date`,
    oo.`visitor_team` as V,
    oo.`home_team` as H,
    -- g.`order_overview_id`,
    g.`ining`,
    g.`top_bottom`,
    -- g.`pitcher`,
    g.`batter`,
    g.aft_o,
    -- p.`id`,
    -- p.`game_info_id`,
    -- p.`order_overview_id`,
    p.`batter_pitch_count`,
    b.ball_type,
    -- p.`ball_type_id`,
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
    r.rst_id as R_rst_id,
    r.result as R_result
FROM
    baseball.game_info g
left join pitch_info p on g.id = p.game_info_id
left join R_info r on g.id = r.game_info_id
left join player pp on g.pitcher = pp.id
left join no_game_info ng on g.order_overview_id = ng.order_overview_id
left join ball_type b on p.ball_type_id = b.id
left join order_overview oo on g.order_overview_id = oo.id
where pp.name = '山本' and pp.team = 'B' and ng.remarks is null
) AS A
where
-- is_commit = 1 and rst_id in (16, 17, 28) and
R_rst_id > 0 and date = '20190403'
;