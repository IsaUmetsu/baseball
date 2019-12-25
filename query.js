"use strict";

const query = (module.exports = {});

/**
 * 選手起用に変更があるか判定
 */
query.judgePlayerChange = (oo_id, now_pitch_count, top_bottom) => `
  SELECT
    prv.*,
    aft_player,
    aft_pos,
    aft_prf_nbr,
    aft_name
  FROM
    (
      SELECT
        \`order_overview_id\` AS oo_id,
        \`top_bottom\`,
        \`pitch_count\`,
        \`batting_order\`,
        \`player\` AS prv_player,
        \`pos\` AS prv_pos,
        \`profile_number\` AS prv_prf_nbr,
        \`player_name\` AS prv_name
      FROM
        baseball.order_detail
      WHERE
        order_overview_id = ${oo_id}
        AND top_bottom = ${top_bottom}
        AND pitch_count = ${now_pitch_count} - 1
    ) AS prv
    LEFT JOIN (
      SELECT
        \`order_overview_id\` AS oo_id,
        \`top_bottom\`,
        \`pitch_count\`,
        \`batting_order\`,
        \`player\` AS aft_player,
        \`pos\` AS aft_pos,
        \`profile_number\` AS aft_prf_nbr,
        \`player_name\` AS aft_name
      FROM
        baseball.order_detail
      WHERE
        order_overview_id = ${oo_id}
        AND top_bottom = ${top_bottom}
        AND pitch_count = ${now_pitch_count}
    ) AS aft ON prv.oo_id = aft.oo_id
    AND prv.top_bottom = aft.top_bottom
    AND prv.pitch_count = (aft.pitch_count - 1)
    AND prv.batting_order = aft.batting_order
  WHERE
    prv_player != aft_player
    OR prv_pos != aft_pos;
`

/**
 * 選手変更時の試合情報（イニング、カウント、ランナー状況）取得
 */
query.getGameInfoWhenChange = (
  oo_id,
  prv_pitch_count,
  pitch_count
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
    g.order_overview_id = ${oo_id}
    AND g.pitch_count IN (${prv_pitch_count}, ${pitch_count})
`;

/**
 * 打順ごとのスタメン回数取得
 */
query.getStartingMenberSpecifyOrder = (team, order) => `
  SELECT
    player_name,
    COUNT(player_name) AS count
  FROM
    (
      SELECT
        od.*
      FROM
        baseball.order_detail od
        LEFT JOIN order_overview oo ON oo.id = od.order_overview_id
        LEFT JOIN no_game_info ng ON ng.order_overview_id = oo.id
        LEFT JOIN post_season_info ps ON ps.oo_id = oo.id
      WHERE
        (
          oo.visitor_team = '${team}'
          OR oo.home_team = '${team}'
        )
        AND od.top_bottom = CASE
          WHEN oo.visitor_team = '${team}' THEN 1
          WHEN oo.home_team = '${team}' THEN 2
        END
        AND ng.remarks IS NULL
        AND ps.oo_id IS NULL
        AND pitch_count = 1
        AND batting_order = ${order}
    ) AS A
  GROUP BY
    player_name
  ORDER BY
    count DESC;
`

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
                player_name
              ORDER BY
                order_overview_id,
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
 * フル出場選手情報取得 (既成テーブルからのSELECT)
 * @param {string} team
 * @param {number} order
 * @return {string}
 */
query.getFullParticipationTable = (team, order) => `
  SELECT
    name AS player_name,
    stmm${order} AS starting_cnt,
    full${order} AS count
  FROM baseball.participate_order
  WHERE team = '${team}' AND stmm${order} > 0
  order by full${order} DESC, stmm${order} DESC;
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
  const selectTable = isTeam
    ? getBaseTeamTable(
        "homerun_situation_batter",
        "h",
        `
    SUM(${situation}_hr) AS ${situation}_hr,
    SUM(total_hr) AS total_hr,
    ROUND(SUM(${situation}_hr)/SUM(total_hr), 5) AS ${situation}_ttl_pct
  `
      )
    : getBaseBatterTable("homerun_situation_batter", "h");

  return `
    SELECT 
      h.id, h.name, h.team, ${selectColsPart}, rank.rank
    FROM
      ${selectTable}
        LEFT JOIN
          (SELECT 
            id, score, rank
          FROM 
            (SELECT 
              score, ${
                isDevide ? `` : `percent,`
              } @rank AS rank, cnt, @rank:=@rank + cnt
            FROM
              (SELECT @rank:=1) AS Dummy,
              (SELECT 
                hr AS score, ${
                  isDevide ? `` : `pct AS percent,`
                } COUNT(*) AS cnt
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
            ) AS htb ON htb.hr = Ranking.score ${
              isDevide ? `` : `AND htb.pct = Ranking.percent`
            }
          ORDER BY rank ASC
          ) AS rank
        ON rank.id = h.id
      LEFT JOIN team_info t ON t.team_initial = h.team
      WHERE h.${situation}_hr > 0
      ORDER BY h.${situation}_hr ${
    isDevide ? `ASC` : `DESC`
  }, h.${situation}_ttl_pct ${isDevide ? `ASC` : `DESC`}
      ${isDevide ? `` : `LIMIT ${limit}`};
`;
};

/**
 * イニング別選手成績取得
 * @param {object} selectColInfo hit&hr&rbi&bat
 * @param {boolean} isTeam
 * @param {string} target hit|hr|rbi|bat
 * @return {string} query
 */
query.resultPerAnyColSum = (selectColInfo, isTeam, target, tableName) => {
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
    ? getBaseTeamTable(
        tableName,
        "h",
        `
      SUM(${hit}) AS hit,
      SUM(${hr}) AS hr,
      SUM(${rbi}) AS rbi,
      SUM(${bat}) AS bat
    `
      )
    : getBaseBatterTable(tableName, "h");

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
          score, ${
            target == "rate" ? `` : `rate,`
          } @rank AS rank, cnt, @rank := @rank + cnt 
        FROM
          (SELECT @rank := 1) AS Dummy, 
          (SELECT
            ${target} AS score, ${
    target == "rate" ? `` : `rate,`
  } Count(*) AS cnt 
          FROM
            (SELECT
              h.id, ${selectCols}
            FROM
              ${fromTable}
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
        ) AS htb 
      ON htb.${target} = Ranking.score ${
    target == "rate" ? `` : ` AND htb.rate = Ranking.rate `
  }
      ORDER  BY rank ASC
    ) AS rank ON rank.id = h.id 
    ORDER  BY ${target} DESC ${target == "rate" ? `` : `, rate DESC`}
`;
};

/**
 * 打席ごと結果取得
 *
 * @param {number} bat 第何打席か
 * @param {string} rateType rate|obrate|slug|ops
 * @return {string} query
 */
query.resultPerBat = (bat, rateType, isTeam) => {
  const colAB = `ab${bat}`,
    colHit = `hit${bat}`,
    colHr = `hr${bat}`,
    colRbi = `rbi${bat}`,
    colAbob = `abob${bat}`,
    colOb = `ob${bat}`,
    colTb = `tb${bat}`,
    colRate = `rate${bat}`,
    colObRate = `obrate${bat}`,
    colSlug = `slug${bat}`,
    colOps = `ops${bat}`,
    colTarget = `${rateType}${bat}`;

  const fromTable = isTeam
    ? getBaseTeamTable(
        "result_per_bat",
        "h",
        `
    SUM(base.${colAB}) AS ${colAB},
    SUM(base.${colHit}) AS ${colHit},
    SUM(base.${colHr}) AS ${colHr},
    SUM(base.${colRbi}) AS ${colRbi},
    ROUND(SUM(base.${colHit})/SUM(base.${colAB}), 5) AS ${colRate},
    SUM(base.${colAbob}) AS ${colAbob},
    SUM(base.${colOb}) AS ${colOb},
    SUM(base.${colTb}) AS ${colTb},
    ROUND(SUM(base.${colOb})/SUM(base.${colAbob}), 5) AS ${colObRate},
    ROUND(SUM(base.${colTb})/SUM(base.${colAB}), 5) AS ${colSlug},
    ROUND(SUM(base.${colOb})/SUM(base.${colAbob}), 5) + ROUND(SUM(base.${colTb})/SUM(base.${colAB}), 5) AS ${colOps}
  `
      )
    : getBaseBatterTable("result_per_bat", "h");

  return `
    SELECT
      h.id, h.name, h.team,
      h.${colAB} AS bat,
      h.${colHit} AS hit,
      h.${colHr} AS hr,
      h.${colRbi} AS rbi,
      h.${colRate} AS rate,
      h.${colAbob} AS batob,
      h.${colOb} AS ob,
      h.${colTb} AS tb,
      h.${colObRate} AS obrate,
      h.${colSlug} AS slug,
      h.${colOps} AS ops,
      rank.rank
    FROM
      ${fromTable}
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
                  ${colTarget} AS score, COUNT(*) AS cnt
                FROM
                  (
                    SELECT
                      id, ${colTarget}
                    FROM
                      ${fromTable}
                  ) AS htb
                GROUP BY score
                ORDER BY score DESC
              ) AS GroupBy
          ) AS Ranking
          JOIN (
            SELECT
              id, ${colTarget} AS score_htb
            FROM
              ${fromTable}
          ) AS htb ON htb.score_htb = Ranking.score
        ORDER BY rank ASC
      ) AS rank ON rank.id = h.id
    ORDER BY h.${colTarget} DESC
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
 * チーム別適時打ランキング
 *
 * @param {string} situation シチュエーション
 * @param {number} limit
 * @param {boolean} isTeam
 */
query.hitRbiSituation = (situation, limit, isTeam) => {
  let targetCol = situation ? situation : "total",
    hitCol = `${targetCol}_hit`,
    batCol = `${targetCol}_bat`,
    runsCol = `${targetCol}_runs`;

  const selectTable = isTeam
    ? getBaseTeamTable(
        "hit_rbi_situation_batter",
        "h",
        `
    SUM(${hitCol}) AS ${hitCol},
    SUM(${batCol}) AS ${batCol},
    SUM(${runsCol}) AS ${runsCol}
  `
      )
    : getBaseBatterTable("hit_rbi_situation_batter", "h");

  return `
    SELECT
      h.id, h.name, h.team,
      ${hitCol} AS hit,
      ${batCol} AS bat,
      ${runsCol} AS runs,
      ROUND(${hitCol} / ${batCol}, 5) AS percent,
      rank.rank
    FROM
      ${selectTable}
    LEFT JOIN
      (SELECT
        id, score, rank 
      FROM
        (SELECT
          score, percent, @rank AS rank, cnt, @rank := @rank + cnt 
        FROM
          (SELECT @rank := 1) AS Dummy, 
          (SELECT
            ${hitCol} AS score, percent, Count(*) AS cnt 
          FROM
            (SELECT
              id, ${hitCol}, ROUND(${hitCol} / ${batCol}, 5) AS percent 
            FROM
              ${selectTable}
            WHERE ${hitCol} > 0
            ) AS h 
          GROUP  BY score, percent
          ORDER  BY score DESC, percent DESC
          ) AS GroupBy
        ) AS Ranking 
      JOIN
        (SELECT
          id, ${hitCol}, ROUND(${hitCol} / ${batCol}, 5) AS percent
        FROM
          ${selectTable}
        WHERE ${hitCol} > 0
        ) AS h 
      ON ${hitCol} = Ranking.score AND h.percent = Ranking.percent
      ORDER  BY rank ASC
    ) AS rank ON rank.id = h.id 
    WHERE ${hitCol} > 0
    ORDER BY ${hitCol} DESC, percent DESC
    LIMIT ${limit}`;
};

/**
 * 任意項目別打撃成績(チーム別/規定到達打者限定)取得
 * @param {string} any base|count
 * @param {string} target 順位付け対象 (rate|hr|rbi)
 * @param {string} tableName result_per_situation_base|result_per_count_regulation
 * @param {boolean} isTeam
 * @return {string}
 */
query.resultPerAny = (any, target, tableName, isTeam, whereClause) => {
  const fromTable = isTeam
    ? getBaseTeamTable(
        tableName,
        "hb",
        `
        SUM(hit_${any}) AS hit_${any},
        SUM(hr_${any}) AS hr_${any},
        SUM(rbi_${any}) AS rbi_${any},
        SUM(bat_${any}) AS bat_${any},
        ROUND(SUM(hit_${any})/SUM(bat_${any}), 5) AS rate_${any}`
      )
    : getBaseBatterTable(tableName, "hb");

  return `
    SELECT
      name, team,
      hit_${any} AS hit, hr_${any} AS hr,
      rbi_${any} AS rbi, bat_${any} AS bat,
      rate_${any} AS rate, rank.rank
    FROM
      ${fromTable}
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
                    ${fromTable}
                  ${whereClause}
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
            ${fromTable}
          ${whereClause}
        ) AS htb ON htb.${target} = Ranking.score
      ORDER BY rank ASC) AS rank ON rank.id = hb.id
    ${whereClause}
    ORDER BY ${target}_${any} DESC`;
};

/**
 * 進塁率取得 (打者/チーム共通)
 * @param {string} status
 * @param {boolean} isTeam
 * @return {string}
 */
query.resultDrivedPerStatus = (status, isTeam) => {
  // 取得対象テーブルの区分
  const fromTable = isTeam
    ? `
    (
      SELECT
        MAX(rd.id) AS id,
        team_short_name AS team, null AS name,
        SUM(bat_${status}) AS bat_${status},
        SUM(drv_${status}) AS drv_${status},
        ROUND(SUM(drv_${status}) / SUM(bat_${status}), 5) AS ave_${status}
      FROM baseball.result_drived_per_status_base rd
      LEFT JOIN team_info t ON t.team_initial = rd.team AND t.league IN ('C', 'P')
      WHERE t.id IS NOT NULL
      GROUP BY team_short_name
    ) AS hb
  `
    : `
    -- result_drived_per_status_regulation hb
    (
      SELECT base.*
      FROM baseball.result_drived_per_status_base base
      LEFT JOIN batter_reaching_regulation br ON base.id = br.batter
      WHERE br.batter IS NOT NULL
    ) AS hb
  `;

  return `
    SELECT
      name, team,
      bat_${status} AS bat,
      drv_${status} AS drv,
      ave_${status} AS ave,
      rank.rank
    FROM
      ${fromTable}
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
                ave AS score, Count(*) AS cnt
              FROM
                (
                  SELECT
                    id, ave_${status} AS ave
                  FROM
                    ${fromTable}
                ) AS htb
              GROUP BY score
              ORDER BY score DESC
            ) AS GroupBy
        ) AS Ranking
        JOIN (
          SELECT
            id, ave_${status} AS ave
          FROM
            ${fromTable}
        ) AS htb ON htb.ave = Ranking.score
      ORDER BY rank ASC) AS rank ON rank.id = hb.id
    ORDER BY ave_${status} DESC`;
};

/**
 * @param {string} tableName
 * @param {string} alias
 * @param {string} selectCols
 * @return {string}
 */
const getBaseTeamTable = (tableName, alias, selectCols) => `
  (
    SELECT
      MAX(base.id) AS id,
      team_short_name AS team, null AS name,
      ${selectCols}
    FROM baseball.${tableName} base
    LEFT JOIN team_info t ON t.team_initial = base.team AND t.league IN ('C', 'P')
    WHERE t.id IS NOT NULL
    GROUP BY team_short_name
  ) AS ${alias}
`;

/**
 * @param {string} tableName
 * @param {string} alias
 * @return {string}
 */
const getBaseBatterTable = (tableName, alias) => `
  (
    SELECT base.*
    FROM baseball.${tableName} base
    LEFT JOIN batter_reaching_regulation br ON base.id = br.batter
    WHERE br.batter IS NOT NULL
  ) AS ${alias}
`;

/**
 * イニング別選手成績取得
 * @param {object} selectColInfo hit&hr&rbi&bat
 * @param {string} target scr|ls|df
 * @return {string} query
 */
query.scoreLossPerInning = (selectColInfo, target) => {
  const { scr, ls } = selectColInfo;
  // select target cols
  const selectCols = `scr, ls, df, ROUND(${target}/total_${target}, 5) AS rate`;
  // select target table (チームの場合、先にグループ化したテーブルから取得)
  const fromTable = `
    (
      SELECT
        t.team_short_name AS team,
        ${scr} AS scr, ${ls} AS ls, (${scr}) - (${ls}) AS df,
        total_scr, total_ls, total_df
      FROM baseball.score_loss_per_inning base
      LEFT JOIN team_info t ON t.team_initial = base.team AND t.league IN ('C', 'P')
      WHERE t.id IS NOT NULL
    ) AS h`;

  return `
    SELECT
      h.team, ${selectCols}, rank.rank
    FROM
      ${fromTable}
    LEFT JOIN
      (SELECT
        team, score, rank 
      FROM
        (SELECT
          score, @rank AS rank, cnt, @rank := @rank + cnt 
        FROM
          (SELECT @rank := 1) AS Dummy, 
          (SELECT
            ${target} AS score, Count(*) AS cnt 
          FROM
            (SELECT
              h.team, ${selectCols}
            FROM
              ${fromTable}
            ) AS htb 
          GROUP  BY score 
          ORDER  BY score DESC 
          ) AS GroupBy
        ) AS Ranking 
      JOIN
        (SELECT
          h.team, ${selectCols}
        FROM
          ${fromTable}
        ) AS htb 
      ON htb.${target} = Ranking.score 
      ORDER  BY rank ASC
    ) AS rank ON rank.team = h.team
    ORDER  BY ${target} DESC
`;
};
