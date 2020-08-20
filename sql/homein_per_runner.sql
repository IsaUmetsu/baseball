create table homein_per_runner 

SELECT
    p.id,
    p.name,
    p.team,
    COUNT(rd.batter) AS onbase,
    COUNT(
        gid_at_home IS NOT NULL
        OR NULL
    ) AS homein,
    ROUND(
        COUNT(
            gid_at_home IS NOT NULL
            OR NULL
        ) / COUNT(rd.batter),
        5
    ) AS ave,
    'e' AS eol
FROM
    player p
    LEFT JOIN baseball.runner_drive_info rd ON rd.batter = p.id
    LEFT JOIN batter_reaching_regulation br ON br.batter = rd.batter
WHERE
    rst_id IN (2, 3, 4, 5, 6, 8, 10, 19, 28)
    AND pinch_run IS NULL
    AND br.batter IS NOT NULL
GROUP BY
    rd.batter;