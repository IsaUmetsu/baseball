create table _inning_score_loss_info

        SELECT
            oo.visitor_team AS team,
            s.order_overview_id,
            s.ining,
            CASE
                top_bottom
                WHEN 1 THEN score
                WHEN 2 THEN 0
            END AS score,
            CASE
                top_bottom
                WHEN 2 THEN score
                WHEN 1 THEN 0
            END AS loss,
            'e' AS eol
        FROM
            baseball._inning_score_info s
            LEFT JOIN order_overview oo ON oo.id = s.order_overview_id
        UNION
        SELECT
            oo.home_team AS team,
            s.order_overview_id,
            s.ining,
            CASE
                top_bottom
                WHEN 1 THEN 0
                WHEN 2 THEN score
            END AS score,
            CASE
                top_bottom
                WHEN 2 THEN 0
                WHEN 1 THEN score
            END AS loss,
            'e' AS eol
        FROM
            baseball._inning_score_info s
            LEFT JOIN order_overview oo ON oo.id = s.order_overview_id