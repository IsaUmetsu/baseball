SELECT
    name,
    team,
    COUNT(name) AS batting_cnt
FROM
    (
        SELECT
            date,
            location,
            s.name,
            team,
            ining,
            top_bottom,
            MAX(bp_count) AS bp_count,
            t_total,
            b_total
        FROM
            -- baseball._situation_douten_all s
            baseball._situation_gyakuten_all s
            LEFT JOIN baseball.exclude_batting_info eb ON s.result = eb.name
        WHERE
            eb.name IS NULL
        GROUP BY
            date,
            location,
            name,
            team,
            ining,
            top_bottom,
            t_total,
            b_total
    ) AS A
GROUP BY
    name,
    team
order by batting_cnt DESC
;