import { format } from 'util';
import * as moment from 'moment';

import { getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, teamHalfNames, leagueList } from '../constant';
import { checkArgBatOut, checkArgDay, checkArgM, checkArgStrikeType, checkArgTargetDay, checkArgTMLG, checkArgTMLGForTweet, checkLeague, createBatterResultRows, displayResult, trimRateZero } from '../disp_util';
import { findSavedTweeted, genTweetedDay, saveTweeted, tweetMulti, MSG_S, MSG_F, SC_RC5, SC_RC10, SC_PSG, SC_PT, getIsTweet, SC_GFS, SC_POS, SC_WS, SC_MS } from '../tweet/tw_util';
import { BatterResult } from '../type/jsonType';
import { isFinishedGame, isFinishedGameByLeague, isLeftMoundStarterAllGame, isLeftMoundStarterByTeam } from '../db_util';

/**
 * 
 */
export const execBatRc5Team = async (isTweet = true, teamArg = '', leagueArg = '') => {
  const teams = checkArgTMLG(teamArg, leagueArg);
  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const results: BatterResult[] = await manager.query(`
      SELECT
        base.*,
        other.hr,
        other.rbi
      FROM (
        SELECT
          REPLACE(current_batter_name, ' ', '') AS batter,
          COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
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
    `);

    const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == team);

    const title = format('%s打者 最近5試合 打撃成績\n', teamNames[teamIniEn]);
    const rows = createBatterResultRows(results);
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (isTweet) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_RC5, team, tweetedDay);
      const isFinished = await isFinishedGame(team, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_RC5, team, tweetedDay);
        console.log(format(MSG_S, tweetedDay, team, SC_RC5));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, tweetedDay, team, SC_RC5, cause));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execPitchRc10Team = async (isTweet = true, teamArg = '', leagueArg = '') => {
  const teams = checkArgTMLG(teamArg, leagueArg);
  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const results = await manager.query(`
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
    `);

    const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == team);

    const title = format('%s 中継ぎ投手 最近10試合 成績\n', teamNames[teamIniEn]);
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);
    const rows = [];

    for (const result of results) {
      const { p_name, era, hold, save, win, lose, game_cnt, inning, er, ra } = result;

      let resultClause = format('%s%s%s%s',
        Number(win) > 0 ? format('%s勝', win) : '',
        Number(lose) > 0 ? format('%s敗', lose) : '',
        Number(hold) > 0 ? format('%sH', hold) : '',
        Number(save) > 0 ? format('%sS', save) : ''
      );
      resultClause = resultClause.length > 0 ? resultClause + ' ' : resultClause;

      let erClause = Number(ra) == 0 && Number(er) == 0 ? '' : format('自%s', er);

      rows.push(format(
        '\n%s試 防%s  %s  %s回 %s失%s %s',
        game_cnt, era, p_name, inning, resultClause, ra, erClause
      ));
    }

    if (isTweet) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_RC10, team, tweetedDay);
      const isFinished = await isFinishedGame(team, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_RC10, team, tweetedDay);
        console.log(format(MSG_S, tweetedDay, team, SC_RC10));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, tweetedDay, team, SC_RC10, cause));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execPitchStrikeSwMsGame = async (isTweet = true, dayArg = '', strikeArg = '') => {
  interface Result { team: string, pitcher: string, swing_cnt: string, missed_cnt: string }

  const day = checkArgDay(dayArg);
  const strikes = checkArgStrikeType(strikeArg);
  if (! strikes.length) return;

  const manager = await getManager();
  for (const strike of strikes) {
    const results: Result[] = await manager.query(`
      SELECT 
        p_team AS team,
        REPLACE(current_pitcher_name, ' ', '') AS pitcher,
        SUM(is_swing) AS swing_cnt,
        SUM(is_missed) AS missed_cnt
      FROM
        baseball_2020.debug_pitch_base
      WHERE
        date = '${day}' AND current_pitcher_order = 1
      GROUP BY p_team, current_pitcher_name
      ORDER BY ${strike}_cnt DESC
    `);

    const title = format('%s 先発投手\n%sストライク数\n', moment(day, 'YYYYMMDD').format('M/D'), strike == 'swing' ? '空振り' : '見逃し');
    const rows = [];
    for (const result of results) {
      const { pitcher, team } = result;
      rows.push(format('\n%s  %s(%s)', result[`${strike}_cnt`], pitcher, team));
    }

    if (isTweet) {
      const savedTweeted = await findSavedTweeted(SC_PSG, 'ALL', day);
      const isLeft = await isLeftMoundStarterAllGame(day);

      if (! savedTweeted && isLeft) {
        await tweetMulti(title, rows);
        await saveTweeted(SC_PSG, 'ALL', day);
        console.log(format(MSG_S, day, 'ALL', SC_PSG));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, 'ALL', SC_PSG, cause));
      }
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchType = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '') => {
  interface Result { team: string, pitcher: string, pitch_type: string, pitch_type_cnt: string }
  interface PitchType { type: string, cnt: number }
  interface PitcherPitchType { team: string, pitcher: string, types: PitchType[] }

  const day = checkArgDay(dayArg);

  const teams = checkArgTMLG(teamArg, leagueArg);
  if (! teams.length) return;

  const manager = await getManager();
  const results: Result[] = await manager.query(`
    SELECT 
      p_team AS team,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      pitch_type,
      COUNT(pitch_type) AS pitch_type_cnt
    FROM
      baseball_2020.debug_pitch_base
    WHERE
      date = '${day}'
      AND current_pitcher_order = 1
      AND p_team IN ('${teams.join("', '")}')
    GROUP BY p_team, current_pitcher_name , pitch_type
    ORDER BY p_team DESC, current_pitcher_name DESC, pitch_type_cnt DESC
  `);

  if (! results.length) console.log('出力対象のデータがありません');

  const newResults: PitcherPitchType[] = [];
  // 投手単位 球種別投球数リスト作成
  for (const result of results) {
    const existResult = newResults.find(({ team, pitcher }) => result.team == team && result.pitcher == pitcher);
    if (existResult) {
      const idx = newResults.indexOf(existResult);
      const { pitch_type, pitch_type_cnt } = result;
      newResults[idx].types.push({ type: pitch_type, cnt: Number(pitch_type_cnt) })
    } else {
      const { team, pitcher, pitch_type, pitch_type_cnt } = result;
      newResults.push({
        team,
        pitcher,
        types: [{ type: pitch_type, cnt: Number(pitch_type_cnt) }]
      })
    }
  }

  for (const newResult of newResults) {
    let rows: string[] = [];
    const { team, pitcher, types } = newResult;

    const total = types.reduce((a, x) => a + x.cnt, 0);
    const [ teamIniEn ] = Object.entries(teamArray).find(([, value]) => value == team);

    rows.push(format('\n%s\n%s投手 (投球数 %s)\n', teamHalfNames[teamIniEn], pitcher, total));

    for (const typeUnit of types) {
      const { type, cnt } = typeUnit;
      rows.push(format('\n%s (%s%) ', cnt, Math.round(cnt * 100 / total * 10) / 10), type);
    }

    const title = format('%s 先発投手 投球球種内容\n', moment(day, 'YYYYMMDD').format('M/D'));
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (isTweet) {
      const savedTweeted = await findSavedTweeted(SC_PT, team, day);
      const isLeft = await isLeftMoundStarterByTeam(day, team);

      if (! savedTweeted && isLeft) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_PT, team, day);
        console.log(format(MSG_S, day, team, SC_PT));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, team, SC_PT, cause));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execPitchGroundFlyStart = async (isTweet = true, dayArg = '', batOutArg = '') => {
  interface Result { team: string, pitcher: string, fly_out_cnt: string, ground_out_cnt: string }

  const day = checkArgDay(dayArg);

  const batOuts = checkArgBatOut(batOutArg);
  if (! batOuts.length) return;

  const manager = await getManager();
  for (const batOut of batOuts) {
    const results: Result[] = await manager.query(`
      SELECT 
        REPLACE(current_pitcher_name, ' ', '') AS pitcher,
        p_team AS team,
        COUNT((batting_result LIKE '%フライ%' OR batting_result LIKE '%飛%') OR NULL) AS fly_out_cnt,
        COUNT((batting_result LIKE '%ゴロ%' OR batting_result LIKE '%併殺%') OR NULL) AS ground_out_cnt
      FROM
        baseball_2020.debug_base
      WHERE
        date = '${day}' AND  current_pitcher_order = 1
      GROUP BY current_pitcher_name, p_team
      ORDER BY ${batOut}_out_cnt DESC
    `);

    const title = format('%s 先発投手\n%sアウト数\n', moment(day, 'YYYYMMDD').format('M/D'), batOut == 'fly' ? 'フライ' : 'ゴロ');
    const rows = [];
    for (const result of results) {
      const { pitcher, team } = result;

      rows.push(format('\n%s  %s(%s)', result[`${batOut}_out_cnt`], pitcher, team));
    }

    if (isTweet) {
      const scriptName = format('%s_%s', SC_GFS, batOut.slice(0, 1));
      const savedTweeted = await findSavedTweeted(scriptName, 'ALL', day);
      const isLeft = await isLeftMoundStarterAllGame(day);

      if (! savedTweeted && isLeft) {
        await tweetMulti(title, rows);
        await saveTweeted(scriptName, 'ALL', day);
        console.log(format(MSG_S, day, 'ALL', scriptName));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, 'ALL', scriptName, cause));
      }
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchPerOut = async (isTweet = true, dayArg = '') => {
  interface Result { team: string, pitcher: string, ball_cnt: string }

  const day = checkArgDay(dayArg);

  const manager = await getManager();
  const results: Result[] = await manager.query(`
    SELECT 
        p_team AS team,
        REPLACE(name, ' ', '') AS pitcher,
        round(np / outs, 2) AS ball_cnt
    FROM
        baseball_2020.debug_stats_pitcher sp
    WHERE sp.date = '${day}' AND sp.order = 1
    ORDER BY ball_cnt
  `);

  const title = format('%s 先発投手\n1アウト毎 所要投球数\n', moment(day, 'YYYYMMDD').format('M/D'));
  const rows = [];
  for (const result of results) {
    const { pitcher, team, ball_cnt } = result;
    rows.push(format('\n%s  %s(%s)', ball_cnt, pitcher, team));
  }

  if (isTweet) {
    const savedTweeted = await findSavedTweeted(SC_POS, 'ALL', day);
    const isLeft = await isLeftMoundStarterAllGame(day);

    if (! savedTweeted && isLeft) {
      await tweetMulti(title, rows);
      await saveTweeted(SC_POS, 'ALL', day);
      console.log(format(MSG_S, day, 'ALL', SC_POS));
    } else {
      const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
      console.log(format(MSG_F, day, 'ALL', SC_POS, cause));
    }
  } else {
    displayResult(title, rows);
  }
}

/**
 * 
 */
export const execWeekStand = async (isTweet = true, leagueArg = '', dayArg = '') => {
  let league = leagueArg;
  const teamsArray = checkArgTMLGForTweet('', leagueArg);
  if (! teamsArray.length) return;

  const { firstDayOfWeek, lastDayOfWeek, firstDayOfWeekStr, lastDayOfWeekStr } = checkArgTargetDay(dayArg);

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results = await manager.query(`
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
                  (date BETWEEN '${firstDayOfWeekStr}' AND '${lastDayOfWeekStr}')
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
                (date BETWEEN '${firstDayOfWeekStr}' AND '${lastDayOfWeekStr}')
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
                AND (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}')
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
                AND (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}')
            GROUP BY
                home_initial
        ) home ON home.team_initial = base.team_initial_kana
      WHERE
        base.team_initial_kana IN ('${teams.join("', '")}')
      ORDER BY
        win_rate DESC, win_count DESC
    `);

    let teamTitle = 'NPB';
    if (league) teamTitle = leagueList[league];
    if (teams.length == 6) {
      league = checkLeague(teams);
      teamTitle = leagueList[league];
    }

    let prevTeamSavings = 0;
    const title = format("%s球団 %s〜%s 成績\n", teamTitle, firstDayOfWeek.format('M/D'), lastDayOfWeek.format('M/D'));
    const rows = [];

    for (let idx in results) {
      const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = results[idx];
      const nowTeamSavings = Number(win_count) - Number(lose_count);

      rows.push(format(
        "\n%s %s勝%s敗%s %s %s %s ",
        team_initial_kana, win_count, lose_count,
        draw_count > 0 ? format("%s分", draw_count) : '', trimRateZero(win_rate),
        Number(idx) > 0 ? (prevTeamSavings - nowTeamSavings) / 2 : '-', teamHashTags[team_initial]
      ));  

      prevTeamSavings = nowTeamSavings;
    }

    if (isTweet) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_WS, league, tweetedDay);
      const isFinished = await isFinishedGameByLeague(teams, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows);
        await saveTweeted(SC_WS, league, tweetedDay);
        console.log(format(MSG_S, tweetedDay, league, SC_WS));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, tweetedDay, league, SC_WS, cause));
      }
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execMonthStand = async (isTweet = true, leagueArg = '', monthArg = '') => {
  let league = leagueArg;
  const teamsArray = checkArgTMLGForTweet('', league);
  if (! teamsArray.length) return;

  const { monthArg: month, firstDay, lastDay } = checkArgM(Number(monthArg));

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results = await manager.query(`
      SELECT
        base.team_initial_kana,
        base.team_initial,
        base.game_cnt,
        away.win_count_away + home.win_count_home AS win_count,
        away.lose_count_away + home.lose_count_home AS lose_count,
        away.draw_count_away + home.draw_count_home AS draw_count,
        ROUND((away.win_count_away + home.win_count_home) / (base.game_cnt - (away.draw_count_away + home.draw_count_home)), 3) AS win_rate,
        '' AS eol
      FROM
        game_cnt_per_month base
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
                AND (date >= '${firstDay}' AND date <= '${lastDay}')
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
                AND (date >= '${firstDay}' AND date <= '${lastDay}')
            GROUP BY
                home_initial
        ) home ON home.team_initial = base.team_initial_kana
      WHERE
        base.month = ${month} AND base.team_initial_kana IN ('${teams.join("', '")}')
      ORDER BY
        win_rate DESC
    `);

    let teamTitle = 'NPB';
    if (league) teamTitle = leagueList[league];
    if (teams.length == 6) {
      league = checkLeague(teams);
      teamTitle = leagueList[league];
    }
    
    let prevTeamSavings = 0;
    const title = format("%s球団 %s月 成績\n", teamTitle, month);
    const rows = [];
    for (let idx in results) {
      const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = results[idx];
      const nowTeamSavings = Number(win_count) - Number(lose_count);

      rows.push(format(
        "\n%s %s勝%s敗%s %s %s %s ",
        team_initial_kana, win_count, lose_count,
        draw_count > 0 ? format("%s分", draw_count) : '', trimRateZero(win_rate),
        Number(idx) > 0 ? (prevTeamSavings - nowTeamSavings) / 2 : '-', teamHashTags[team_initial]
      ));  

      prevTeamSavings = nowTeamSavings;
    }

    if (isTweet) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_MS, league, tweetedDay);
      const isFinished = await isFinishedGameByLeague(teams, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows);
        await saveTweeted(SC_MS, league, tweetedDay);
        console.log(format(MSG_S, tweetedDay, league, SC_MS));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, tweetedDay, league, SC_MS, cause));
      }
    } else {
      displayResult(title, rows);
    }
  }
}
