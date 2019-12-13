-- CREATE TABLE _onbase_combi_all 
-- insert into _onbase_combi_all (`g_id`,`order_overview_id`,`ining`,`top_bottom`,`on_all_base`, `runner_1b`,`runner_2b`,`runner_3b`,`next_1b_go`,`next_2b_go`,`next_3b_go`,`bat_cnt`)

SELECT
    A.*
FROM
    (
        SELECT
            MAX(g_id) AS g_id,
            oo_id AS order_overview_id,
            ining,
            top_bottom,
            on_all_base,
            runner_1b,
            runner_2b,
            runner_3b,
            MAX(next_1b_go) AS next_1b_go,
            MAX(next_2b_go) AS next_2b_go,
            MAX(next_3b_go) AS next_3b_go,
            MAX(bat_cnt) AS bat_cnt
        FROM
            baseball._situation_base
        GROUP BY
            ining,
            top_bottom,
            runner_1b,
            runner_2b,
            runner_3b,
            on_all_base,
            order_overview_id
        ORDER BY
            g_id
    ) AS A
WHERE
    runner_1b != ''
    OR runner_2b != ''
    OR runner_3b != ''
;
