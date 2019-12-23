-- create table post_season_info 

SELECT 
    id AS oo_id, date, visitor_team, home_team, game_no
FROM
    baseball.order_overview
where date > 20190930
;