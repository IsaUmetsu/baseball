import { format } from 'util';
import * as moment from 'moment';

import { getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, dayOfWeekArr, courseTypes, teamFullNames, rankCircle, DOW_BAT_NPB_BASE, RC5_BAT_NPB_BASE, RC5_OB_NPB_BASE, RC5_OPS_NPB_BASE } from '../constant';
import { checkArgBatOut, checkArgDay, checkArgM, checkArgStrikeType, checkArgTargetDayOfWeek, checkArgTMLG, checkArgTMLGForTweet, checkLeague, createBatterResultRows, displayResult, trimRateZero, getTeamTitle, createBatterOnbaseResultRows, checkArgSort, createBatterOpsResultRows, checkArgDow, getTeamIniEn, getRank, getAscSortedArray, devideTmpRows, getDescSortedArray } from './display';
import { findSavedTweeted, genTweetedDay, saveTweeted, tweetMulti, MSG_S, MSG_F, SC_RC5T, SC_RC10, SC_PSG, SC_PT, SC_GFS, SC_POS, SC_WS, SC_MS, SC_MBC, SC_WBC, SC_DBT, tweet, SC_PRS, SC_MTE, SC_MTED, SC_MT, SC_RC5A, SC_BRC5A, SC_ORC5A, SC_WBT, SC_WTE, SC_WTED, SC_DBC, SC_DS, SC_PC, SC_RC5N, SC_BRC5N, SC_ORC5N, SC_RC10N, SC_DBCN, SC_DTED, SC_DTE, SC_DLOB, SC_PTS3, SC_PTS6, SC_DRH } from './tweet';
import { BatterResult } from '../type/jsonType';
import { isFinishedGame, isFinishedGameByLeague, isLeftMoundStarterAllGame, isLeftMoundStarterByTeam, isFinishedAllGame, isFinishedInningPitchStarterByTeam } from './db';
import { getQueryBatRc5Team, getQueryDayBatTeam, getQueryPitch10Team, getQueryBatChamp, getQueryMonthTeamEra, getQueryMonthBatTeam, getQueryBatRc5All, getQueryStarterOtherInfo, getQueryWeekBatTeam, getQueryWeekTeamEra, getQueryStand, getQueryResultTue, getQueryStandTue, getQueryPitchCourse, getQueryBatRc5Npb, getQueryPitch10TeamNpb, getQueryBatChampNpb, getQueryDayTeamEra, getQueryDayLob } from './query';
import { getPitcher } from './fs';

/**
 * 
 */
export const execBatRc5Team = async (teamArg = '', leagueArg = '', isTweet = true, scriptName = SC_RC5T) => {
  const prevTeams = checkArgTMLG(teamArg, leagueArg);
  let teams = []

  // check tweetable
  if (isTweet) {
    for (const team of prevTeams) {
      const savedTweeted = await findSavedTweeted(scriptName, team);
      const isFinished = await isFinishedGame(team, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), team, scriptName, cause));
      } else {
        teams.push(team);
      }
    }
  } else {
    teams = prevTeams;
  }

  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const teamIniEn = getTeamIniEn(team);
    const results: BatterResult[] = await manager.query(getQueryBatRc5Team(team));

    const title = format('%s打者 最近5試合 打撃成績\n', teamNames[teamIniEn]);
    const rows = createBatterResultRows(results);
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (isTweet) {
      await tweetMulti(title, rows, footer);
      await saveTweeted(scriptName, team, genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), team, scriptName));
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execBatRc5Npb = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', base = RC5_BAT_NPB_BASE, scriptName = SC_RC5N) => {
  const titlePart = '打率', col = 'average';
  const createRows = (results: BatterResult[]) => createBatterResultRows(results);

  await execRc5Npb(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName, base, format('打率%s以上', trimRateZero(base)));
}

/**
 * 
 */
export const execOnbaseRc5Npb = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', base = RC5_OB_NPB_BASE, scriptName = SC_BRC5N) => {
  const titlePart = '出塁率', col = 'average_onbase';
  const createRows = (results: BatterResult[]) => createBatterOnbaseResultRows(results);

  await execRc5Npb(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName, base, format('出塁率%s以上', trimRateZero(base)));
}

/**
 * 
 */
export const execOpsRc5Npb = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', base = RC5_OPS_NPB_BASE, scriptName = SC_ORC5N) => {
  const titlePart = 'OPS', col = 'ops';
  const createRows = (results: BatterResult[]) => createBatterOpsResultRows(results);

  await execRc5Npb(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName, base, format('OPS%s以上 (出塁率 長打率)', base));
}

/**
 * 
 */
const execRc5Npb = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = '', titlePart = '', col = '', createRows: (results: BatterResult[]) => string[], scriptName = '', base = '', titleOption = '') => {
  const teams = checkArgTMLG(teamArg, leagueArg);
  let dispTargets = [], sorts = checkArgSort(sortArg);  

  // check tweetable
  for (const sort of sorts) {
    if (isTweet) {
      const sn = format('%s_%s', scriptName, sort);

      const savedTweeted = await findSavedTweeted(sn, 'ALL');
      const isFinished = await isFinishedAllGame(genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), 'ALL', sn, cause));
      } else {
        dispTargets.push({ sort });
      }
    } else {
      dispTargets.push({ sort });
    }
  }

  if (! dispTargets.length) return;

  const manager = await getManager();
  for (const { sort } of dispTargets) {
    const results: BatterResult[] = await manager.query(getQueryBatRc5Npb(teams, col, sort, base));

    const title = format('NPB 最近5試合 優秀%s打者\n(16打席以上%s)\n', titlePart, titleOption ? format('、%s', titleOption) : '');
    const rows = createRows(results);

    if (isTweet) {
      const sn = format('%s_%s', scriptName, sort);

      await tweetMulti(title, rows);
      await saveTweeted(sn, 'ALL', genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), 'ALL', sn));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execBatRc5All = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', scriptName = SC_RC5A) => {
  const titlePart = '打率', col = 'average';
  const createRows = (results: BatterResult[]) => createBatterResultRows(results);

  await execRc5All(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName);
}

/**
 * 
 */
export const execOnbaseRc5All = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', scriptName = SC_BRC5A) => {
  const titlePart = '出塁率', col = 'average_onbase';
  const createRows = (results: BatterResult[]) => createBatterOnbaseResultRows(results);

  await execRc5All(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName);
}

/**
 * 
 */
export const execOpsRc5All = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = 'D', scriptName = SC_ORC5A) => {
  const titlePart = 'OPS', col = 'ops';
  const createRows = (results: BatterResult[]) => createBatterOpsResultRows(results);

  await execRc5All(isTweet, teamArg, leagueArg, sortArg, titlePart, col, createRows, scriptName, '(出塁率 長打率)');
}

/**
 * 
 */
const execRc5All = async (isTweet = true, teamArg = '', leagueArg = '', sortArg = '', titlePart = '', col = '', createRows: (results: BatterResult[]) => string[], scriptName = '', titleOption = '') => {
  const teams = checkArgTMLGForTweet(teamArg, leagueArg);
  let dispTargets = [], sorts = checkArgSort(sortArg);  

  // check tweetable
  for (const team of teams) {
    for (const sort of sorts) {
      if (isTweet) {
        const sn = format('%s_%s', scriptName, sort);

        const savedTweeted = await findSavedTweeted(sn, checkLeague(team));
        const isFinished = await isFinishedGameByLeague(team, genTweetedDay());

        if (savedTweeted || !isFinished) {
          const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
          console.log(format(MSG_F, genTweetedDay(), checkLeague(team), sn, cause));
        } else {
          dispTargets.push({ team, sort });
        }
      } else {
        dispTargets.push({ team, sort });
      }
    }
  }

  if (! dispTargets.length) return;

  const manager = await getManager();
  for (const { team, sort } of dispTargets) {
    const results: BatterResult[] = await manager.query(getQueryBatRc5All(team, col, sort));

    const sortTitle = sort == 'ASC' ? 'ワースト' : 'トップ';
    const title = format('%s打者 最近5試合 %s %s10\n(16打席以上%s)\n', getTeamTitle(leagueArg, team), titlePart, sortTitle, titleOption ? format('、%s', titleOption) : '');
    const rows = createRows(results);

    if (isTweet) {
      const sn = format('%s_%s', scriptName, sort);

      await tweetMulti(title, rows);
      await saveTweeted(sn, checkLeague(team), genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), checkLeague(team), sn));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchRc10Team = async (teamArg = '', leagueArg = '', isTweet = true) => {
  const prevTeams = checkArgTMLG(teamArg, leagueArg);
  let teams = [];

  // check tweetable
  if (isTweet) {
    for (const team of prevTeams) {
      const savedTweeted = await findSavedTweeted(SC_RC10, team);
      const isFinished = await isFinishedGame(team, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), team, SC_RC10, cause));
      } else {
        teams.push(team);
      }
    }
  } else {
    teams = prevTeams;
  }

  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const teamIniEn = getTeamIniEn(team);
    const results = await manager.query(getQueryPitch10Team(team));

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

      let raErClause = format('失%s%s', ra, Number(ra) == 0 && Number(er) == 0 ? '' : format(' 自%s', er));

      rows.push(format(
        '\n%s試 防%s  %s  %s回 %s%s',
        game_cnt, era, p_name, inning, resultClause, raErClause
      ));
    }

    if (isTweet) {
      await tweetMulti(title, rows, footer);
      await saveTweeted(SC_RC10, team, genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), team, SC_RC10));
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execPitchRc10Npb = async (isTweet = true, teamArg = '', leagueArg = '', baseGameCnt = 4, scriptName = SC_RC10N) => {
  const teams = checkArgTMLG(teamArg, leagueArg);

  // check tweetable
  if (isTweet) {
    const savedTweeted = await findSavedTweeted(scriptName, 'ALL');
    const isFinished = await isFinishedAllGame(genTweetedDay());

    if (savedTweeted || !isFinished) {
      const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
      console.log(format(MSG_F, genTweetedDay(), 'ALL', scriptName, cause));
      return;
    }
  }

  const manager = await getManager();
  const results = await manager.query(getQueryPitch10TeamNpb(teams, baseGameCnt));

  const title = format('NPB 最近10試合 優秀中継ぎ投手\n(%s登板以上連続無失点)\n', baseGameCnt);
  const rows = [];

  for (const result of results) {
    const { tm, p_name, hold, save, win, lose, game_cnt, inning } = result;

    let resultClause = format('%s%s%s%s',
      Number(win) > 0 ? format('%s勝', win) : '',
      Number(lose) > 0 ? format('%s敗', lose) : '',
      Number(hold) > 0 ? format('%sH', hold) : '',
      Number(save) > 0 ? format('%sS', save) : ''
    );
    resultClause = resultClause.length > 0 ? resultClause + ' ' : resultClause;

    rows.push(format(
      '\n%s試  %s(%s)  %s回 %s',
      game_cnt, p_name, tm, inning, resultClause
    ));
  }

  if (isTweet) {
    await tweetMulti(title, rows);
    await saveTweeted(scriptName, 'ALL', genTweetedDay());
    console.log(format(MSG_S, genTweetedDay(), 'ALL', scriptName));
  } else {
    displayResult(title, rows);
  }
}

/**
 * 
 */
export const execPitchStrikeSwMsGame = async (isTweet = true, dayArg = '', strikeArg = '') => {
  interface Result { team: string, pitcher: string, swing_cnt: string, missed_cnt: string }

  const day = checkArgDay(dayArg);
  const prevStrikes = checkArgStrikeType(strikeArg);
  let strikes = [];

  // check tweetable
  if (isTweet) {
    for (const strike of prevStrikes) {
      const savedTweeted = await findSavedTweeted(SC_PSG, strike);
      const isLeft = await isLeftMoundStarterAllGame(day);

      if (savedTweeted || !isLeft) {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, strike, SC_PSG, cause));
      } else {
        strikes.push(strike);
      }
    }
  } else {
    strikes = prevStrikes; 
  }

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
      await tweetMulti(title, rows);
      await saveTweeted(SC_PSG, strike, day);
      console.log(format(MSG_S, day, strike, SC_PSG));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchTypeStarter3innings = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '', scriptName = SC_PTS3) => {
  
  const isGetFinished = async (day = '', team = '') => await isFinishedInningPitchStarterByTeam(day, team, 3);
  const whereIngNum = 'AND ing_num BETWEEN 1 AND 3';
  await doExecPitchType(isTweet, dayArg, teamArg, leagueArg, scriptName, isGetFinished, 'not finished 3innings starter', ' (3回終了時点)', whereIngNum);
}

/**
 * 
 */
export const execPitchTypeStarter6innings = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '', scriptName = SC_PTS6) => {
  
  const isGetFinished = async (day = '', team = '') => await isFinishedInningPitchStarterByTeam(day, team, 6);
  const whereIngNum = 'AND ing_num BETWEEN 1 AND 6';
  await doExecPitchType(isTweet, dayArg, teamArg, leagueArg, scriptName, isGetFinished, 'not finished 6innings starter', ' (6回終了時点)', whereIngNum);
}

/**
 * 
 */
export const execPitchType = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '', scriptName = SC_PT) => {

  const isGetFinished = async (day, team) => await isLeftMoundStarterByTeam(day, team);
  await doExecPitchType(isTweet, dayArg, teamArg, leagueArg, scriptName, isGetFinished, 'not left mound starter');
}

/**
 * 
 */
const doExecPitchType = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '', scriptName = SC_PT, isGetFinished, logMsg = '', option = '', whereIngNum = '') => {

  const day = checkArgDay(dayArg);
  const prevTeams = checkArgTMLG(teamArg, leagueArg);
  let teams = [];

  // check tweetable
  if (isTweet) {
    for (const team of prevTeams) {
      const savedTweeted = await findSavedTweeted(scriptName, team);
      const isLeft = await isGetFinished(day, team);

      if (savedTweeted || !isLeft) {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? logMsg : 'other';
        console.log(format(MSG_F, day, team, scriptName, cause));
      } else {
        teams.push(team);
      }
    }
  } else {
    teams = prevTeams;
  }

  if (! teams.length) return;

  interface Result { team: string, pitcher: string, pitch_type: string, pitch_type_cnt: string }
  interface PitchType { type: string, cnt: number }
  interface PitcherPitchType { team: string, pitcher: string, types: PitchType[] }

  const manager = await getManager();
  // target day info
  const results: Result[] = await manager.query(`
    SELECT 
      p_team AS team,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      pitch_type,
      COUNT(pitch_type) AS pitch_type_cnt
    FROM (
      SELECT 
        p_team, current_pitcher_name, pitch_cnt, pitch_type
      FROM
        baseball_2020.debug_pitch_base
      WHERE
        date = '${day}'
        AND current_pitcher_order = 1
        AND p_team IN ('${teams.join("' , '")}')
        ${whereIngNum}
      GROUP BY p_team , current_pitcher_name , pitch_cnt , pitch_type
    ) AS A
    GROUP BY p_team, current_pitcher_name , pitch_type
    ORDER BY p_team DESC, current_pitcher_name DESC, pitch_type_cnt DESC
  `);

  // total info TODO

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
    const teamIniEn = getTeamIniEn(team);

    rows.push(format('\n%s\n%s投手 (投球数 %s)%s\n', teamFullNames[teamIniEn], pitcher, total, option));

    for (const typeUnit of types) {
      const { type, cnt } = typeUnit;
      rows.push(format('\n%s (%s%) ', cnt, Math.round(cnt * 100 / total * 10) / 10), type);
    }

    const title = format('%s 先発投手 投球球種内容\n', moment(day, 'YYYYMMDD').format('M/D'));
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (isTweet) {
      await tweetMulti(title, rows, footer);
      await saveTweeted(scriptName, team, day);
      console.log(format(MSG_S, day, team, scriptName));
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
export const execPitchCourse = async (isTweet = true, dayArg = '', scriptName = SC_PC) => {
  interface Result { team: string, pitcher: string, b_high: string, s_high: string, b_mid: string, s_mid: string, b_low: string, s_low: string, total: number, target_ave: number }

  const day = checkArgDay(dayArg);
  const prevCourses = ['s_low', 'b_high'];
  let courses = [];

  // check tweetable
  if (isTweet) {
    for (const course of prevCourses) {
      const sn = format('%s_%s', scriptName, course);
      const savedTweeted = await findSavedTweeted(sn, 'ALL');
      const isLeft = await isLeftMoundStarterAllGame(day);

      if (savedTweeted || !isLeft) {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, 'ALL', scriptName, cause));
      } else {
        courses.push(course);
      }
    }
  } else {
    courses = prevCourses;
  }

  if (! courses.length) return;

  const manager = await getManager();
  for (const course of courses) {
    // target day info
    const results: Result[] = await manager.query(getQueryPitchCourse(day));

    for (const idx in results) {
      const { b_high, s_high, b_mid, s_mid, s_low, b_low } = results[idx];
      results[idx].total = Number(b_high) + Number(s_high) + Number(b_mid) + Number(s_mid) + Number(s_low) + Number(b_low);
      results[idx].target_ave = Math.round(Number(results[idx][course]) * 100 / results[idx].total * 10) / 10;
    }

    // sort by high average
    results.sort((a, b) => b.target_ave - a.target_ave);

    const title = format('%s 先発投手\n%s 投球率\n', moment(day, 'YYYYMMDD').format('M/D'), courseTypes[course]);
    let rows: string[] = [];
    for (const result of results) {
      const { team, pitcher, total, target_ave } = result;
      rows.push(format('\n%s% (%s/%s)  %s(%s)', target_ave, result[course], total, pitcher, team));
    }

    const sn = format('%s_%s', scriptName, course);
    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(sn, 'ALL', genTweetedDay());
      console.log(format(MSG_S, day, 'ALL', sn));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchGroundFlyStart = async (isTweet = true, dayArg = '', batOutArg = '') => {
  interface Result { team: string, pitcher: string, fly_out_cnt: string, ground_out_cnt: string }

  const day = checkArgDay(dayArg);
  const prevBatOuts = checkArgBatOut(batOutArg);
  let batOuts = [];

  // check tweetable
  if (isTweet) {
    for (const batOut of prevBatOuts) {
      const scriptName = format('%s_%s', SC_GFS, batOut.slice(0, 1));
      const savedTweeted = await findSavedTweeted(scriptName, 'ALL');
      const isLeft = await isLeftMoundStarterAllGame(day);

      if (savedTweeted || !isLeft) {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, day, 'ALL', scriptName, cause));
      } else {
        batOuts.push(batOut);
      }
    }
  } else {
    batOuts = prevBatOuts;
  }

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
      await tweetMulti(title, rows);

      const scriptName = format('%s_%s', SC_GFS, batOut.slice(0, 1));
      await saveTweeted(scriptName, 'ALL', day);
      console.log(format(MSG_S, day, 'ALL', scriptName));
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

  // check tweetable
  if (isTweet) {
    const savedTweeted = await findSavedTweeted(SC_POS, 'ALL');
    const isLeft = await isLeftMoundStarterAllGame(day);

    if (savedTweeted || !isLeft) {
      const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
      console.log(format(MSG_F, day, 'ALL', SC_POS, cause));
      return;
    }
  }

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
    await tweetMulti(title, rows);
    await saveTweeted(SC_POS, 'ALL', day);
    console.log(format(MSG_S, day, 'ALL', SC_POS));
  } else {
    displayResult(title, rows);
  }
}

/**
 * 
 */
export const execDayOfWeekStand = async (isTweet = true, leagueArg = '', dayOfWeekArg = '', scriptName = SC_DS) => {
  const dayOfWeek = checkArgDow(Number(dayOfWeekArg));
  const datecClause = `DAYOFWEEK(date) = ${dayOfWeek}`;
  const periodClause = format('%s', dayOfWeekArr[dayOfWeek]);

  await execStand(isTweet, leagueArg, periodClause, datecClause, scriptName);
}

/**
 * 
 */
export const execWeekStand = async (isTweet = true, leagueArg = '', dayArg = '', scriptName = SC_WS) => {
  const { firstDay, lastDay, firstDayStr, lastDayStr } = checkArgTargetDayOfWeek(dayArg);
  const dateClause = `date BETWEEN '${firstDayStr}' AND '${lastDayStr}'`;
  const periodClause = format('%s〜%s', firstDay.format('M/D'), lastDay.format('M/D'));

  await execStand(isTweet, leagueArg, periodClause, dateClause, scriptName);
}

/**
 * 
 */
export const execMonthStand = async (isTweet = true, leagueArg = '', monthArg = '', scriptName = SC_MS) => {
  const { month } = checkArgM(monthArg);
  const dateClause = `DATE_FORMAT(STR_TO_DATE(date, '%Y%m%d'), '%c') = ${month}`;
  const periodClause = format('%s月', month);

  await execStand(isTweet, leagueArg, periodClause, dateClause, scriptName);
}

/**
 * 
 */
const execStand = async (isTweet: boolean, league: string, periodClause: string, dateClause: string, scriptName: string) => {
  let teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet('', league);
  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, league);
      const isFinished = await isFinishedGameByLeague(teams, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), league, scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }
  
  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results: any[] = await manager.query(getQueryStand(teams, dateClause));
    
    let prevTeamSavings = 0;
    const title = format('%s %s 成績\n', getTeamTitle(league, teams), periodClause);
    const rows = [];

    const winRateArray: number[] = results.map(({ win_rate }) => Number(win_rate));
    winRateArray.sort((a, b) => b - a);

    for (let idx in results) {
      const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = results[idx];
      const nowTeamSavings = Number(win_count) - Number(lose_count);
      const teamIniEn = getTeamIniEn(team_initial_kana);

      rows.push(format(
        '\n%s %s %s\n%s勝%s敗%s 率%s 差%s\n',
        rankCircle[winRateArray.indexOf(Number(win_rate)) + 1], teamFullNames[teamIniEn], teamHashTags[team_initial], win_count, lose_count,
        draw_count > 0 ? format('%s分', draw_count) : '', trimRateZero(win_rate),
        Number(idx) > 0 ? (prevTeamSavings - nowTeamSavings) / 2 : '-'
      ));  

      prevTeamSavings = nowTeamSavings;
    }

    // split top3 and bottom 3
    const newRows = [rows.slice(0, 3).join(''), rows.slice(3, 6).join('')];

    if (isTweet) {
      await tweetMulti(title, newRows);
      await saveTweeted(scriptName, league, genTweetedDay());
    } else {
      displayResult(title, newRows);
    }
  }
}

/**
 * 
 */
export const execDayOfWeekStandPerResultTue = async (team = '', league = '', dayOfWeekArg = '3') => {
  const dayOfWeek = checkArgDow(Number(dayOfWeekArg));
  const periodClause = format('%s', dayOfWeekArr[dayOfWeek]);
  let teamsArray = checkArgTMLGForTweet(team, league);
  
  if (! teamsArray.length) return;
  const manager = await getManager();

  for (const res of ['win', 'lose']) {
    for (const teams of teamsArray) {
      const results = [];
      for (const team of teams) {
        const getDateClause = async () => {
          const results: { date: string }[] = await manager.query(getQueryResultTue(team, res));

          const dateClauses = [];
          for (const { date } of results) {
            const thisWeekWed = moment(date, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
            const nextWeekSun = moment(date, 'YYYYMMDD').add(1, 'weeks').day(0).format('YYYYMMDD');
            dateClauses.push(`(date BETWEEN ${thisWeekWed} AND ${nextWeekSun})`);
          }

          return dateClauses.join(' OR ');
        }
        
        const result: any[] = await manager.query(getQueryStandTue(team, await getDateClause()));
        if (result.length) for (const row of result) { results.push(row); }
      }
      // sort by win_rate DESC
      results.sort((a, b) => Number(b.win_rate) - Number(a.win_rate));

      const title = format("%s %sに%s週の残り5試合成績\n", getTeamTitle(league, teams, team), periodClause, res == 'win' ? '勝った' : '負けた');
      const rows = [];
      for (let idx in results) {
        const { team_initial_kana, team_initial, game_cnt, win_count, lose_count, draw_count, win_rate } = results[idx];

        rows.push(format(
          "\n%s  %s試 %s勝%s敗%s %s %s",
          team_initial_kana, game_cnt, win_count, lose_count,
          draw_count > 0 ? format("%s分", draw_count) : '',
          trimRateZero(win_rate), teamHashTags[team_initial]
        ));  
      }

      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execDayOfWeekBatChampNpb = async (isTweet = true, team = '', league = '', dayOfWeekArg = '', base = DOW_BAT_NPB_BASE, scriptName = SC_DBCN) => {
  const dayOfWeek = checkArgDow(Number(dayOfWeekArg));
  const periodClause = format('%s', dayOfWeekArr[dayOfWeek]);
  const dateClause = `DAYOFWEEK(date) = ${dayOfWeek}`;
  const teams = checkArgTMLG(team, league);

  await execBatChampNpb(isTweet, teams, dateClause, periodClause, base, scriptName);
}

/**
 * 
 */
const execBatChampNpb = async (isTweet = true, teams: string[] = [], dateClause = '', periodClause = '', base = '', scriptName = '') => {

  // check tweetable
  if (isTweet) {
    const savedTweeted = await findSavedTweeted(scriptName, 'ALL');
    const isFinished = await isFinishedAllGame(genTweetedDay());

    if (savedTweeted || !isFinished) {
      const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
      console.log(format(MSG_F, genTweetedDay(), 'ALL', scriptName, cause));
      return;
    }
  }

  const manager = await getManager();

  const results: BatterResult[] = await manager.query(getQueryBatChampNpb(teams, dateClause, base));
  const title = format('NPB %s 優秀打率打者\n(打率%s以上)\n', periodClause, trimRateZero(base));
  const rows = createBatterResultRows(results);

  if (isTweet) {
    await tweetMulti(title, rows);
    await saveTweeted(scriptName, 'ALL', genTweetedDay());
    console.log(format(MSG_S, genTweetedDay(), 'ALL', scriptName));
  } else {
    displayResult(title, rows);
  }
}

/**
 * 
 */
export const execDayOfWeekBatChamp = async (isTweet = true, team = '', league = '', dayOfWeekArg = '', scriptName = SC_DBC) => {
  const dayOfWeek = checkArgDow(Number(dayOfWeekArg));
  const periodClause = format('%s', dayOfWeekArr[dayOfWeek]);
  const dateClause = `DAYOFWEEK(date) = ${dayOfWeek}`;

  await execBatChamp(isTweet, team, league, dateClause, periodClause, scriptName);
}

/**
 * 
 */
export const execWeekBatChamp = async (isTweet = true, team = '', league = '', day = '', scriptName = SC_WBC) => {
  const { firstDay, lastDay, firstDayStr, lastDayStr } = checkArgTargetDayOfWeek(day);
  const periodClause = format('%s〜%s', firstDay.format('M/D'), lastDay.format('M/D'));
  const dateClause = `date BETWEEN '${firstDayStr}' AND '${lastDayStr}'`;

  await execBatChamp(isTweet, team, league, dateClause, periodClause, scriptName);
}

/**
 * 
 */
export const execMonthBatChamp = async (isTweet = true, team = '', league = '', monthArg = '', scriptName = SC_MBC) => {
  const { month, firstDay, lastDay } = checkArgM(monthArg);
  const periodClause = format('%s月', month);
  const dateClause = `date BETWEEN '${firstDay}' AND '${lastDay}'`;

  await execBatChamp(isTweet, team, league, dateClause, periodClause, scriptName);
}

/**
 * 
 */
const execBatChamp = async (isTweet = true, team = '', league = '', dateClause = '', periodClause = '', scriptName = '') => {
  let teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet(team, league);

  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, checkLeague(teams));
      const isFinished = await isFinishedGameByLeague(teams, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), checkLeague(teams), scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }

  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results: BatterResult[] = await manager.query(getQueryBatChamp(teams, dateClause, team));

    const title = format("%s打者 %s 打率 トップ10\n", getTeamTitle(league, teams, team), periodClause);

    const rows = createBatterResultRows(results);

    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(scriptName, checkLeague(teams), genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), checkLeague(teams), scriptName));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execRelieverAve = async (isTweet = true, leagueArg = '') => {
  let league = leagueArg;
  const teamsArray = checkArgTMLGForTweet('', leagueArg);
  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results = await manager.query(`
      SELECT
        L.team,
        ROUND(L.reliever_cnt / R.game_cnt, 2) AS ave,
        L.reliever_cnt,
        R.game_cnt,
        '' AS eol
      FROM
        (
          SELECT
            p_team AS team,
            COUNT(name) AS reliever_cnt
          FROM baseball_2020.debug_stats_pitcher sp
          WHERE sp.order > 1
          GROUP BY p_team
        ) L
        LEFT JOIN
          (
            SELECT
              team_initial_kana AS team,
              SUM(game_cnt) AS game_cnt
            FROM baseball_2020.game_cnt_per_month
            GROUP BY team_initial_kana
          ) R
        ON  L.team = R.team
      WHERE L.team IN('${teams.join("', '")}')
      ORDER BY L.reliever_cnt / R.game_cnt DESC
    `);

    const title = format("%s 1試合平均 中継ぎ投手数\n", getTeamTitle(league, teams));
    const rows = [];

    for (const result of results) {
      const { team, ave, reliever_cnt, game_cnt } = result;
      const teamIniEn = getTeamIniEn(team);

      rows.push(format(
        "\n%s  %s (%s登板 %s試合) %s",
        team, ave, reliever_cnt, game_cnt, teamHashTags[teamIniEn]
      ));  

    }

    if (isTweet) {
      //  const tweetedDay = genTweetedDay();
      //  const savedTweeted = await findSavedTweeted(SC_WS, league);
      //  const isFinished = await isFinishedGameByLeague(teams, tweetedDay);
      //  if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows);
      //    await saveTweeted(SC_WS, league, tweetedDay);
      //    console.log(format(MSG_S, tweetedDay, league, SC_WS));
      //  } else {
      //    const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
      //    console.log(format(MSG_F, tweetedDay, league, SC_WS, cause));
      //  }
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execMonthBatTitle = async (isTweet = true, teamArg = '', leagueArg = '', monthArg = '', scriptName = format('%s_%s', SC_MT, 'pitch')) => {
  let team = teamArg, league = leagueArg, teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet(teamArg, leagueArg);
  const { month, firstDay, lastDay } = checkArgM(monthArg);

  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, team ? team : league);

      let isFinished = false;
      if (team) isFinished = await isFinishedGame(teams, genTweetedDay());
      if (league || teams.length == 6) isFinished = await isFinishedGameByLeague(teams, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), team ? team : league, scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }

  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    // except `steam base`
    const regResults = await manager.query(`
      SELECT
        REPLACE(current_batter_name, ' ', '') AS batter,
        base.b_team AS tm,
        SUM(is_pa) AS pa,
        SUM(is_ab) AS bat,
        SUM(is_hit) AS hit,
        SUM(is_onbase) AS onbase,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
        ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
        m.hr,
        m.rbi,
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
            (date BETWEEN '${firstDay}' AND '${lastDay}') AND 
            CHAR_LENGTH(b_team) > 0) AS game_cnt_base
        GROUP BY b_team
      ) gm ON base.b_team = gm.b_team
      -- 本塁打、打点
      LEFT JOIN (
        SELECT 
          b_team, name, SUM(hr) AS hr, SUM(rbi) AS rbi, SUM(sb) AS sb
        FROM
          baseball_2020.debug_stats_batter
        WHERE
          (date BETWEEN '${firstDay}' AND '${lastDay}')
        GROUP BY name , b_team
          ) m ON base.b_team = m.b_team AND base.current_batter_name = m.name
      WHERE
        is_pa = 1 AND 
        base.b_team IN ('${teams.join("', '")}') AND 
        date BETWEEN '${firstDay}' AND '${lastDay}'
      GROUP BY current_batter_name, base.b_team, game_cnt
      HAVING SUM(is_pa) >= 3.1 * game_cnt AND SUM(is_ab) > 0
      ORDER BY average DESC;
    `);

    // only `steal base`
    const results = await manager.query(`
      SELECT
        b_team AS tm,
        REPLACE(name, ' ', '') AS batter,
        SUM(sb) AS sb
      FROM
        baseball_2020.debug_stats_batter
      WHERE
        (date BETWEEN '${firstDay}' AND '${lastDay}')
        AND b_team IN ('${teams.join("', '")}')
      GROUP BY
        name,
        b_team
      ORDER BY sb DESC
    `);

    /**
     * 
     */
    const createInnerRow = results => {
      let innerRow = '';
      for (const { tm, batter } of results) {
        innerRow += format('%s%s、', batter, team ? '' : format('(%s)', tm));
      }
      return innerRow.slice(0, -1);
    }

    /**
     * 
     */
    const dispBestRatePlayer = (title: string, results: any[]) => {
      let bestScore = '0';
      for (const { [title]: item } of results) {
        if (Number(item) >= Number(bestScore)) bestScore = item;
      }
      const resultsBestScore = results.filter(({ [title]: item }) => item == bestScore);
      return { bestScore, innerRow: createInnerRow(resultsBestScore) };
    }

    /**
     * 
     */
    const dispBestPlayer = (title: string, results: any[]) => {
      let bestScore = 0;
      for (const { [title]: item } of results) {
        if (Number(item) >= bestScore) bestScore = Number(item);
      }
      const resultsBestScore = results.filter(({ [title]: item }) => Number(item) == bestScore);
      return { bestScore, innerRow: createInnerRow(resultsBestScore) };
    }

    const title = format("%s %s月 %s打撃タイトル\n", getTeamTitle(league, teams, team), month, team ? 'チーム内' : '');
    const rows = [];

    // average
    const { bestScore: bestAve, innerRow: innerRowAve } = dispBestRatePlayer('average', regResults);
    rows.push(format('\n首位打者  %s  %s', trimRateZero(bestAve), innerRowAve));

    // hit
    const { bestScore: bestHit, innerRow: innerRowHit } = dispBestPlayer('hit', regResults);
    rows.push(format('\n最多安打  %s安打  %s', bestHit, innerRowHit));

    // hr
    const { bestScore: bestHr, innerRow: innerRowHr } = dispBestPlayer('hr', regResults);
    rows.push(format('\n最多本塁打  %s本塁打  %s', bestHr, innerRowHr));

    // hr
    const { bestScore: bestRbi, innerRow: innerRowRbi } = dispBestPlayer('rbi', regResults);
    rows.push(format('\n最多打点  %s打点  %s', bestRbi, innerRowRbi));

    // onbase
    const { bestScore: bestAveOnbase, innerRow: innerRowAveOnbase } = dispBestRatePlayer('average_onbase', regResults);
    rows.push(format('\n最高出塁率  %s  %s', trimRateZero(bestAveOnbase), innerRowAveOnbase));

    // sb
    const { bestScore: bestSb, innerRow: innerRowSb } = dispBestPlayer('sb', results);
    rows.push(format('\n最多盗塁  %s  %s', bestSb, innerRowSb));

    // add hashtags
    if (team) rows.push(format('\n%s', teamHashTags[team]));

    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(scriptName, team ? team : league, genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), team ? team : league, scriptName));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execMonthPitchTitle = async (isTweet = true, teamArg = '', leagueArg = '', monthArg = '', scriptName = format('%s_%s', SC_MT, 'bat')) => {
  let team = teamArg, league = leagueArg, teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet(teamArg, leagueArg);

  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, team ? team : league);

      let isFinished = false;
      if (team) isFinished = await isFinishedGame(teams, genTweetedDay());
      if (league || teams.length == 6) isFinished = await isFinishedGameByLeague(teams, genTweetedDay());

      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), team ? team : league, scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }

  if (! teamsArray.length) return;

  const { month } = checkArgM(monthArg);

  const manager = await getManager();
  for (const teams of teamsArray) {
    // about starter era
    const regResults: any[] = await manager.query(`
      SELECT
        p_team AS tm,
        REPLACE(name, ' ', '') AS pitcher,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
        team_game_cnt,
        SUM(outs) DIV 3 AS inning_int,
        '' AS eol
      FROM
        baseball_2020.stats_pitcher sp
        LEFT JOIN game_info gi ON gi.id = sp.game_info_id
        LEFT JOIN (
          SELECT
            team_initial_kana,
            game_cnt AS team_game_cnt
          FROM
            baseball_2020.game_cnt_per_month
          WHERE
            month = ${month}
        ) game ON sp.p_team = game.team_initial_kana
      WHERE
        sp.order = 1
        AND DATE_FORMAT(STR_TO_DATE(gi.date, '%Y%m%d'), '%c') = ${month}
        AND p_team IN ('${teams.join("', '")}')
      GROUP BY name, p_team, team_game_cnt
      HAVING inning_int >= game.team_game_cnt
      ORDER BY era
    `);

    // about all
    const results: any[] = await manager.query(`
      SELECT
        p_team AS tm,
        REPLACE(name, ' ', '') AS pitcher,
        COUNT(name) AS game_cnt,
        COUNT(result = '勝' OR NULL) AS win,
        COUNT(result = '敗' OR NULL) AS lose,
        IFNULL(ROUND(COUNT(result = '勝' OR NULL) / (COUNT(result = '勝' OR NULL) + COUNT(result = '敗' OR NULL)), 3), '-') AS win_rate,
        COUNT(result = 'H' OR NULL) AS hold,
        COUNT(result = '勝' OR NULL) + COUNT(result = 'H' OR NULL) AS hp,
        COUNT(result = 'S' OR NULL) AS save,
        SUM(so) AS so,
        '' AS eol
      FROM
        baseball_2020.stats_pitcher sp
        LEFT JOIN game_info gi ON gi.id = sp.game_info_id
      WHERE
        DATE_FORMAT(STR_TO_DATE(gi.date, '%Y%m%d'), '%c') = ${month}
        AND p_team IN ('${teams.join("', '")}')
      GROUP BY name, p_team
    `);

    /**
     * 
     */
    const dispBestPlayer = title => {
      let bestScore = 0;
      for (const { [title]: item } of results) {
        if (Number(item) >= bestScore) bestScore = Number(item);
      }
      const resultsBestScore = results.filter(({ [title]: item }) => Number(item) == bestScore);
      let innerRow = '';
      for (const { tm, pitcher } of resultsBestScore) {
        innerRow += format('%s%s\n', pitcher, team ? '' : format('(%s)', tm));
      }
      return { bestScore, innerRow };
    }

    const title = format("%s %s月 %s投手タイトル\n", getTeamTitle(league, teams, team), month, team ? 'チーム内' : '');
    const rows = [];

    // era
    const [eraChamp] = regResults;
    if (eraChamp) {
      rows.push(format('\n◆最優秀防御率  %s\n%s%s\n', eraChamp.era, eraChamp.pitcher, team ? '' : format('(%s)', eraChamp.tm)));
    } else {
      rows.push('\n◆最優秀防御率\n該当者なし\n');
    }

    // win_rate
    const baseWin = 3;
    const resultsMoreThenBase = results.filter(({ win }) => Number(win) >= baseWin);
    resultsMoreThenBase.sort((a, b) => Number(b.win_rate) - Number(a.win_rate));
    let bestRate = '0';
    for (const { win_rate } of resultsMoreThenBase) {
      if (Number(win_rate) >= Number(bestRate)) bestRate = win_rate;
    }
    const resultsBestWinRate = resultsMoreThenBase.filter(({ win_rate }) => win_rate == bestRate);
    let innerRowWinRate = '';
    for (const { tm, pitcher } of resultsBestWinRate) {
      innerRowWinRate += format('%s%s\n', pitcher, team ? '' : format('(%s)', tm));
    }
    if (innerRowWinRate) {
      rows.push(format('\n◆最高勝率(月間3勝以上)  %s\n%s', trimRateZero(bestRate), innerRowWinRate));
    } else {
      rows.push('\n◆最高勝率(月間3勝以上)\n該当者なし\n');
    }

    // win
    const { bestScore: bestWin, innerRow: innerRowWin } = dispBestPlayer('win');
    rows.push(format('\n◆最多勝利  %s\n%s', bestWin, innerRowWin));

    // save
    const { bestScore: bestSave, innerRow: innerRowSave } = dispBestPlayer('save');
    rows.push(format('\n◆最多セーブ  %s\n%s', bestSave, innerRowSave));

    // hp
    const { bestScore: bestHp, innerRow: innerRowHp } = dispBestPlayer('hp');
    rows.push(format('\n◆最優秀中継ぎ  %sHP\n%s', bestHp, innerRowHp));

    // strike out
    const { bestScore: bestSo, innerRow: innerRowSo } = dispBestPlayer('so');
    rows.push(format('\n◆最多奪三振  %s\n%s', bestSo, innerRowSo));

    // add hashtags
    if (team) rows.push(format('\n%s', teamHashTags[team]));

    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(scriptName, team ? team : league, genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), team ? team : league, scriptName));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execDayBatTeam = async (isTweet = true, leagueArg = '', dayArg = '', scriptName = SC_DBT) => {

  const day = checkArgDay(dayArg);
  const getQuery = (teams) => getQueryDayBatTeam(teams, day);
  const titlePart = format('%s', moment(day, 'YYYYMMDD').format('M/D'));

  await execBatTeam(isTweet, leagueArg, getQuery, titlePart, scriptName);
}

/**
 * 
 */
export const execWeekBatTeam = async (isTweet = true, leagueArg = '', dayArg = '', scriptName = SC_WBT) => {

  const { firstDay, lastDay, firstDayStr, lastDayStr } = checkArgTargetDayOfWeek(dayArg);
  const getQuery = (teams) => getQueryWeekBatTeam(teams, firstDayStr, lastDayStr);
  const titlePart = format('%s〜%s', firstDay.format('M/D'), lastDay.format('M/D'));

  await execBatTeam(isTweet, leagueArg, getQuery, titlePart, scriptName);
}

/**
 * 
 */
export const execMonthBatTeam = async (isTweet = true, leagueArg = '', monthArg = '', scriptName = SC_DBT) => {

  const { month } = checkArgM(monthArg);
  const getQuery = (teams: string[]) => getQueryMonthBatTeam(teams, month);
  const titlePart = format('%s月', month);

  await execBatTeam(isTweet, leagueArg, getQuery, titlePart, scriptName);
}

/**
 * 
 */
const execBatTeam = async (isTweet = true, leagueArg = '', getQuery: (teams: string[]) => string, titlePart = '', scriptName = '') => {
  let teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet('', leagueArg);

  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, checkLeague(teams));
      const isFinished = await isFinishedGameByLeague(teams, genTweetedDay());
      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), checkLeague(teams), scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }

  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results = await manager.query(getQuery(teams));

    const aveArr = getDescSortedArray(results, 'ave');
    const obArr = getDescSortedArray(results, 'onbase_ave');
    const spAveArr = getDescSortedArray(results, 'sp_ave');

    const title = format('%s %s\n打率・出塁率・得点圏打率\n', getTeamTitle(leagueArg, teams), titlePart);
    const tmpRows = [];

    for (const result of results) {
      const { b_team, ave, onbase_ave, sp_ave } = result;
      const teamIniEn = getTeamIniEn(b_team);

      tmpRows.push(format(
        "\n%s %s\n%s%s  %s%s  %s%s\n",
        teamFullNames[teamIniEn], teamHashTags[teamIniEn],
        trimRateZero(ave), getRank(aveArr, ave),
        trimRateZero(onbase_ave), getRank(obArr, onbase_ave),
        trimRateZero(sp_ave), getRank(spAveArr, sp_ave)
      ));
    }

    const rows = devideTmpRows(tmpRows);

    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(scriptName, checkLeague(teams), genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), checkLeague(teams), scriptName));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execPitchRaPerInningStart = async (isTweet = true, teamArg = '', nameArg = '') => {
  const pitcherPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s";
  const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s/%s.json";

  let targetPitchers = [];

  if (!teamArg && !nameArg) {
    console.log('NM=[名前] TM=[チームイニシャル] の指定がないため本日の先発投手を指定します');
    targetPitchers = await getPitcher(pitcherPath, jsonPath);
    if (! targetPitchers.length) {
      console.log('本日の予告先発がいない または ツイート対象の投手がいません');
      return;
    }
  }

  if (teamArg && nameArg) {
    targetPitchers.push({ team: teamArg, pitcher: nameArg, oppoTeam: '' });
  }

  const manager = await getManager();
  for (const { team: targetTeam, pitcher, oppoTeam, isStartGame } of targetPitchers) {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      continue;
    }

    // 雨天中止 or ノーゲーム時
    if (! pitcher) continue;

    // check tweetable
    if (isTweet) {
      const tweetedDay = genTweetedDay();
      const savedTweeted = await findSavedTweeted(SC_PRS, targetTeam);
      if (savedTweeted || !isStartGame) {
        const cause = savedTweeted ? 'done tweet' : isStartGame ? 'other' : 'not start game';
        console.log(format(MSG_F, tweetedDay, targetTeam, SC_PRS, cause));
        continue;
      }
    }

    const results: { inning: string, ra: string }[] = await manager.query(`
      SELECT
        ing_num AS inning,
        SUM(debug_base.plus_score) AS ra
      FROM
        baseball_2020.debug_base
      WHERE
        (away_team_initial = '${team}' OR home_team_initial = '${team}')
        AND CASE
            WHEN away_team_initial = '${team}' THEN inning LIKE '%裏'
            WHEN home_team_initial = '${team}' THEN inning LIKE '%表'
        END
        AND plus_score > 0
        AND current_pitcher_name like '%${pitcher.split(' ').join('%')}%'
      GROUP BY
        ing_num
    `);

    interface OtherInfo { inning, ave_inning, ave_np };
    const otherInfo: OtherInfo[] = await manager.query(getQueryStarterOtherInfo(pitcher, moment().format('YYYYMMDD')));

    if (! otherInfo.length) {
      console.log(format("表示可能なデータがありません TM:[%s] NM:[%s]", team, pitcher));
      continue;
    }

    const { inning, ave_inning, ave_np } = otherInfo[0];
    let [ intPart, decimalPart ] = inning.split('.');
    intPart = decimalPart ? Number(intPart) + 1 : Number(intPart)
    
    const title = format("2020年 %s\n%s投手 イニング別失点数\n", teamFullNames[getTeamIniEn(team)], pitcher.split(' ').join(''));
    const rows = [];
    
    for (let ingNum = 1; ingNum <= intPart; ingNum++) {
      const targetInning = results.find(result => Number(result.inning) == ingNum);

      let inning = targetInning ? targetInning.inning : ingNum;
      let runAllowed = targetInning ? targetInning.ra : 0;
      rows.push(format("\n%s回 %s", inning, runAllowed));
    }

    if (intPart + 1 < 10) rows.push(format("\n(%s回以降未登板)", intPart + 1));
    // null時を除外
    if (ave_inning != null && ave_np != null) {
      rows.push(format("\n\n直近3登板平均\n投球回 %s\n投球数 %s", ave_inning, ave_np));
    }

    const footer = format("\n\n%s\n%s", teamHashTags[targetTeam], oppoTeam ? teamHashTags[oppoTeam] : '');

    if (isTweet) {
      await tweet(title, rows, footer);
      await saveTweeted(SC_PRS, targetTeam, genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), targetTeam, SC_PRS));
    } else {
      displayResult(title, rows, footer);
    }
  }
}

/**
 * 
 */
const execTeamEraDiv = async (isTweet = true, leagueArg = '', pitcherArg = '', titlePart = '', scriptName = '', firstDay = '', lastDay = '') => {
  
  const teamsArray = checkArgTMLGForTweet('', leagueArg);

  let pitchersArray: string[] = [];
  if (! pitcherArg) {
    pitchersArray = ['A', 'S', 'M'];
    console.log('P=[投手種別(A/S/M)] の指定がないため、全体・先発・中継ぎのデータを出力します');
  } else if (pitcherArg != 'S' && pitcherArg != 'M') {
    pitchersArray = ['A', 'S', 'M'];
    console.log('P=[投手種別(A/S/M)] の指定に誤りがあるため、全体・先発・中継ぎのデータを出力します')
  } else {
    pitchersArray = [pitcherArg];
  }

  let targets: {teams: string[], pitcher: string}[] = [];

  // check tweetable
  for (const teams of teamsArray) {
    for (const pitcher of pitchersArray) {
      if (isTweet) {
        const scNm = format('%s_%s', scriptName, pitcher);
        const savedTweeted = await findSavedTweeted(scNm, checkLeague(teams));
        const isFinished = await isFinishedGameByLeague(teams, genTweetedDay());

        if (savedTweeted || !isFinished) {
          const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
          console.log(format(MSG_F, genTweetedDay(), checkLeague(teams), scNm, cause));
        } else {
          targets.push({ teams, pitcher });
        }
      } else {
        targets.push({ teams, pitcher });
      }
    }
  }

  if (! targets.length) return;

  const manager = await getManager();
  for (const { teams, pitcher } of targets) {
    const results = await manager.query(`
      SELECT 
        p_team AS tm,
        CONCAT(
          SUM(outs) DIV 3,
          CASE WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3) ELSE '' END
        ) AS inning,
        SUM(ra) AS ra,
        SUM(er) AS er,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
        '' AS eol
      FROM
        baseball_2020.stats_pitcher sp
      LEFT JOIN game_info gi ON sp.game_info_id = gi.id
      WHERE
        ${pitcher == 'A' ? '' : `sp.order ${pitcher == 'S' ? '=' : '>'} 1 AND`}
        gi.date BETWEEN '${firstDay}' AND '${lastDay}' AND
        p_team IN ('${teams.join("', '")}')
      GROUP BY p_team
      ORDER BY era ASC, inning DESC
    `);

    const pitcherTitle = pitcher == 'A' ? '' : pitcher == 'S' ? '先発' : '中継ぎ';

    const title = format('%s %s %s防御率\n', getTeamTitle(leagueArg, teams), titlePart, pitcherTitle);
    const eraArr = getAscSortedArray(results, 'era');
    const tmpRows = [];
    for (const result of results) {
      const { tm, era, inning, ra, er } = result;
      const teamIniEn = getTeamIniEn(tm);

      tmpRows.push(format(
        '\n%s %s\n%s%s  %s回 %s失点 自責%s\n',
        teamFullNames[teamIniEn], teamHashTags[teamIniEn],
        era, getRank(eraArr, era), inning, ra, er
      ));  
    }

    const rows = devideTmpRows(tmpRows);

    if (isTweet) {
      const scNm = format('%s_%s', scriptName, pitcher);

      await tweetMulti(title, rows);
      await saveTweeted(scNm, checkLeague(teams), genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), checkLeague(teams), scNm));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execWeekTeamEraDiv = async (isTweet = true, isDevide = true, leagueArg = '', pitcherArg = '', dayArg = '') => {
  await execWeekTeamEra(isTweet, isDevide, leagueArg, pitcherArg, dayArg);
}

/**
 * 
 */
export const execMonthTeamEraDiv = async (isTweet = true, isDevide = true, leagueArg = '', pitcherArg = '', dayArg = '') => {
  await execMonthTeamEra(isTweet, isDevide, leagueArg, pitcherArg, dayArg);
}

/**
 * 
 */
export const execDayTeamEra = async (isTweet = true, isDevide = false, leagueArg = '', pitcherArg = '', dayArg = '') => {

  const day = checkArgDay(dayArg);
  const titlePart = format('%s', moment(day, 'YYYYMMDD').format('M/D'));

  if (isDevide) {
    await execTeamEraDiv(isTweet, leagueArg, pitcherArg, titlePart, SC_DTED, day, day);
  } else {
    const getQuery = (teams) => getQueryDayTeamEra(teams, day);
    await execTeamEra(isTweet, leagueArg, getQuery, titlePart, SC_DTE);
  }
}

/**
 * 
 */
export const execWeekTeamEra = async (isTweet = true, isDevide = false, leagueArg = '', pitcherArg = '', dayArg = '') => {

  const { firstDay, lastDay, firstDayStr, lastDayStr } = checkArgTargetDayOfWeek(dayArg);
  const titlePart = format('%s〜%s', firstDay.format('M/D'), lastDay.format('M/D'));

  if (isDevide) {
    await execTeamEraDiv(isTweet, leagueArg, pitcherArg, titlePart, SC_WTED, firstDayStr, lastDayStr);
  } else {
    const getQuery = (teams) => getQueryWeekTeamEra(teams, firstDayStr, lastDayStr);
    await execTeamEra(isTweet, leagueArg, getQuery, titlePart, SC_WTE);
  }
}

/**
 * 
 */
export const execMonthTeamEra = async (isTweet = true, isDevide = false, leagueArg = '', pitcherArg = '', monthArg = '') => {

  const { month, firstDay, lastDay } = checkArgM(monthArg);
  const titlePart = format('%s月', month);

  if (isDevide) {
    await execTeamEraDiv(isTweet, leagueArg, pitcherArg, titlePart, SC_MTED, firstDay, lastDay);
  } else {
    const getQuery = (teams: string[]) => getQueryMonthTeamEra(teams, month);
    await execTeamEra(isTweet, leagueArg, getQuery, titlePart, SC_MTE);
  }
}

/**
 * 
 */
const execTeamEra = async (isTweet = true, leagueArg = '', getQuery: (teams: string[]) => string, titlePart = '', scriptName = SC_WTE) => {
  let teamsArray = [];
  const prevTeamsArray = checkArgTMLGForTweet('', leagueArg);
  // check tweetable
  if (isTweet) {
    for (const teams of prevTeamsArray) {
      const savedTweeted = await findSavedTweeted(scriptName, checkLeague(teams));
      const isFinished = await isFinishedGameByLeague(teams, genTweetedDay());
      if (savedTweeted || !isFinished) {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, genTweetedDay(), checkLeague(teams), scriptName, cause));
      } else {
        teamsArray.push(teams);
      }
    }
  } else {
    teamsArray = prevTeamsArray;
  }

  if (! teamsArray.length) return;

  const manager = await getManager();
  for (const teams of teamsArray) {
    const results: any[] = await manager.query(getQuery(teams));

    const totalEra = getAscSortedArray(results, 'era');
    const starterEra = getAscSortedArray(results, 's_era');
    const midEra = getAscSortedArray(results, 'm_era');

    const title = format('%s %s 防御率\n(全体 先発 中継ぎ)\n', getTeamTitle(leagueArg, teams), titlePart);
    const tmpRows = [];
    for (const result of results) {
      const { tm, era, s_era, m_era } = result;
      const teamIniEn = getTeamIniEn(tm);

      tmpRows.push(format(
        '\n%s %s\n%s%s  %s%s  %s%s\n',
        teamFullNames[teamIniEn], teamHashTags[teamIniEn],
        era, getRank(totalEra, era),
        s_era, getRank(starterEra, s_era),
        m_era, getRank(midEra, m_era)
      ));
    }

    const rows = devideTmpRows(tmpRows);

    if (isTweet) {
      await tweetMulti(title, rows);
      await saveTweeted(scriptName, checkLeague(teams), genTweetedDay());
      console.log(format(MSG_S, genTweetedDay(), checkLeague(teams), scriptName));
    } else {
      displayResult(title, rows);
    }
  }
}

/**
 * 
 */
export const execDayLostOnBase = async (isTweet = true, dayArg = '', scriptName = SC_DLOB) => {
  const day = checkArgDay(dayArg);
  const dateClause = `date = '${day}'`;
  const periodClause = format('%s', moment(day, 'YYYYMMDD').format('M/D'));

  await execLostOnBase(isTweet, day, dateClause, periodClause, scriptName);
}

/**
 * 
 */
export const execWeekLostOnBase = async (isTweet = true, dayArg = '', scriptName = SC_DLOB) => {
  const { firstDay, lastDay, firstDayStr, lastDayStr } = checkArgTargetDayOfWeek(dayArg);
  const day = checkArgDay(dayArg);
  const dateClause = `date BETWEEN '${firstDayStr}' AND '${lastDayStr}'`;
  const periodClause = format('%s〜%s', firstDay.format('M/D'), lastDay.format('M/D'));

  await execLostOnBase(isTweet, day, dateClause, periodClause, scriptName);
}

/**
 * 
 */
export const execMonthLostOnBase = async (isTweet = true, monthArg = '', scriptName = SC_DLOB) => {
  const { month } = checkArgM(monthArg);
  const day = checkArgDay('');
  const dateClause = `DATE_FORMAT(STR_TO_DATE(date, '%Y%m%d'), '%c') = ${month}`;
  const periodClause = format('%s月', month);

  await execLostOnBase(isTweet, day, dateClause, periodClause, scriptName);
}

/**
 * 
 */
const execLostOnBase = async (isTweet = true, day = '', dateClause = '', periodClause = '', scriptName = '') => {

  // check tweetable
  if (isTweet) {
    const savedTweeted = await findSavedTweeted(scriptName, 'ALL');
    const isFinished = await isFinishedAllGame(day);

    if (savedTweeted || !isFinished) {
      const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
      console.log(format(MSG_F, day, 'ALL', scriptName, cause));
      return;
    }
  }

  const manager = await getManager();
  const results: any[] = await manager.query(getQueryDayLob(dateClause));

  const title = format('%s チーム別 残塁数 (得点)\n', periodClause);
  const rows = [];
  for (const result of results) {
    const { b_team, lob, runs } = result;
    const teamIniEn = getTeamIniEn(b_team);
    rows.push(format(
      '\n%s (%s)  %s',
      lob, runs, teamNames[teamIniEn]
    ));
  }

  if (isTweet) {
    await tweetMulti(title, rows);
    await saveTweeted(scriptName, 'ALL', genTweetedDay());
  } else {
    displayResult(title, rows);
  }
}

/**
 * 
 */
export const execDayRbiHit = async (isTweet = true, dayArg = '', teamArg = '', leagueArg = '', scriptName = SC_DRH) => {
  const prevTeams = checkArgTMLG(teamArg, leagueArg);
  const day = checkArgDay(dayArg);
  const prevDay = moment(day, 'YYYYMMDD').add(-1, 'days').format('YYYYMMDD');

  // check tweetable
  if (isTweet) {
    const savedTweeted = await findSavedTweeted(scriptName, 'ALL');
    const isFinished = await isFinishedAllGame(day);

    if (savedTweeted || !isFinished) {
      const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not finished game' : 'other';
      console.log(format(MSG_F, day, 'ALL', scriptName, cause));
      return;
    }
  }

  interface TotalResult { team: string, batter: string, rbi_hit: number };
  interface TodayResult { team: string, batter: string, inning: string, is_first: boolean, is_tie: boolean, is_win: boolean, is_reversal: boolean };
  const manager = await getManager();

  const totalResults: TotalResult[] = await manager.query(`
    SELECT 
      tm.team_initial_kana AS team, replace(batter, ' ', '') AS batter, SUM(is_rbi_hit) AS rbi_hit
    FROM
        baseball_2020.summary_point sp
    LEFT JOIN game_info gi ON sp.game_info_id = gi.id
    LEFT JOIN team_master tm ON sp.team = tm.team_name
    WHERE
        is_rbi_hit = 1 AND
        (gi.date BETWEEN 20200619 AND ${prevDay})
    GROUP BY tm.team_initial_kana, batter
    ORDER BY rbi_hit DESC
  `);

  const todayResults: TodayResult[] = await manager.query(`
    SELECT 
        inning,
        tm.team_initial_kana AS team,
        replace(batter, ' ', '') AS batter,
        is_first,
        is_tie,
        is_win,
        is_reversal
    FROM
        baseball_2020.summary_point sp
    LEFT JOIN game_info gi ON sp.game_info_id = gi.id
    LEFT JOIN team_master tm ON sp.team = tm.team_name
    WHERE
        is_rbi_hit = 1 AND
        gi.date = ${day}
  `);

  const title = format('%s 本日のタイムリーヒット\n', moment(day, 'YYYYMMDD').format('M/D'));
  const rows: string[] = [];
  for (const todayResult of todayResults) {
    const totalResult = totalResults.find(({ batter, team }) => batter == todayResult.batter && team == todayResult.team);    
    const totalRbiHit = totalResult ? Number(totalResult.rbi_hit) : 0;

    const { inning, team, batter, is_first, is_tie, is_win, is_reversal } = todayResult;

    let flag = '';
    if (is_first) flag = ' 先制';
    if (is_tie) flag = ' 同点';
    if (is_win) flag = ' 勝ち越し';
    if (is_reversal) flag = ' 逆転';

    const batterPart = format('%s(%s)', batter, team);
    const rbiPart = format('%s本目 (%s%s)', totalRbiHit + 1, inning, flag);

    const dupRow = rows.find(row => row.indexOf(batterPart) > -1);
    if (dupRow) {
      rows[rows.indexOf(dupRow)] = format('%s、%s', dupRow, rbiPart);
    } else {
      rows.push(format('\n%s  %s', batterPart, rbiPart));
    }

    if (totalResult) {
      const idx = totalResults.indexOf(totalResult);
      totalResults[idx].rbi_hit = totalRbiHit + 1;
    } else {
      totalResults.push({ team, batter, rbi_hit: 1 });
    }
  }

  if (isTweet) {
    await tweetMulti(title, rows);
    await saveTweeted(scriptName, 'ALL', day);
    console.log(format(MSG_S, day, 'ALL', scriptName));
  } else {
    displayResult(title, rows);
  }
}
