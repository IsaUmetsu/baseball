/**
 * @param tableName
 * @param alias
 * @param selectCols
 * @return
 */
const getBaseTeamTable = (tableName: string, alias: string, selectCols: string): string => `
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
 * @param tableName
 * @param alias
 * @return
 */
const getBaseBatterTable = (tableName: string, alias: string): string => `
  (
    SELECT base.*
    FROM baseball.${tableName} base
    LEFT JOIN batter_reaching_regulation br ON base.id = br.batter
    WHERE br.batter IS NOT NULL
  ) AS ${alias}
`;

export function resultPerAny(
  any: string, target: string, tableName: string,
  isTeam: boolean, whereClause: string = ""
): string {
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