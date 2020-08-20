-- CREATE TABLE homein_runner_batter 

SELECT
    pb.id,
    p.name,
    p.team,
    on1b.bat AS bat_on1b,
    on1b.homein AS homein_on1b,
    ROUND(on1b.homein / on1b.bat, 5) AS ave_1b,
    on2b.bat AS bat_on2b,
    on2b.homein AS homein_on2b,
    ROUND(on2b.homein / on2b.bat, 5) AS ave_2b,
    on3b.bat AS bat_on3b,
    on3b.homein AS homein_on3b,
    ROUND(on3b.homein / on3b.bat, 5) AS ave_3b,
    'e' AS eol
FROM
    _player_batter pb
    LEFT JOIN player p ON pb.id = p.id
    LEFT JOIN (
        SELECT
            batter,
            COUNT(batter) AS bat,
            COUNT(
                next_1b_go = 4
                OR NULL
            ) AS homein
        FROM
            baseball.situation_base_commit
        WHERE
            runner_1b != ''
        GROUP BY
            batter
    ) AS on1b ON pb.id = on1b.batter
    LEFT JOIN (
        SELECT
            batter,
            COUNT(batter) AS bat,
            COUNT(
                next_2b_go = 4
                OR NULL
            ) AS homein
        FROM
            baseball.situation_base_commit
        WHERE
            runner_2b != ''
        GROUP BY
            batter
    ) AS on2b ON pb.id = on2b.batter
    LEFT JOIN (
        SELECT
            batter,
            COUNT(batter) AS bat,
            COUNT(
                next_3b_go = 4
                OR NULL
            ) AS homein
        FROM
            baseball.situation_base_commit
        WHERE
            runner_3b != ''
        GROUP BY
            batter
    ) AS on3b ON pb.id = on3b.batter
    LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter
WHERE
    br.batter IS NOT NULL;