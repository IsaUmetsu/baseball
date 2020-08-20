-- create table _order_detail_diff 
-- insert into _order_detail_diff (`oo_id`,`top_bottom`,`team`,`pitch_count`,`batting_order`,`pos`,`player`,`profile_number`,`player_name`,`prv_pos`,`prv_player`,`prv_prf_nmb`,`prv_player_name`,`same`)

SELECT
    -- l.id,
    l.oo_id,
    l.top_bottom,
    l.team,
    l.pitch_count,
    l.batting_order,
    l.pos,
    l.player,
    l.profile_number,
    l.name,
    r.pos AS prv_pos,
    r.player AS prv_player,
    r.profile_number AS prv_prf_nmb,
    r.name AS prv_name,
    CASE
        WHEN l.player = r.player AND l.pos = r.pos THEN 1
        ELSE 2
    END AS same
FROM
    (
        SELECT
            `order_overview_id` AS oo_id,
            `top_bottom`,
            `pitch_count`,
            `batting_order`,
            `player`,
            `pos`,
            od.`profile_number`,
            `player_name` AS name,
            p.team,
            pitch_count - 1 AS prv_ptc_cnt
        FROM
            baseball.order_detail od
            LEFT JOIN player p ON p.id = od.player
    ) AS l
    LEFT JOIN (
        SELECT
            `order_overview_id` AS oo_id,
            `top_bottom`,
            `pitch_count`,
            `batting_order`,
            `player`,
            `pos`,
            `profile_number`,
            `player_name` AS name,
            pitch_count - 1 AS prv_ptc_cnt
        FROM
            baseball.order_detail
    ) AS r ON l.oo_id = r.oo_id
    AND l.top_bottom = r.top_bottom
    AND l.batting_order = r.batting_order
    AND l.prv_ptc_cnt = r.pitch_count
    LEFT JOIN no_game_info ng ON ng.order_overview_id = l.oo_id
WHERE
    r.oo_id IS NOT NULL
    AND ng.remarks IS NULL
;