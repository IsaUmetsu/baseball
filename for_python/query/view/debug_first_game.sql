create view `debug_first_game` AS
SELECT 
    ss_t.game_info_id,
    CASE
        WHEN
            ss_t.ing1 > 0
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 = 0
                AND ss_b.ing8 = 0
                AND ss_t.ing9 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 = 0
                AND ss_b.ing8 = 0
                AND ss_t.ing9 = 0
                AND ss_b.ing9 = 0
                AND ss_t.ing10 > 0)
        THEN
            ss_t.b_team
        WHEN
            (ss_t.ing1 = 0 AND ss_b.ing1 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 = 0
                AND ss_b.ing8 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 = 0
                AND ss_b.ing8 = 0
                AND ss_t.ing9 = 0
                AND ss_b.ing9 > 0)
                OR (ss_t.ing1 = 0 AND ss_b.ing1 = 0
                AND ss_t.ing2 = 0
                AND ss_b.ing2 = 0
                AND ss_t.ing3 = 0
                AND ss_b.ing3 = 0
                AND ss_t.ing4 = 0
                AND ss_b.ing4 = 0
                AND ss_t.ing5 = 0
                AND ss_b.ing5 = 0
                AND ss_t.ing6 = 0
                AND ss_b.ing6 = 0
                AND ss_t.ing7 = 0
                AND ss_b.ing7 = 0
                AND ss_t.ing8 = 0
                AND ss_b.ing8 = 0
                AND ss_t.ing9 = 0
                AND ss_b.ing9 = 0
                AND ss_t.ing10 = 0
                AND REPLACE(ss_b.ing10, 'X', '') > 0)
        THEN
            ss_b.b_team
    END AS team
FROM
    baseball_2020.stats_scoreboard ss_t
        LEFT JOIN
    baseball_2020.stats_scoreboard ss_b ON ss_t.game_info_id = ss_b.game_info_id
        AND ss_t.id = ss_b.id - 1
WHERE
    ss_b.id IS NOT NULL;