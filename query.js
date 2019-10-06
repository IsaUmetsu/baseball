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
        pp.name AS pitcher,
        pp.profile_number AS p_pn,
        pb.name AS batter,
        pb.profile_number AS b_pn,
        g.strike,
        g.ball,
        g.out,
        p1.name AS runner_1b,
        p1.profile_number AS runner_1b_pn,
        p2.name AS runner_2b,
        p2.profile_number AS runner_2b_pn,
        p3.name AS runner_3b,
        p3.profile_number AS runner_3b_pn
    FROM
        baseball.game_info AS g
    LEFT JOIN baseball.player p1 ON g.runner_1b = p1.id
    LEFT JOIN baseball.player p2 ON g.runner_2b = p2.id
    LEFT JOIN baseball.player p3 ON g.runner_3b = p3.id
    LEFT JOIN baseball.player pp ON g.pitcher = pp.id
    LEFT JOIN baseball.player pb ON g.batter = pb.id
    WHERE g.order_overview_id = ${order_overview_id} AND g.pitch_count IN (${before_pitch_count}, ${after_pitch_count})
`

/**
 * 打順ごとのスタメン回数取得
 */
query.getStartingMenberSpecifyOrder = (team, order, idsTop, idsBtm) => `
    SELECT 
        count(player_name) as count,
        player_name
    FROM
        baseball.order_detail
    where
        ((
            order_overview_id in (
                ${idsTop}
                -- SELECT 
                --     id
                -- FROM
                --     baseball.order_overview
                -- where
                --     visitor_team = '${team}'
            ) and top_bottom = 1
        ) or (
            order_overview_id in (
                ${idsBtm}
                -- SELECT 
                --     id
                -- FROM
                --     baseball.order_overview
                -- where
                --     home_team = '${team}'
            ) and top_bottom = 2
        ))
        and pitch_count = 1
        and batting_order = ${order}
    group by player_name
    order by count desc
`

query.getOverviewIds = (team, top_bottom) => `
    SELECT 
        id
    FROM
        baseball.order_overview
    where
        ${top_bottom == 1 ? 'visitor_team' : top_bottom == 2 ? 'home_team' : ''} = '${team}'
`

/**
 * フル出場取得
 */
query.getFullParticipation = (idsTop, idsBtm, order) => `
    SELECT
        C.player_name,
        count(C.player_name) as count
    FROM (
        ${getFullParticipationBySide(1, order, idsTop)}
        union
        ${getFullParticipationBySide(2, order, idsBtm)}
    ) AS C
    group by
        C.player_name
    order by
        count desc
`

const getFullParticipationBySide = (top_bottom, order, ids) => `
    SELECT
        order_overview_id,
        player_name 
    FROM
        baseball.order_detail 
    WHERE
        pitch_count = 1 
    AND batting_order = ${order} 
    AND top_bottom = ${top_bottom}
        AND order_overview_id IN 
        (
            SELECT
                B.order_overview_id 
            FROM
                (
                    SELECT
                        A.order_overview_id,
                        Count(A.order_overview_id) AS count 
                    FROM
                    (
                        SELECT
                            order_overview_id,
                            top_bottom,
                            batting_order,
                            Max(pitch_count) AS max_pitch_count,
                            player_name 
                        FROM
                            baseball.order_detail 
                        WHERE
                            order_overview_id IN (${ids})
                            AND top_bottom = ${top_bottom} 
                            AND batting_order = ${order} 
                        GROUP BY
                            order_overview_id,
                            top_bottom,
                            batting_order,
                            player_name 
                        ORDER BY
                            order_overview_id,
                            top_bottom,
                            max_pitch_count
                    ) AS A 
                    GROUP BY
                    A.order_overview_id 
                    ORDER BY
                    count
                )
                AS B 
            WHERE
                B.count = 1
        )
`