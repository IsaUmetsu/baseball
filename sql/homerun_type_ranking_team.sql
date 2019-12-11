SELECT
    CASE
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) = 0
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        ) = 0 THEN '先制'
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) > IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        )
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) > (
            SELECT
                cast(total as signed)
            FROM
                game_score_info
            WHERE
                game_info_id = g.id + 1
                AND top_bottom = g.top_bottom
        ) THEN '追い上げ'
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) > IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        )
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) = (
            SELECT
                cast(total as signed)
            FROM
                game_score_info
            WHERE
                game_info_id = g.id + 1
                AND top_bottom = g.top_bottom
        ) THEN '同点'
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) > IFNULL(
            (
                SELECT
                    cast(total as signed) l
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        )
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) < (
            SELECT
                cast(total as signed)
            FROM
                game_score_info
            WHERE
                game_info_id = g.id + 1
                AND top_bottom = g.top_bottom
        ) THEN '逆転'
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) = IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        )
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) < (
            SELECT
                cast(total as signed)
            FROM
                game_score_info
            WHERE
                game_info_id = g.id + 1
                AND top_bottom = g.top_bottom
        ) THEN '勝ち越し'
        WHEN IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) < IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id
                    AND top_bottom = g.top_bottom
            ),
            0
        )
        AND IFNULL(
            (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = CASE
                        WHEN g.top_bottom = 1 THEN 2
                        WHEN g.top_bottom = 2 THEN 1
                        ELSE 0
                    END
            ),
            0
        ) < (
            SELECT
                cast(total as signed)
            FROM
                game_score_info
            WHERE
                game_info_id = g.id + 1
                AND top_bottom = g.top_bottom
        ) THEN '追加点'
        ELSE 'サヨナラ'
    END AS homerun_type,
    pb.team,
    count(
        CASE
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) = 0
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            ) = 0 THEN '先制'
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) > IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            )
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) > (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = g.top_bottom
            ) THEN '追い上げ'
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) > IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            )
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) = (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = g.top_bottom
            ) THEN '同点'
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) > IFNULL(
                (
                    SELECT
                        cast(total as signed) l
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            )
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) < (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = g.top_bottom
            ) THEN '逆転'
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) = IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            )
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) < (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = g.top_bottom
            ) THEN '勝ち越し'
            WHEN IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) < IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id
                        AND top_bottom = g.top_bottom
                ),
                0
            )
            AND IFNULL(
                (
                    SELECT
                        cast(total as signed)
                    FROM
                        game_score_info
                    WHERE
                        game_info_id = g.id + 1
                        AND top_bottom = CASE
                            WHEN g.top_bottom = 1 THEN 2
                            WHEN g.top_bottom = 2 THEN 1
                            ELSE 0
                        END
                ),
                0
            ) < (
                SELECT
                    cast(total as signed)
                FROM
                    game_score_info
                WHERE
                    game_info_id = g.id + 1
                    AND top_bottom = g.top_bottom
            ) THEN '追加点'
            ELSE 'サヨナラ'
        END
    ) as homerun_type_count
FROM
    baseball.game_info g
    LEFT JOIN baseball.player pp ON g.pitcher = pp.id
    LEFT JOIN baseball.player pb ON g.batter = pb.id
    LEFT JOIN baseball.player pr1b ON g.runner_1b = pr1b.id
    LEFT JOIN baseball.player pr2b ON g.runner_2b = pr2b.id
    LEFT JOIN baseball.player pr3b ON g.runner_3b = pr3b.id
    LEFT JOIN baseball.pitch_info pi ON g.id = pi.game_info_id
    LEFT JOIN order_overview oo ON g.order_overview_id = oo.id --         LEFT JOIN
    --     game_score_info gs ON g.id = gs.game_info_id and g.top_bottom = gs.top_bottom
WHERE
    -- pb.name = 'デスパイネ' AND
    pi.result = '本塁打'
group by
    homerun_type,
    pb.team
order by
    homerun_type desc,
    homerun_type_count desc,
    team desc