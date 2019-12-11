SELECT 
    MAX(id), team, SUM(hr_oen + hr_two) AS hr, SUM(bat_oen + bat_two) AS bat
FROM
    baseball.result_per_inning_base
group by team