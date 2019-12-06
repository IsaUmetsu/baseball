CREATE TABLE game_info_id_double_playes_run
SELECT id FROM (
SELECT 
    g.id
    ,g.pitcher
    ,g.batter
    ,g.`out`,
    g.aft_o,
    g.runner_1b,
    g.next_1b_go,
    g.runner_2b,
    g.next_2b_go,
    g.runner_3b,
    g.next_3b_go,
    r.rst_id,
    r.result,
    r.ball_flow
FROM
    baseball.game_info g
LEFT JOIN R_info r ON g.id = r.game_info_id
LEFT JOIN TR_info tr ON g.id = tr.game_info_id
WHERE
    aft_o - `out` = 2
    AND next_3b_go = 4
    AND rst_id = 11) AS A;