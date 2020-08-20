SELECT
    era.id,
    p.name,
    p.team,
    era.inning,
    era.outs,
    era.runs,
    era.era,
    'e' AS eol
FROM
    (
        SELECT
            pitcher AS id,
            SUM(outs) DIV 3 AS inning,
            SUM(outs) % 3 AS outs,
            SUM(runs) AS runs,
            ROUND(SUM(runs) * 9 * 3 / SUM(outs), 5) AS era,
            'e' AS eol
        FROM
            (
                SELECT
                    o.*,
                    CASE
                        WHEN loss.runs THEN loss.runs
                        ELSE 0
                    END AS runs
                FROM
                    baseball._on_mound_outs o
                    LEFT JOIN no_game_info ng ON ng.order_overview_id = o.order_overview_id
                    LEFT JOIN (
                        SELECT
                            oo_id,
                            top_bottom,
                            pitcher,
                            COUNT(pitcher) AS runs
                        FROM
                            baseball.runner_drive_info
                        WHERE
                            rst_id != 10
                            AND gid_at_home IS NOT NULL
                        GROUP BY
                            oo_id,
                            pitcher,
                            top_bottom
                    ) AS loss ON o.order_overview_id = loss.oo_id
                    AND o.top_bottom = loss.top_bottom
                    AND o.pitcher = loss.pitcher
                    WHERE ng.remarks IS NULL
            ) AS A
        GROUP BY
            pitcher
    ) AS era
    LEFT JOIN player p ON era.id = p.id;
