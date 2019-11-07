
select
	oo.id,
    oo.date,
    oo.visitor_team,
    oo.home_team,
    oo.game_no,
    g.pitch_count,
    g.location,
    g.ining
from game_info g
left join no_game_info ng on ng.order_overview_id = g.order_overview_id
left join order_overview oo on g.order_overview_id = oo.id
where (g.order_overview_id, g.pitch_count) IN (
SELECT order_overview_id, MAX(pitch_count) as pitch_count FROM baseball.game_info
group by order_overview_id
)
-- and ng.remarks is NULL -- ノーゲームリストに含まれていない
and ining < 9
-- */
-- where order_overview_id = 42;