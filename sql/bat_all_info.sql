SELECT 
    order_overview_id, ining, top_bottom, batter
FROM
    baseball.game_info
GROUP BY batter , order_overview_id , ining , top_bottom
ORDER BY order_overview_id , batter , ining , top_bottom
;