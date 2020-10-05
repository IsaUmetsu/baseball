
/**
 * 
 */
export const getQueryBatRc5Team = team => `
  SELECT
    base.batter,
    base.pa,
    base.bat,
    base.hit,
    base.average,
    other.hr,
    other.rbi
  FROM (
    SELECT
      REPLACE(current_batter_name, ' ', '') AS batter,
      SUM(is_pa) AS pa,
      b_team,
      SUM(is_ab) AS bat,
      SUM(is_hit) AS hit,
      SUM(is_onbase) AS onbase,
      ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
      ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
      '' AS eol
    FROM
      baseball_2020.debug_base
    WHERE
      is_pa = 1 AND
      b_team = '${team}' AND 
      g_id IN (SELECT id FROM game_id_recent_5days WHERE team = '${team}')
    GROUP BY current_batter_name, b_team 
    HAVING pa >= 2 * 5
  ) AS base
  LEFT JOIN (
    SELECT 
      b_team,
      name,
      REPLACE(name, ' ', '') AS batter,
      SUM(rbi) AS rbi,
      SUM(hr) AS hr
    FROM
      baseball_2020.stats_batter
    WHERE
      b_team = '${team}' AND
      game_info_id IN (SELECT id FROM game_id_recent_5days WHERE team = '${team}')
    GROUP BY name, b_team
  ) AS other ON base.batter = other.batter AND base.b_team = other.b_team
  ORDER BY average DESC
`;

/**
 * 
 */
export const getQueryBatRc5All = (teams, sort, order) => `
  SELECT 
    *
  FROM
    baseball_2020.debug_game_recent_5days
  WHERE b_team IN ('${teams.join("', '")}')
  ORDER BY ${sort} ${order}
  LIMIT 10
`;

/**
 * 
 */
export const getQueryPitch10Team = (team: string, limit = 6) => `
  SELECT
    p_team AS tm,
    REPLACE(name, ' ', '') AS p_name,
    COUNT(name) AS game_cnt,
    COUNT(result = '勝' or null) AS win,
    COUNT(result = '敗' or null) AS lose,
    COUNT(result = 'H' or null) AS hold,
    COUNT(result = 'S' or null) AS save,
    ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
    CONCAT(
        SUM(outs) DIV 3,
        CASE
            WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3)
            ELSE ''
        END
    ) AS inning,
    SUM(ra) AS ra,
    SUM(er) AS er,
    '' AS eol
  FROM
    baseball_2020.stats_pitcher sp
    LEFT JOIN game_info gi ON gi.id = sp.game_info_id
  WHERE
    sp.order > 1
    AND game_info_id IN (SELECT id FROM game_id_recent_10days WHERE team = '${team}')
    AND p_team = '${team}'
  GROUP BY name, p_team
  HAVING SUM(outs) > 0
  ORDER BY game_cnt DESC, SUM(er) * 27 / SUM(outs), inning DESC, win
  LIMIT ${limit}
`;

/**
 * 
 */
export const getQueryStand = (teams: string[], dateClause: string) => `
  SELECT
    base.team_initial_kana,
    base.team_initial,
    base.game_cnt,
    IFNULL(away.win_count_away, 0) + IFNULL(home.win_count_home, 0) AS win_count,
    IFNULL(away.lose_count_away, 0) + IFNULL(home.lose_count_home, 0) AS lose_count,
    IFNULL(away.draw_count_away, 0) + IFNULL(home.draw_count_home, 0) AS draw_count,
    ROUND((IFNULL(away.win_count_away, 0) + IFNULL(home.win_count_home, 0)) / (base.game_cnt - (IFNULL(away.draw_count_away, 0) + IFNULL(home.draw_count_home, 0))), 3) AS win_rate,
    '' AS eol
  FROM
    (
      SELECT
        tm.team_initial_kana AS team_initial_kana,
        tm.team_initial AS team_initial,
        IFNULL(away.game_cnt, 0) AS away_game_cnt,
        IFNULL(home.game_cnt, 0) AS home_game_cnt,
        (IFNULL(away.game_cnt, 0) + IFNULL(home.game_cnt, 0)) AS game_cnt
      FROM
      ((
        baseball_2020.team_master tm
        LEFT JOIN (
            SELECT
              away_team_initial AS team_initial,
              COUNT(away_team_initial) AS game_cnt
            FROM
              baseball_2020.game_info
            WHERE
              ${dateClause}
              AND no_game = 0
            GROUP BY
              away_team_initial
          ) away ON ((away.team_initial = tm.team_initial_kana))
        )
        LEFT JOIN (
          SELECT
            home_team_initial AS team_initial,
            COUNT(home_team_initial) AS game_cnt
          FROM
            baseball_2020.game_info
          WHERE
            (${dateClause})
            AND no_game = 0
          GROUP BY
            home_team_initial
        ) home ON ((home.team_initial = tm.team_initial_kana))
      )
    ) base
    LEFT JOIN (
      SELECT
        away_initial AS team_initial,
        COUNT(
          away_initial = CASE
            WHEN home_score > away_score THEN home_initial
            WHEN home_score < away_score THEN away_initial
            ELSE NULL
          END
          OR NULL
        ) AS win_count_away,
            COUNT(
                away_initial = CASE
                    WHEN home_score < away_score THEN home_initial
                    WHEN home_score > away_score THEN away_initial
                    ELSE NULL
                END
                OR NULL
            ) AS lose_count_away,
            COUNT(
                away_initial = CASE
                    WHEN home_score = away_score THEN away_initial
                    ELSE NULL
                END
                OR NULL
            ) AS draw_count_away,
            eol
        FROM
            baseball_2020.debug_base
        WHERE
            no_game = 0
            AND batting_result = '試合終了'
            AND (${dateClause})
        GROUP BY
            away_initial
    ) away ON away.team_initial = base.team_initial_kana
    LEFT JOIN (
        SELECT
            home_initial AS team_initial,
            COUNT(
                home_initial = CASE
                    WHEN home_score > away_score THEN home_initial
                    WHEN home_score < away_score THEN away_initial
                    ELSE NULL
                END
                OR NULL
            ) AS win_count_home,
            COUNT(
                home_initial = CASE
                    WHEN home_score < away_score THEN home_initial
                    WHEN home_score > away_score THEN away_initial
                    ELSE NULL
                END
                OR NULL
            ) AS lose_count_home,
            COUNT(
                home_initial = CASE
                    WHEN home_score = away_score THEN home_initial
                    ELSE NULL
                END
                OR NULL
            ) AS draw_count_home,
            eol
        FROM
            baseball_2020.debug_base
        WHERE
            no_game = 0
            AND batting_result = '試合終了'
            AND (${dateClause})
        GROUP BY
            home_initial
    ) home ON home.team_initial = base.team_initial_kana
  WHERE
    base.team_initial_kana IN ('${teams.join("', '")}')
  ORDER BY
    win_rate DESC, win_count DESC
`;

/**
 * 
 */
export const getQueryBatChamp = (teams: string[], dateClause: string, teamArg: string, order = 'DESC', limit = 10) => `
  SELECT
    REPLACE(current_batter_name, ' ', '') AS batter,
    base.b_team,
    SUM(is_pa) AS pa,
    SUM(is_ab) AS bat,
    SUM(is_hit) AS hit,
    SUM(is_onbase) AS onbase,
    ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
    ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
    other.hr,
    other.rbi,
    '' AS eol
  FROM
    baseball_2020.debug_base base
  -- 月間試合数 算出
  LEFT JOIN (
    SELECT 
      b_team, COUNT(date) AS game_cnt
    FROM
      (SELECT DISTINCT
        b_team, date
      FROM
        debug_base
      WHERE
        ${dateClause} AND 
        CHAR_LENGTH(b_team) > 0) AS game_cnt_base
    GROUP BY b_team
  ) gm ON base.b_team = gm.b_team
	LEFT JOIN (
		SELECT
			sb.b_team AS b_team,
			sb.name AS name,
			SUM(sb.rbi) AS rbi,
			SUM(sb.hr) AS hr,
			SUM(sb.bb) AS bb,
			SUM(sb.hbp) AS hbp
		FROM
			baseball_2020.debug_stats_batter sb
		WHERE
			sb.b_team IN ('${teams.join("', '")}')
			AND ${dateClause}
		GROUP BY sb.name, sb.b_team
	) other ON (base.current_batter_name = other.name AND base.b_team = other.b_team)
  WHERE
    is_pa = 1 AND 
    base.b_team IN ('${teams.join("', '")}') AND 
    ${dateClause}
  GROUP BY current_batter_name, base.b_team, game_cnt, other.hr, other.rbi
  HAVING SUM(is_pa) >= ${teamArg ? 2 : 3.1} * game_cnt AND SUM(is_ab) > 0
  ORDER BY average ${order}
  LIMIT ${limit}
`;

/**
 * 
 */
export const getQueryDayBatTeam = (teams: string[], day: string) => {
  const dateClause = `date = '${day}'`;
  return getQueryBatTeam(teams, dateClause);
}

/**
 * 
 */
export const getQueryWeekBatTeam = (teams: string[], firstDay: string, lastDay: string) => {
  const dateClause = `date BETWEEN '${firstDay}' AND '${lastDay}'`;
  return getQueryBatTeam(teams, dateClause);
}

/**
 * 
 */
export const getQueryMonthBatTeam = (teams: string[], month: number) => {
  const dateClause = `DATE_FORMAT(STR_TO_DATE(date, '%Y%m%d'), '%c') = ${month}`;
  return getQueryBatTeam(teams, dateClause);
}

/**
 * 
 */
const getQueryBatTeam = (teams: string[], dateClause: string) => `
  SELECT
    base.*,
    rbi,
    run,
    hr,
    sp_ab,
    sp_hit,
    sp_ave
  FROM
    (
      SELECT
        b_team,
        SUM(is_ab) AS ab,
        SUM(is_hit) AS hit,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS ave,
        SUM(is_pa) AS pa,
        SUM(is_onbase) AS onbase,
        ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS onbase_ave
      FROM
        baseball_2020.debug_base
      WHERE
        ${dateClause}
        AND CHAR_LENGTH(b_team) > 0
      GROUP BY
        b_team
    ) base
    LEFT JOIN (
      SELECT
        b_team,
        SUM(rbi) AS rbi,
        SUM(run) AS run,
        SUM(hr) AS hr
      FROM
        baseball_2020.debug_stats_batter
      WHERE
        ${dateClause}
      GROUP BY
        b_team
    ) spe ON base.b_team = spe.b_team
    LEFT JOIN (
      SELECT
        b_team,
        SUM(is_ab) AS sp_ab,
        SUM(is_hit) AS sp_hit,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS sp_ave
      FROM
        baseball_2020.debug_base
      WHERE
        ${dateClause}
        AND (
          base2_player IS NOT NULL
          OR base3_player IS NOT NULL
        )
      GROUP BY
        b_team
    ) sc ON base.b_team = sc.b_team
  WHERE base.b_team IN('${teams.join("', '")}')
  ORDER BY ave DESC, onbase_ave DESC, sp_ave DESC
`;

/**
 * 
 */
export const getQueryMonthTeamEra = (teams: string[], month: number) => {
  const dateClause = `DATE_FORMAT(STR_TO_DATE(date, '%Y%m%d'), '%c') = ${month}`;
  return getQueryTeamEra(teams, dateClause);
}

/**
 * 
 */
export const getQueryWeekTeamEra = (teams: string[], firstDay: string, lastDay: string) => {
  const dateClause = `date BETWEEN '${firstDay}' AND '${lastDay}'`;
  return getQueryTeamEra(teams, dateClause);
}

/**
 * 
 */
const getQueryTeamEra = (teams: string[], dateClause: string) => `
  SELECT
    a.*,
    s.era AS s_era,
    m.era AS m_era
  FROM
    (
      SELECT
        p_team AS tm,
        SUM(ra) AS ra,
        SUM(er) AS er,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era
      FROM
        baseball_2020.debug_stats_pitcher sp
      WHERE
        ${dateClause}
        AND p_team IN ('${teams.join("', '")}')
      GROUP BY
        p_team
    ) a
    LEFT JOIN (
      SELECT
        p_team AS tm,
        SUM(ra) AS ra,
        SUM(er) AS er,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era
      FROM
        baseball_2020.debug_stats_pitcher sp
      WHERE
        sp.order = 1
        AND ${dateClause}
        AND p_team IN ('${teams.join("', '")}')
      GROUP BY
        p_team
    ) s ON a.tm = s.tm
    LEFT JOIN (
      SELECT
        p_team AS tm,
        SUM(ra) AS ra,
        SUM(er) AS er,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era
      FROM
        baseball_2020.debug_stats_pitcher sp
      WHERE
        sp.order > 1
        AND ${dateClause}
        AND p_team IN ('${teams.join("', '")}')
      GROUP BY
        p_team
    ) m ON a.tm = m.tm
    ORDER BY a.era
`;
/**
 * 
 */
export const getQueryStarterOtherInfo = (pitcher, day) => `
  SELECT
    L.inning,
    R.ave_inning,
    R.ave_np
  FROM
    (
      SELECT
        name,
        MAX(ip) AS inning
      FROM
        baseball_2020.stats_pitcher sp
      WHERE
        name LIKE '%${pitcher.split(' ').join('%')}%'
        AND sp.order = 1
      GROUP BY
        name
    ) AS L
    LEFT JOIN (
      SELECT
        name,
        CONCAT(
          AVG(outs) DIV 3,
          CASE
            WHEN TRUNCATE(AVG(outs), 0) MOD 3 > 0 THEN CONCAT('.', TRUNCATE(AVG(outs), 0) MOD 3)
            ELSE ''
          END
        ) AS ave_inning,
        TRUNCATE(AVG(np), 0) AS ave_np
      FROM
        (
          SELECT
            *
          FROM
            baseball_2020.debug_stats_pitcher sp
          WHERE
            name LIKE '%${pitcher.split(' ').join('%')}%'
            AND sp.order = 1
            AND sp.date < ${day}
          ORDER BY
            date DESC
          LIMIT
            3
        ) AS A
      GROUP BY
        name
    ) AS R ON L.name = R.name
`