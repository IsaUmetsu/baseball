SELECT
    gs1.order_overview_id,
    gs1.game_info_id,
    gs1.total as t_total,
    gs2.total as b_total
FROM
    baseball.game_score_info gs1
    LEFT JOIN baseball.game_score_info gs2 ON gs1.order_overview_id = gs2.order_overview_id
    AND gs1.game_info_id = gs2.game_info_id
    AND gs1.top_bottom = gs2.top_bottom - 1
WHERE
    gs1.top_bottom = 1;