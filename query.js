"use strict"

const query = module.exports = {}

/**
 * 選手起用に変更があるか判定
 */
query.checkPlayerChange = (order_overview_id, now_pitch_count, top_bottom) => `
  SELECT
  *
  FROM
  (
    -- 選手交代前の前
  SELECT
    *
  FROM
  (
    (
            SELECT
                pitch_count AS before_pitch_count,
                batting_order AS before_batting_order,
                player AS before_player,
                pos AS before_pos,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count - 1} AND top_bottom = ${top_bottom}
        ) AS A
        LEFT OUTER JOIN
            (
                SELECT
                    pitch_count AS after_pitch_count,
                    batting_order AS after_batting_order,
                    player AS after_player,
                    pos AS after_pos,
                    profile_number AS after_profile_number,
                    player_name AS after_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count} AND top_bottom = ${top_bottom}
            ) AS B
        ON  A.before_player = B.after_player AND
            A.before_pos = B.after_pos
  )
  UNION
    -- 選手交代前の後
  SELECT
    *
  FROM
  (
    (
            SELECT
                pitch_count AS before_pitch_count,
                batting_order AS before_batting_order,
                player AS before_player,
                pos AS before_pos,
                profile_number AS before_profile_number,
                player_name AS before_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count - 1} AND top_bottom = ${top_bottom}
        ) AS A
        RIGHT OUTER JOIN
    (
            SELECT
                pitch_count AS after_pitch_count,
                batting_order AS after_batting_order,
                player AS after_player,
                pos AS after_pos,
                profile_number AS after_profile_number,
                player_name AS after_player_name
            FROM
                baseball.order_detail
            WHERE
                order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count} AND top_bottom = ${top_bottom}
        ) AS B
        ON  A.before_player = B.after_player AND
            A.before_pos = B.after_pos
  )
  ) AS C
  WHERE
  before_batting_order IS NULL OR
    after_player IS NULL
`

/**
 * 選手変更時の試合情報（イニング、カウント、ランナー状況）取得
 */
query.getGameInfoWhenChange = (order_overview_id, before_pitch_count, after_pitch_count) => `
    SELECT
        g.ining,
        g.top_bottom,
        g.strike,
        g.ball,
        g.out,
        p1.name AS runner_1b,
        p2.name AS runner_2b,
        p3.name AS runner_3b
    FROM
        baseball.game_info AS g
    LEFT JOIN baseball.player p1 ON g.runner_1b = p1.id
    LEFT JOIN baseball.player p2 ON g.runner_2b = p2.id
    LEFT JOIN baseball.player p3 ON g.runner_3b = p3.id
    WHERE g.order_overview_id = ${order_overview_id} AND g.pitch_count IN (${before_pitch_count}, ${after_pitch_count})
`