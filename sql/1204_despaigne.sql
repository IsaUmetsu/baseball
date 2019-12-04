SELECT 
--     g.`id`,
--     g.`order_overview_id`,
    -- g.`pitch_count`,
    oo.`date` as 日付,
    oo.visitor_team as 先攻,
    oo.home_team as 後攻,
    g.`location` as 球場,
    concat(g.`ining`, '回', case g.`top_bottom` when 1 then '表' when 2 then '裏' end) as イニング,
--     g.`ining`,
--     g.`top_bottom`,
    pp.`name` as 投手,
    -- g.`pitcher`,
    -- g.`p_LR`,
    -- g.`unkcol_5`,
    -- g.`batter`,
    pb.`name` as 打者,
    -- g.`b_LR`,
    g.`ball` as B,
    g.`strike` as S,
    g.`out` as O,
--     g.`aft_s`,
--     g.`aft_b`,
--     g.`aft_o`,
--     g.`on_all_base`,
--     g.`runner_1b`,
--     g.`next_1b_go`,
--     g.`runner_2b`,
--     g.`next_2b_go`,
--     g.`runner_3b`,
--     g.`next_3b_go`,
--     g.`unkcol_21`,
--     g.`game_datetime`,
    -- r.`is_commit`,
    -- r.`rst_id`,
    r.`result` as 結果,
	case round((select (CHAR_LENGTH(g.`on_all_base`) - CHAR_LENGTH(replace(g.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) when 1 then '2ラン' when 2 then '3ラン' when 3 then '満塁' else 'ソロ' end as '種別',
    r.direction as 打球,
    d.direction as 打球方向
--     ,r.`col_5`,
--     r.`col_6`,
--     r.`pickoff_base`,
--     r.`pickoff`,
--     r.`ball_flow`,
--     r.`s_col_1`,
--     r.`s_col_2`,
--     r.`s_col_3`,
--     r.`s_col_4`,
--     r.`s_col_5`,
--     r.`o_col_1`,
--     r.`o_col_2`,
--     r.`o_col_3`,
--     r.`o_col_4`,
--     r.`o_col_5`,
--     r.`ps_col_1`,
--     r.`ps_col_2`,
--     r.`ps_col_3`,
--     r.`ps_col_4`,
--     r.`ps_col_5`,
--     tr.`col_1`,
--     tr.`col_2`,
--     tr.`col_3`,
--     tr.`col_4`,
--     tr.`col_5`,
--     tr.`col_6`,
--     p.`id`,
--     p.`game_info_id`,
--     p.`order_overview_id`,
--     p.`batter_pitch_count`,
--     p.`ball_type_id`,
--     p.`col_2`,
--     p.`col_3`,
--     p.`col_4`,
--     p.`col_5`,
--     p.`speed`,
--     p.`rst_id`,
--     p.`result`,
--     p.`col_9`,
--     p.`total_batter_count`
FROM
    baseball.game_info g
        LEFT JOIN R_info r ON g.id = r.game_info_id
        LEFT JOIN
    TR_info tr ON g.id = tr.game_info_id
        LEFT JOIN
    pitch_info p ON g.id = p.game_info_id
        LEFT JOIN
    no_game_info ng ON g.order_overview_id = ng.order_overview_id
    left join exclude_batting_info eb on r.result = eb.name
    left join hit_id_info hit on r.rst_id = hit.rst_id
    left join player pp on g.pitcher = pp.id
    left join player pb on g.batter = pb.id
    left join order_overview oo on g.order_overview_id = oo.id
    left join direction_info d on r.`direction` = d.id
WHERE
--     g.id BETWEEN 924 AND 926
--         OR g.id BETWEEN 258103 AND 258105
--         OR g.id BETWEEN 250023 AND 250025
--         OR g.id BETWEEN 223749 AND 223751
    ng.remarks IS NULL
        AND r.is_commit = 1
        AND eb.name is null
        and r.rst_id = 9
        and g.ining = 1
        and pb.name = 'デスパイネ'
order by g.order_overview_id
--         AND r.rst_id IN (2 , 3, 4)

--         AND r.rst_id IN (19)
--         AND r.s_col_1 = 820
;


