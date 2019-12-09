-- CREATE TABLE batter_reaching_regulation 
SELECT  batter
    -- , name, team, pa
FROM baseball.average_hit WHERE pa >= 443;