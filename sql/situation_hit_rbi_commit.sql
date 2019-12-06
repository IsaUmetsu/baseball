-- /*
-- CREATE TABLE situation_hit_rbi_commit 
SELECT 
    *
FROM
    (SELECT 
        *
    FROM
        situation_scoring_commit UNION SELECT 
        *
    FROM
        baseball.situation_base_commit sbc
    WHERE
        sbc.on_all_base = '100') AS A
ORDER BY g_id;
-- */
