-- /*
UPDATE player,
    (SELECT DISTINCT
        od.player,
            od.player_name,
            CASE od.top_bottom
                WHEN 1 THEN oo.visitor_team
                WHEN 2 THEN oo.home_team
            END AS team
    FROM
        baseball.order_detail od
    LEFT JOIN no_game_info ng ON od.order_overview_id = ng.order_overview_id
    LEFT JOIN order_overview oo ON od.order_overview_id = oo.id
    WHERE
        ng.order_overview_id IS NULL
            AND player IN (SELECT 
                id
            FROM
                baseball.player
            WHERE
                team IN ('WL' , 'EL'))) fo_player 
SET 
    player.team = fo_player.team
WHERE
    player.id = fo_player.player;
-- */