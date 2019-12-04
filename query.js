"use strict";

const query = (module.exports = {});

/**
 * 選手起用に変更があるか判定
 */
query.judgePlayerChange = (order_overview_id, now_pitch_count, top_bottom) => `
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
              order_overview_id = ${order_overview_id}
              AND pitch_count = ${now_pitch_count - 1}
              AND top_bottom = ${top_bottom}
          ) AS A
          LEFT OUTER JOIN (
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
              order_overview_id = ${order_overview_id}
              AND pitch_count = ${now_pitch_count}
              AND top_bottom = ${top_bottom}
          ) AS B ON A.before_player = B.after_player
          AND A.before_pos = B.after_pos
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
              order_overview_id = ${order_overview_id}
              AND pitch_count = ${now_pitch_count - 1}
              AND top_bottom = ${top_bottom}
          ) AS A
          RIGHT OUTER JOIN (
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
              order_overview_id = ${order_overview_id}
              AND pitch_count = ${now_pitch_count}
              AND top_bottom = ${top_bottom}
          ) AS B ON A.before_player = B.after_player
          AND A.before_pos = B.after_pos
        )
    ) AS C
  WHERE
    before_batting_order IS NULL
    OR after_player IS NULL
`;

/**
 * 選手変更時の試合情報（イニング、カウント、ランナー状況）取得
 */
query.getGameInfoWhenChange = (
  order_overview_id,
  before_pitch_count,
  after_pitch_count
) => `
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
  WHERE
    g.order_overview_id = ${order_overview_id}
    AND g.pitch_count IN (${before_pitch_count}, ${after_pitch_count})
`;

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
    (
      (
        order_overview_id in (
          ${idsTop} -- SELECT 
          --     id
          -- FROM
          --     baseball.order_overview
          -- where
          --     visitor_team = '${team}'
        )
        and top_bottom = 1
      )
      or (
        order_overview_id in (
          ${idsBtm} -- SELECT 
          --     id
          -- FROM
          --     baseball.order_overview
          -- where
          --     home_team = '${team}'
        )
        and top_bottom = 2
      )
    )
    and pitch_count = 1
    and batting_order = ${order}
  group by
    player_name
  order by
    count desc
`;

query.getOverviewIds = (team, top_bottom) => `
    SELECT 
        id
    FROM
        baseball.order_overview
    where
        ${
          top_bottom == 1 ? "visitor_team" : top_bottom == 2 ? "home_team" : ""
        } = '${team}'
`;

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
`;

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
    AND order_overview_id IN (
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
        ) AS B
      WHERE
        B.count = 1
    )
`;

/**
 * 選手別ホームランタイプ取得（通算本塁打数比較）
 * @param {string} situation
 * @param {boolean} is_devide 本数単位でツイート分割するか
 */
query.homerunTypeRankBatter = (situation, is_devide) => `
  SELECT 
    h.id, h.name, h.team, h.${situation}_hr AS hr, h.total_hr AS total, h.${situation}_ttl_pct AS pct, rank.rank
  FROM
    baseball.homerun_situation_batter h
      LEFT JOIN
        (SELECT 
          id, score, rank
        FROM 
          (SELECT 
            score, ${is_devide ? ``: `percent, `}@rank AS rank, cnt, @rank:=@rank + cnt
          FROM
            (SELECT @rank:=1) AS Dummy,
            (SELECT 
              ${situation}_hr AS score, ${is_devide ? ``: `${situation}_ttl_pct AS percent, `}COUNT(*) AS cnt
            FROM
              (SELECT 
                *
              FROM
                homerun_situation_batter
              WHERE
                ${situation}_hr > 0
              ) AS htb
            GROUP BY score ${is_devide ? ``: `, percent`}
            ORDER BY score DESC ${is_devide ? ``: `, percent DESC`}
            ) AS GroupBy
          ) AS Ranking
        JOIN
          (SELECT 
            id, name, team, ${situation}_hr AS cnt, ${situation}_ttl_pct ${is_devide ? ``: `, ${situation}_ttl_pct AS percent`}
          FROM
            homerun_situation_batter
          WHERE
            ${situation}_hr > 0
          ) AS htb ON htb.cnt = Ranking.score ${is_devide ? ``: `AND htb.percent = Ranking.percent`}
        ORDER BY rank ASC
        ) AS rank
      ON rank.id = h.id
    WHERE
      h.${situation}_hr > 0
    ORDER BY h.${situation}_hr ${is_devide ? `ASC` : `DESC`}, h.${situation}_ttl_pct ${is_devide ? `ASC` : `DESC`};
`;

/**
 * チーム別ホームランタイプ取得（通算本塁打数比較）
 * @param {string} homerun_type
 */
query.homerunTypeRankTeam = homerun_type => `
  SELECT
    h.id, h.team, h.cnt, h.team_cnt AS total_cnt, h.percent, rank.rank, T.team_initial
  FROM
    baseball.homerun_type_team h 
  LEFT JOIN
    (SELECT
      id, score, rank 
    FROM
      (SELECT
        score, percent, @rank AS rank, cnt, @rank := @rank + cnt 
      FROM
        (SELECT @rank := 1) AS Dummy, 
        (SELECT
          cnt AS score, percent, Count(*) AS cnt 
        FROM
          (SELECT
            * 
          FROM
            homerun_type_team 
          WHERE 
            homerun_type = '${homerun_type}'
          ) AS htb 
        GROUP  BY score, percent 
        ORDER  BY score DESC, percent DESC
        ) AS GroupBy
      ) AS Ranking 
    JOIN
      (SELECT
        * 
      FROM
        homerun_type_team 
      WHERE
        homerun_type = '${homerun_type}'
      ) AS htb 
    ON htb.cnt = Ranking.score AND htb.percent = Ranking.percent 
    ORDER  BY rank ASC
  ) AS rank ON rank.id = h.id 
  LEFT JOIN team_info T ON h.team = T.team_short_name
  WHERE  h.homerun_type = '${homerun_type}' 
  ORDER  BY h.cnt DESC, h.percent DESC; 
`;

/**
 * 選手別シチュエーションHRランキング（通算打席数比較）
 * @param {string} homerun_type
 * @return {string} query
 */
query.homerunTypeRankSituationBatter = homerun_type =>
  homerunTypeRankSituation(homerun_type, "hr_type_situation_b");

/**
 * チーム別シチュエーションHRランキング（通算打席数比較）
 * @param {string} homerun_type
 * @return {string} query
 */
query.homerunTypeRankSituationTeam = homerun_type =>
  homerunTypeRankSituation(homerun_type, "hr_type_situation_t");

/**
 * シチュエーションHRランキング取得
 * @param {string} homerun_type
 * @param {string} table_name
 * @return {string} query
 */
const homerunTypeRankSituation = (homerun_type, table_name) => `
  SELECT
    hb.*,
    rank.rank,
    T.team_initial_kana AS team_kana
  FROM
    ${table_name} hb
    LEFT JOIN (
      SELECT
        id,
        score,
        rank
      FROM
        (
          SELECT
            score,
            percent,
            @rank AS rank,
            cnt,
            @rank := @rank + cnt
          FROM
            (
              SELECT
                @rank := 1
            ) AS Dummy,
            (
              SELECT
                cnt AS score,
                percent,
                Count(*) AS cnt
              FROM
                (
                  SELECT
                    *
                  FROM
                    ${table_name}
                  WHERE
                    homerun_type = '${homerun_type}'
                ) AS htb
              GROUP BY
                score,
                percent
              ORDER BY
                score DESC,
                percent DESC
            ) AS GroupBy
        ) AS Ranking
        JOIN (
          SELECT
            *
          FROM
            ${table_name}
          WHERE
            homerun_type = '${homerun_type}'
        ) AS htb ON htb.cnt = Ranking.score
        AND htb.percent = Ranking.percent
      ORDER BY
        rank ASC
    ) AS rank ON rank.id = hb.id
    LEFT JOIN team_info T ON hb.team = T.team_initial
  WHERE
    hb.homerun_type = '${homerun_type}'
  ORDER BY
    hb.cnt DESC,
    hb.percent DESC
`;

/**
 * 打席ごと打率取得
 * 
 * @param {number} targetBat 第何打席か
 * @return {string} query
 */
query.averageHitByBat = (bat, limitPA) => averageByBat(bat, limitPA, 'average_hit_horizontal')

/**
 * 打席ごと率取得
 * 
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @param {string} tableName テーブル名
 * @return {string} query
 */
const averageByBat = (bat, limitPA, tableName) => {
  const colPA = `pa${bat}`, colAB = `ab${bat}`, colCnt = `cnt${bat}`, colRate = `rate${bat}`;

  return `
    SELECT
      h.id,
      h.name,
      h.team,
      h.${colAB} AS bat_cnt,
      h.${colCnt} AS target_cnt,
      h.${colRate} AS average,
      rank.rank
    FROM
      baseball.${tableName} h
      LEFT JOIN (
        SELECT
          id,
          score,
          rank
        FROM
          (
            SELECT
              score,
              @rank AS rank,
              cnt,
              @rank := @rank + cnt
            FROM
              (
                SELECT
                  @rank := 1
              ) AS Dummy,
              (
                SELECT
                  ${colRate} AS score,
                  COUNT(*) AS cnt
                FROM
                  (
                    SELECT
                      id,
                      name,
                      team,
                      ${colAB},
                      ${colCnt},
                      ${colRate}
                    FROM
                      ${tableName}
                    WHERE
                      ${colPA} >= ${limitPA}
                  ) AS htb
                GROUP BY
                  score
                ORDER BY
                  score DESC
              ) AS GroupBy
          ) AS Ranking
          JOIN (
            SELECT
              id,
              name,
              team,
              ${colAB},
              ${colCnt},
              ${colRate}
            FROM
              ${tableName}
            WHERE
              ${colPA} >= ${limitPA}
          ) AS htb ON htb.${colRate} = Ranking.score
        ORDER BY
          rank ASC
      ) AS rank ON rank.id = h.id
    WHERE
      h.${colPA} >= ${limitPA}
    ORDER BY
      h.${colRate} DESC
  `
}

/**
 * 打席ごと出塁率取得
 * 
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @return {string} query
 */
query.averageOnBaseByBat = (bat, limitPA) => averageByBat(bat, limitPA, 'average_onbase_horizontal')

/**
 * 打席ごと長打率取得
 * 
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @return {string} query
 */
query.averageSluggingByBat = (bat, limitPA) => averageByBat(bat, limitPA, 'average_slugging_horizontal')

/**
 * 
 * @param {number} bat
 * @param {number} limitPA
 */
query.averageOpsBat = (bat, limitPA) => {
  const rate = `rate${bat}`
  const pa = `pa${bat}`
  return `
    SELECT
      o.id,
      o.name,
      o.team,
      o.rate + s.rate AS rate_sum,
      o.${rate} + s.${rate} AS rate,
      o.${rate} AS onbase,
      s.${rate} AS slugging,
      o.${pa} AS pa,
      rank.rank
    FROM
      baseball.average_onbase_horizontal o
      LEFT JOIN baseball.average_slugging_horizontal s ON o.batter = s.batter
      LEFT JOIN (
        SELECT
          id,
          score,
          rank
        FROM
          (
            SELECT
              score,
              @rank AS rank,
              cnt,
              @rank := @rank + cnt
            FROM
              (
                SELECT
                  @rank := 1
              ) AS Dummy,
              (
                SELECT
                  rate AS score,
                  COUNT(*) AS cnt
                FROM
                  (
                    SELECT
                      o.id,
                      o.name,
                      o.team,
                      o.rate + s.rate AS rate_sum,
                      o.${rate} + s.${rate} AS rate,
                      o.${rate} AS onbase,
                      s.${rate} AS slugging,
                      o.${pa} AS pa
                    FROM
                      baseball.average_onbase_horizontal o
                      LEFT JOIN baseball.average_slugging_horizontal s ON o.batter = s.batter
                    WHERE
                      o.${pa} >= ${limitPA}
                  ) AS htb
                GROUP BY
                  score
                ORDER BY
                  score DESC
              ) AS GroupBy
          ) AS Ranking
          JOIN (
            SELECT
              o.id,
              o.name,
              o.team,
              o.rate + s.rate AS rate_sum,
              o.${rate} + s.${rate} AS rate,
              o.${rate} AS onbase,
              s.${rate} AS slugging,
              o.${pa} AS pa
            FROM
              baseball.average_onbase_horizontal o
              LEFT JOIN baseball.average_slugging_horizontal s ON o.batter = s.batter
            WHERE
              o.${pa} >= ${limitPA}
          ) AS htb ON htb.rate = Ranking.score
        ORDER BY
          rank ASC
      ) AS rank ON rank.id = o.id
    WHERE
      o.${pa} >= ${limitPA}
    ORDER BY
      rate DESC
`}

/**
 * 
 * @param {number} ballType 球種ID
 * @param {number} limitPitches 下限投球数
 * @param {number} limit 上限表示ランキング
 */
query.speed = (ballType, limitPitches, limit) => `
  SELECT 
    h.lr,
    h.name,
    h.team,
    h.b${ballType}_avg_spd AS avg_spd,
    h.b${ballType}_max_spd AS max_spd,
    h.b${ballType}_cnt AS cnt,
    rank.rank
  FROM
    baseball.pitched_ball_info h
      LEFT JOIN
        (SELECT 
          id, score, rank
        FROM 
          (SELECT 
            score, @rank AS rank, cnt, @rank:=@rank + cnt
          FROM
            (SELECT @rank:=1) AS Dummy,
            (SELECT 
              b${ballType}_avg_spd AS score, COUNT(*) AS cnt
            FROM
              (SELECT 
                *
              FROM
                pitched_ball_info
              WHERE
                b${ballType}_cnt >= ${limitPitches}
              ) AS htb
            GROUP BY score
            ORDER BY score DESC
            ) AS GroupBy
          ) AS Ranking
        JOIN
          (SELECT 
            *
          FROM
            pitched_ball_info
          WHERE
            b${ballType}_cnt >= ${limitPitches}
          ) AS htb ON b${ballType}_avg_spd = Ranking.score
        ORDER BY rank ASC
        ) AS rank
      ON rank.id = h.id
    WHERE
      h.b${ballType}_cnt >= ${limitPitches}
    ORDER BY h.b${ballType}_avg_spd DESC
    LIMIT ${limit}
`

/**
 * 
 * @param {number} ballType
 * @param {number} limitSO 下限奪三振数
 * @param {number} limitSORate 下限奪三振率
 * @param {number} 
 */
query.strikeout = (ballType, limitSO, limitSORate, limit) => `
  SELECT   
    h.id, h.lr, h.name, h.team, h.all AS all_cnt, h.swing, h.swg_rate, h.look, h.look_rate, h.avg_cnt, h.b${ballType} AS b_cnt, h.b${ballType}_rate AS b_rate, rank.rank
  FROM
    baseball.strikeout_info h
      LEFT JOIN
        (SELECT 
          id, score, rank
        FROM 
          (SELECT 
            score, @rank AS rank, cnt, @rank:=@rank + cnt
          FROM
            (SELECT @rank:=1) AS Dummy,
            (SELECT 
              b${ballType}_rate AS score, COUNT(*) AS cnt
            FROM
              (SELECT 
                *
              FROM
                baseball.strikeout_info
              WHERE
                b${ballType} >= ${limitSO} OR (b${ballType} >= ${limitSO} AND b${ballType}_rate >= ${limitSORate})
              ) AS htb
            GROUP BY score
            ORDER BY score DESC
            ) AS GroupBy
          ) AS Ranking
        JOIN
          (SELECT 
            *
          FROM
            baseball.strikeout_info
          WHERE
            b${ballType} >= ${limitSO} OR (b${ballType} >= ${limitSO} AND b${ballType}_rate >= ${limitSORate})
          ) AS htb ON b${ballType}_rate = Ranking.score
        ORDER BY rank ASC
        ) AS rank
      ON rank.id = h.id
    WHERE
      h.b${ballType} >= ${limitSO} OR (h.b${ballType} >= ${limitSO} AND h.b${ballType}_rate >= ${limitSORate})
    ORDER BY h.b${ballType}_rate DESC
    LIMIT ${limit}
`