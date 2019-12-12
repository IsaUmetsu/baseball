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
 * チーム別ホームランタイプ取得（通算本塁打数比較）
 * @param {string} situation
 * @param {boolean} isDevide
 * @param {boolean} isTeam
 * @param {number} limit
 * @return {string}
 */
query.homerunTypeRank = (situation, isDevide, isTeam, limit) => {
  // part of select cols
  const selectColsPart = `
    h.${situation}_hr AS hr,
    h.total_hr AS total,
    h.${situation}_ttl_pct AS pct
  `;
  // switch select target table (チームの場合は選手をグループ化したテーブルから取得)
  const selectTable = isTeam ? `(
      SELECT
        MAX(id) AS id, null AS name, team,
        SUM(h.${situation}_hr) AS ${situation}_hr,
        SUM(h.total_hr) AS total_hr,
        ROUND(SUM(h.${situation}_hr)/SUM(h.total_hr), 5) AS ${situation}_ttl_pct
      FROM homerun_situation_batter h GROUP BY team
    ) AS h
  ` : `baseball.homerun_situation_batter h`
  
  return `
    SELECT 
      h.id, h.name, ${isTeam ? `t.team_short_name AS team` : `h.team`}, ${selectColsPart}, rank.rank
    FROM
      ${selectTable}
        LEFT JOIN
          (SELECT 
            id, score, rank
          FROM 
            (SELECT 
              score, ${isDevide ? `` : `percent,`} @rank AS rank, cnt, @rank:=@rank + cnt
            FROM
              (SELECT @rank:=1) AS Dummy,
              (SELECT 
                hr AS score, ${isDevide ? `` : `pct AS percent,`} COUNT(*) AS cnt
              FROM
                (SELECT 
                  h.id, h.name, h.team, ${selectColsPart}
                FROM
                  ${selectTable}
                ) AS htb
              GROUP BY score ${isDevide ? `` : `, percent`}
              ORDER BY score DESC ${isDevide ? `` : `, percent DESC`}
              ) AS GroupBy
            ) AS Ranking
          JOIN
            (SELECT 
              id, name, team, ${selectColsPart}
            FROM
              ${selectTable}
            ) AS htb ON htb.hr = Ranking.score ${isDevide ? `` : `AND htb.pct = Ranking.percent`}
          ORDER BY rank ASC
          ) AS rank
        ON rank.id = h.id
      LEFT JOIN team_info t ON t.team_initial = h.team
      WHERE t.league IN ('C', 'P') ${isDevide ? `AND h.${situation}_hr > 0` : ``}
      ORDER BY h.${situation}_hr ${isDevide ? `ASC` : `DESC`}, h.${situation}_ttl_pct ${isDevide ? `ASC` : `DESC`}
      ${isDevide ? `` : `LIMIT ${limit}`};
`};

// イニング別ランキング基底クエリ (backup old version)
/*const baseInningQueryBackup = (selectHrCols, selectBatCols) => `
  SELECT
    h.id, h.name, h.team,
    ${selectHrCols} AS hr,
    ${selectBatCols} AS bat,
    ROUND((${selectHrCols})/(${selectBatCols}), 5) * 100 AS percent,
    rank.rank
  FROM
    baseball.homerun_inning_batter h 
  LEFT JOIN
    (SELECT
      id, score, rank 
    FROM
      (SELECT
        score, percent, @rank AS rank, cnt, @rank := @rank + cnt 
      FROM
        (SELECT @rank := 1) AS Dummy, 
        (SELECT
          hr AS score, percent, Count(*) AS cnt 
        FROM
          (SELECT
            h.id, h.name, h.team,
            ${selectHrCols} AS hr,
            ${selectBatCols} AS bat,
            ROUND((${selectHrCols})/(${selectBatCols}), 5) AS percent
          FROM
            homerun_inning_batter h
          ) AS htb 
        GROUP  BY score, percent 
        ORDER  BY score DESC, percent DESC
        ) AS GroupBy
      ) AS Ranking 
    JOIN
      (SELECT
        h.id, h.name, h.team,
        ${selectHrCols} AS hr,
        ${selectBatCols} AS bat,
        ROUND((${selectHrCols})/(${selectBatCols}), 5) AS percent
      FROM
        homerun_inning_batter h
      ) AS htb 
    ON htb.hr = Ranking.score AND htb.percent = Ranking.percent 
    ORDER  BY rank ASC
  ) AS rank ON rank.id = h.id 
  ORDER  BY hr DESC, percent DESC
`*/

/**
 * イニング別選手成績取得
 * @param {object} selectColInfo hit&hr&rbi&bat
 * @param {number} limit
 * @param {string} target hit|hr|rbi|bat
 * @return {string} query
 */
query.resultPerInningBatter = (selectColInfo, limit, target) => `
  SELECT
    *
  FROM (${resultPerInningBase(selectColInfo, false, target)}) AS A
  WHERE ${target} > 0
  LIMIT ${limit};
`;

/**
 * イニング別チーム成績取得
 * @param {object} selectColInfo
 * @param {string} target
 * @return {string} query
 */
query.resultPerInningTeam = (selectColInfo, target) => `
  SELECT
    t.team_short_name AS team, A.hit, A.hr, A.bat, A.rbi, A.rate, A.rank
  FROM (${resultPerInningBase(selectColInfo, true, target)}) AS A
  LEFT JOIN team_info t ON t.team_initial = A.team
  WHERE t.league IN ("C", "P")
  ORDER  BY ${target} DESC ${target == "rate" ? `` : `, rate DESC`};
`

/**
 * 
 * @param {object} selectColInfo
 * @param {boolean} isTeam
 * @param {string} target
 * @return {string}
 */
const resultPerInningBase = (selectColInfo, isTeam, target) => {
  const { hit, hr, rbi, bat } = selectColInfo;
  // select target cols
  const selectCols = isTeam
    ? `
      hit, hr, rbi, bat,
      ROUND(hit/bat, 5) AS rate`
    : `
      ${hit} AS hit, ${hr} AS hr, ${rbi} AS rbi, ${bat} AS bat,
      ROUND((${hit})/(${bat}), 5) AS rate
    `;
  // select target table (チームの場合、先にグループ化したテーブルから取得)
  const fromTable = isTeam
    ? `(
        SELECT
          MAX(id) AS id, null AS name, team,
          SUM(${hit}) AS hit,
          SUM(${hr}) AS hr,
          SUM(${rbi}) AS rbi,
          SUM(${bat}) AS bat
        FROM baseball.result_per_inning_base h
        GROUP BY team
        ) AS h`
    : `baseball.result_per_inning_base h `;
  
  return `
    SELECT
      h.id, h.name, h.team, ${selectCols}, rank.rank
    FROM
      ${fromTable}
    LEFT JOIN
      (SELECT
        id, score, rank 
      FROM
        (SELECT
          score, ${target == "rate" ? `` : `rate,`} @rank AS rank, cnt, @rank := @rank + cnt 
        FROM
          (SELECT @rank := 1) AS Dummy, 
          (SELECT
            ${target} AS score, ${target == "rate" ? `` : `rate,`} Count(*) AS cnt 
          FROM
            (SELECT
              h.id, ${selectCols}
            FROM
              ${fromTable}
            -- 打率のみ規定打席到達者限定(選手別のみ)
            ${!isTeam && target == "rate" ? `LEFT JOIN batter_reaching_regulation br ON h.id = br.batter WHERE br.batter IS NOT NULL` : ``}
            ) AS htb 
          GROUP  BY score ${target == "rate" ? `` : `, rate `} 
          ORDER  BY score DESC ${target == "rate" ? `` : `, rate DESC `}
          ) AS GroupBy
        ) AS Ranking 
      JOIN
        (SELECT
          h.id, ${selectCols}
        FROM
          ${fromTable}
        -- 打率のみ規定打席到達者限定(選手別のみ)
        ${!isTeam && target == "rate" ? `LEFT JOIN batter_reaching_regulation br ON h.id = br.batter WHERE br.batter IS NOT NULL` : ``}
        ) AS htb 
      ON htb.${target} = Ranking.score ${target == "rate" ? `` : ` AND htb.rate = Ranking.rate `}
      ORDER  BY rank ASC
    ) AS rank ON rank.id = h.id 
    -- 打率のみ規定打席到達者限定(選手別のみ)
    ${!isTeam && target == "rate" ? `LEFT JOIN batter_reaching_regulation br ON h.id = br.batter WHERE br.batter IS NOT NULL` : ``}
    ORDER  BY ${target} DESC ${target == "rate" ? `` : `, rate DESC`}
`};

/**
 * 打席ごと打率取得
 *
 * @param {number} targetBat 第何打席か
 * @return {string} query
 */
query.averageHitByBat = (bat, limitPA) =>
  averageByBat(bat, limitPA, "average_hit");

/**
 * 打席ごと率取得
 *
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @param {string} tableName テーブル名
 * @return {string} query
 */
const averageByBat = (bat, limitPA, tableName) => {
  const colPA = `pa${bat}`,
    colAB = `ab${bat}`,
    colCnt = `cnt${bat}`,
    colRate = `rate${bat}`;

  return `
    SELECT
      h.id, h.name, h.team, h.${colAB} AS bat_cnt, h.${colCnt} AS target_cnt, h.${colRate} AS average,
      rank.rank
    FROM
      baseball.${tableName} h
      LEFT JOIN (
        SELECT
          id, score, rank
        FROM
          (
            SELECT
              score, @rank AS rank, cnt, @rank := @rank + cnt
            FROM
              ( SELECT @rank := 1 ) AS Dummy,
              (
                SELECT
                  ${colRate} AS score, COUNT(*) AS cnt
                FROM
                  (
                    SELECT
                      id, name, team, ${colAB}, ${colCnt}, ${colRate}
                    FROM
                      ${tableName}
                    WHERE
                      ${colPA} >= ${limitPA}
                  ) AS htb
                GROUP BY score
                ORDER BY score DESC
              ) AS GroupBy
          ) AS Ranking
          JOIN (
            SELECT
              id, name, team, ${colAB}, ${colCnt}, ${colRate}
            FROM
              ${tableName}
            WHERE
              ${colPA} >= ${limitPA}
          ) AS htb ON htb.${colRate} = Ranking.score
        ORDER BY rank ASC
      ) AS rank ON rank.id = h.id
    WHERE
      h.${colPA} >= ${limitPA}
    ORDER BY h.${colRate} DESC
  `;
};

/**
 * 打席ごと出塁率取得
 *
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @return {string} query
 */
query.averageOnBaseByBat = (bat, limitPA) =>
  averageByBat(bat, limitPA, "average_onbase");

/**
 * 打席ごと長打率取得
 *
 * @param {number} bat 第何打席か
 * @param {number} limitPA 打席数上限
 * @return {string} query
 */
query.averageSluggingByBat = (bat, limitPA) =>
  averageByBat(bat, limitPA, "average_slugging");

/**
 *
 * @param {number} bat
 * @param {number} limitPA
 */
query.averageOpsBat = (bat, limitPA) => {
  const rate = `rate${bat}`;
  const pa = `pa${bat}`;

  const selectTargetCols = `
    o.id,
    o.name,
    o.team,
    o.rate + s.rate AS rate_sum,
    o.${rate} + s.${rate} AS rate,
    o.${rate} AS onbase,
    s.${rate} AS slugging,
    o.${pa} AS pa
  `;
  return `
    SELECT
      ${selectTargetCols},
      rank.rank
    FROM
      baseball.average_onbase o
      LEFT JOIN baseball.average_slugging s ON o.batter = s.batter
      LEFT JOIN (
        SELECT
          id, score, rank
        FROM
          (
            SELECT
              score, @rank AS rank, cnt, @rank := @rank + cnt
            FROM
              ( SELECT @rank := 1 ) AS Dummy,
              (
                SELECT
                  rate AS score, COUNT(*) AS cnt
                FROM
                  (
                    SELECT
                      ${selectTargetCols}
                    FROM
                      baseball.average_onbase o
                    LEFT JOIN baseball.average_slugging s ON o.batter = s.batter
                    WHERE
                      o.${pa} >= ${limitPA}
                  ) AS htb
                GROUP BY score
                ORDER BY score DESC
              ) AS GroupBy
          ) AS Ranking
          JOIN (
            SELECT
              ${selectTargetCols}
            FROM
              baseball.average_onbase o
            LEFT JOIN baseball.average_slugging s ON o.batter = s.batter
            WHERE
              o.${pa} >= ${limitPA}
          ) AS htb ON htb.rate = Ranking.score
        ORDER BY rank ASC
      ) AS rank ON rank.id = o.id
    WHERE
      o.${pa} >= ${limitPA}
    ORDER BY rate DESC
`;
};

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
    h.b${ballType}_mes_cnt AS cnt,
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
                b${ballType}_mes_cnt >= ${limitPitches}
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
            b${ballType}_mes_cnt >= ${limitPitches}
          ) AS htb ON b${ballType}_avg_spd = Ranking.score
        ORDER BY rank ASC
        ) AS rank
      ON rank.id = h.id
    WHERE
      h.b${ballType}_mes_cnt >= ${limitPitches}
    ORDER BY h.b${ballType}_avg_spd DESC
    LIMIT ${limit}
`;

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
`;

/**
 * チーム別ホームランタイプ取得（通算本塁打数比較）
 * @param {string} homerun_type
 */
query.hitRbiSituation = (situation, limit) => {
  let targetCol = situation ? situation : "total";
  let hitCol = `h.${targetCol}_hit`,
    batCol = `h.${targetCol}_bat`,
    runsCol = `h.${targetCol}_runs`;
  let percent = situation
    ? `${hitCol} / ${batCol}`
    : `h.total_hit / h.total_bat`;

  return `
    SELECT
      h.id, h.name, h.team,
      ${hitCol} AS hit, ${batCol} AS bat, ${runsCol} AS runs,
      ${situation ? `h.total_hit, h.total_bat, h.total_runs,` : ``}
      ROUND(${percent}, 5) AS percent, rank.rank
    FROM
      baseball.hit_rbi_situation_batter h 
    LEFT JOIN
      (SELECT
        id, score, rank 
      FROM
        (SELECT
          score, percent, cond, @rank AS rank, cnt, @rank := @rank + cnt 
        FROM
          (SELECT @rank := 1) AS Dummy, 
          (SELECT
            ${hitCol} AS score, percent, ${runsCol} AS cond, Count(*) AS cnt 
          FROM
            (SELECT
              *, ROUND(${percent}, 5) AS percent 
            FROM
              hit_rbi_situation_batter h
            WHERE 
              ${hitCol} >= ${limit}
            ) AS h 
          GROUP  BY score, percent, cond DESC
          ORDER  BY score DESC, percent DESC, cond DESC
          ) AS GroupBy
        ) AS Ranking 
      JOIN
        (SELECT
          *, ROUND(${percent}, 5) AS percent
        FROM
          hit_rbi_situation_batter h
        WHERE
          ${hitCol} >= ${limit}
        ) AS h 
      ON ${hitCol} = Ranking.score AND h.percent = Ranking.percent AND ${runsCol} = Ranking.cond
      ORDER  BY rank ASC
    ) AS rank ON rank.id = h.id 
    WHERE ${hitCol} >= ${limit}
    ORDER BY ${hitCol} DESC, percent DESC, ${runsCol} DESC`;
};

/**
 * 塁別打撃成績(規定到達打者)取得
 * @param {string} base
 * @param {string} target 順位付け対象 (rate|hr|rbi)
 * @return {string}
 */
query.resultPerBaseRegulation = (base, target) =>
  resultPerAnyRegulation(base, "result_per_situation_regulation", target);

/**
 * カウント別打撃成績(規定到達打者)取得
 * @param {string} count
 * @param {string} target 順位付け対象 (rate|hr|rbi)
 * @return {string}
 */
query.resultPerCountRegulation = (count, target) =>
  resultPerAnyRegulation(count, "result_per_count_regulation", target);

/**
 * 任意項目別打撃成績(規定到達打者限定)取得
 * @param {string} any base|count
 * @param {string} tableName
 * @param {string} target 順位付け対象 (rate|hr|rbi)
 * @return {string}
 */
const resultPerAnyRegulation = (any, tableName, target) => `
  SELECT
    name, team,
    hit_${any} AS hit, hr_${any} AS hr,
    rbi_${any} AS rbi, bat_${any} AS bat,
    rate_${any} AS rate, rank.rank
  FROM
    ${tableName} hb
  LEFT JOIN (
    SELECT
      id, score, rank
    FROM
      (
        SELECT
          score, @rank AS rank, cnt, @rank := @rank + cnt
        FROM
          ( SELECT @rank := 1 ) AS Dummy,
          (
            SELECT
              ${target} AS score, Count(*) AS cnt
            FROM
              (
                SELECT
                  id, name, team,
                  hit_${any} AS hit, hr_${any} AS hr,
                  rbi_${any} AS rbi, bat_${any} AS bat,
                  rate_${any} AS rate
                FROM
                  ${tableName}
              ) AS htb
            GROUP BY score
            ORDER BY score DESC
          ) AS GroupBy
      ) AS Ranking
      JOIN (
        SELECT
          id, name, team,
          hit_${any} AS hit, hr_${any} AS hr,
          rbi_${any} AS rbi, bat_${any} AS bat,
          rate_${any} AS rate
        FROM
          ${tableName}
      ) AS htb ON htb.${target} = Ranking.score
    ORDER BY rank ASC) AS rank ON rank.id = hb.id
  ORDER BY ${target}_${any} DESC
`;
