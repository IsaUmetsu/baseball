CREATE TABLE _max_pitch_count_per_game
SELECT
    order_overview_id,
    MAX(pitch_count) AS max_pitch_count
FROM
    baseball.order_detail
GROUP BY
    order_overview_id;