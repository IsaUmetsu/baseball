import { format } from 'util';
import * as moment from 'moment';
import * as twitter from "twitter-text";
import * as yargs from 'yargs';
import { batOuts, dayOfWeekArr, FORMAT_BATTER, FORMAT_BATTER_HR, FORMAT_BATTER_RBI, leagueList, posArgDic, strikeTypes, teamArray, teamList, pitcherRoles, pitchTypes, teamNames, FORMAT_BATTER_TEAM, FORMAT_BATTER_ONBASE, FORMAT_BATTER_BB, FORMAT_BATTER_HBP, FORMAT_BATTER_HIT, sortType, FORMAT_BATTER_OPS, rankCircle } from '../constant';
import { countFiles, getJson } from './fs';
import { BatterResult } from '../type/jsonType';

/**
 * 
 */
export const getIsDevide = () => {
  return yargs.count('devide').alias('d', 'devide').argv.devide > 0;
}

/**
 * 
 */
export const checkArgI = (importArg: string) => {
  let importGame = false, importPitch = false, importBat = false;
  if (! importArg) {
    importGame = true, importPitch = true, importBat = true;
  } else {
    const importTypes = importArg.split('');
    for (let idx in importTypes) {
      const importType = importTypes[idx];
      if (importType == 'G') importGame = true;
      if (importType == 'P') importPitch = true;
      if (importType == 'B') importBat = true;
    }
    if (! (importGame || importPitch || importBat)) console.log('I=[インポート種別(G/P/B)] に誤りがあるためインポートは実行されません');
  }

  return { importGame, importPitch, importBat };
}

/**
 * リーグ指定時は指定リーグチームを、指定なしの場合は12球団のかなイニシャルを返す
 */
export const checkArgLG = (leagueArg: string) => {
  const leagueInitialArray = Object.keys(leagueList);
  // TM and LG is none then TM
  let teams = [];
  // TM is none and LG then LG
  if (leagueArg) {
    if (leagueInitialArray.indexOf(leagueArg) == -1) {
      console.log('LG=正しいリーグイニシャル[P/C] を指定してください');
    } else {
      teams = teamList[leagueArg];
    }
  } else {
    console.log('LG=[リーグイニシャル] の指定がないため12球団から選択します');
    const { P, C } = teamList;
    teams = P.concat(C);
  }
  return teams;
}

/**
 * 
 */
export const checkArgTMLG = (teamArg: string, leagueArg: string): string[] => {
  const teamInitialArray = Object.keys(teamArray);
  const leagueInitialArray = Object.keys(leagueList);
  // TM and LG is none then TM
  let teams = [];
  if (teamArg) {
    if (teamInitialArray.indexOf(teamArg) == -1) {
      console.log('TM=正しいチームイニシャル を指定してください');
    } else {
      teams.push(teamArray[teamArg]);
    }
  }
  // TM is none and LG then LG
  if (leagueArg) {
    if (leagueInitialArray.indexOf(leagueArg) == -1) {
      console.log('LG=正しいリーグイニシャル[P/C] を指定してください');
    } else {
      teams = teamList[leagueArg];
    }
  }
  // TM is none and LG is none then NPB
  if (! teamArg && ! leagueArg) {
    console.log('TM=[チームイニシャル] LG=[リーグイニシャル] の指定がないため12球団から選択します');
    const { P, C } = teamList;
    teams = P.concat(C);
  }
  // TM and LG then error
  if (teamArg && leagueArg) {
    console.log('TM=[チームイニシャル] LG=[リーグイニシャル] のどちらかを指定するか、両方指定しないでください');
    teams = [];
  }

  return teams;
}

/**
 * 
 */
export const checkArgTMLGForTweet = (teamArg: string, leagueArg: string): string[][] => {
  const teamInitialArray = Object.keys(teamArray);
  const leagueInitialArray = Object.keys(leagueList);
  // TM and LG is none then TM
  let teams = [];
  if (teamArg) {
    if (teamInitialArray.indexOf(teamArg) == -1) {
      console.log('TM=正しいチームイニシャル を指定してください');
    } else {
      teams.push([teamArray[teamArg]]);
    }
  }
  // TM is none and LG then LG
  if (leagueArg) {
    if (leagueInitialArray.indexOf(leagueArg) == -1) {
      console.log('LG=正しいリーグイニシャル[P/C] を指定してください');
    } else {
      teams = [teamList[leagueArg]];
    }
  }
  // TM is none and LG is none then NPB
  if (! teamArg && ! leagueArg) {
    console.log('TM=[チームイニシャル] LG=[リーグイニシャル] の指定がないため2リーグごとに出力します');
    const { P, C } = teamList;
    teams = [P, C];
  }
  // TM and LG then error
  if (teamArg && leagueArg) {
    console.log('TM=[チームイニシャル] LG=[リーグイニシャル] のどちらかを指定するか、両方指定しないでください');
    teams = [];
  }

  return teams;
}

/**
 * 
 */
export const checkLeague = (teams: string[]) => {
  let league = '';
  if (teams.indexOf('ソ') > -1) league = 'P';
  if (teams.indexOf('巨') > -1) league = 'C';
  return league;
}

/**
 * 
 */
export const checkArgM = (monthArg: string) => {
  let month = Number(monthArg);

  if (! monthArg) {
    month = Number(moment().format('M'));
    console.log(format('M=[月] を指定がないため今月(%d月)のデータを出力します', month));
  } else if (month < 6 || 12 < month) {
    console.log('M=[月] は6〜12月の間で入力してください');
    month = 0;
  }

  const fmYYYYM = format("2020%d", month);

  return {
    month,
    firstDay: moment(fmYYYYM, "YYYYM").startOf('month').format('YYYYMMDD'),
    lastDay: moment(fmYYYYM, "YYYYM").endOf('month').format('YYYYMMDD')
  }
}

/**
 * 
 */
export const checkArgTargetDayOfWeek = (dayArg: string) => {
  let targetDay;
  if (! dayArg) {
    console.log('D=[日付] の指定がないため実行日を指定します');
    targetDay = moment();
  } else {
    targetDay = moment(format("2020%s", dayArg), "YYYYMMDD");
  }

  // [週始] 指定日が日曜なら前の週の月曜を指定、月曜〜土曜ならその週の月曜指定
  let firstDay: moment.Moment;
  if (targetDay.day() > 0) {
    firstDay = moment(targetDay).day(1);
  } else {
    firstDay = moment(targetDay).add(-7, 'days').day(1);
  }
  // [週終] 指定日が日曜なら前の週の土曜を指定、月曜〜土曜ならその次の週の日曜を指定
  let lastDay: moment.Moment;
  if (targetDay.day() > 0) {
    lastDay = moment(targetDay).add(7, 'days').day(0);
  } else {
    lastDay = moment(targetDay);
  }

  return {
    firstDay,
    lastDay,
    firstDayStr: firstDay.format('YYYYMMDD'),
    lastDayStr: lastDay.format('YYYYMMDD')
  }
}

/**
 * 
 */
export const checkArgDow = (dayOfWeekArg: number) => {
  let dayOfWeek = dayOfWeekArg;

  if (! dayOfWeek) {
    dayOfWeek = moment().day() + 1; // mysql の DAYOFWEEK() に合わせるため +1
    console.log('D=[曜日番号] を指定がないため本日(%s)の結果を出力します', dayOfWeekArr[dayOfWeek]);
  }

  return dayOfWeek;
}

/**
 * 
 */
export const trimRateZero = (rate: string): string => {
  return rate ? (Number(rate) < 1 ? String(rate).slice(1) : rate) : '  - ';
}

/**
 * 
 */
export const displayResult = (title: string, rows: string[], footer?: string) => {
  const mainContents: string[] = [];
  let mainContent = "";

  mainContent += title;
  
  for (const row of rows) {
    if (twitter.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      mainContents.push(mainContent);
      mainContent = title + row; // reset and join row
    }
  }

  if (footer) {
    if (twitter.parseTweet(mainContent + footer).valid) {
      mainContents.push(mainContent + footer);
    } else {
      mainContents.push(mainContent);
      mainContents.push(footer);
    }
  } else {
    mainContents.push(mainContent);
  }

  // display
  for (const text of mainContents) {
    console.log("--------------------\n\n%s\n", text);
  }
}

/**
 * 
 */
export const checkArgDaySeasonEndSpecify = (day, seasonEnd, specify) => {
  let targetDay = day;
  let seasonEndArg = seasonEnd;
  let specifyArg = specify;

  if (!targetDay) {
    // console.log('D=[保存開始日] の指定がありません。2020/06/19 を指定します。');
    // targetDay = moment("2020-06-19").format("MMDD");
    console.log('D=[保存開始日] の指定がありません。実行日を指定します。');
    targetDay = moment().format("MMDD");
  }
  
  if (!seasonEndArg) {
    console.log('SE=[保存終了日] の指定がありません。実行日を指定します。');
    seasonEndArg = moment().format("MMDD");
  }

  if (!specifyArg) {
    console.log('S=[試合番号] の指定がありません。全試合を指定します。');
  }

  return { targetDay, seasonEndArg, specifyArg: Number(specifyArg) }
}

/**
 * 
 */
export const checkArgTmOp = async (teamArg, oppoArg) => {

  const cardsPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s";
  const cardsJsonPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s/%s.json";

  const targetTeam = [];

  /**
   * 実行日の対戦カード取得
   */
  const getCards = async targetTeam => {
    const todayStr = moment().format('YYYYMMDD');
    const totalGameCnt = await countFiles(format(cardsPath, todayStr));
    for (let gameCnt = 1; gameCnt <= totalGameCnt; gameCnt++) {
      const { away, home } = JSON.parse(getJson(format(cardsJsonPath, todayStr, format('0%s', gameCnt))));
      console.log(format('対戦カード%s: %s-%s', gameCnt, away.team, home.team));
      targetTeam.push({ team1: away.team, team2: home.team })
    }
  }

  if (! teamArg) {
    console.log('TM=[チームイニシャル] の指定がないため実行日の対戦カードについて取得します');
    // 実行日の対戦カード取得
    if (targetTeam.length == 0) await getCards(targetTeam);
  }

  if (! oppoArg) {
    console.log('OP=[対戦相手チームイニシャル] の指定がないため実行日の対戦カードについて取得します');
    // 実行日の対戦カード取得
    if (targetTeam.length == 0) await getCards(targetTeam);
  }

  return targetTeam;
}

/**
 * 
 */
export const checkArgPs = (posArg: string) => {
  let pos = '';
  if (! posArg) {
    console.log(format('PS=[ポジションイニシャル] を入力してください (%s)', Object.keys(posArgDic).join('/')));
  } else if (Object.keys(posArgDic).indexOf(posArg) == -1) {
    console.log(format('PS=[ポジションイニシャル] は正しい形式で入力してください (%s)', Object.keys(posArgDic).join('/')));
  } else {
    pos = posArgDic[posArg];
  }
  return pos;
}

/**
 * 
 */
export const checkArgDay = (dayArgument): string => {
  let dayArg = dayArgument;
  if (! dayArg) {
    dayArg = moment().format('YYYYMMDD');
    console.log(format('D=[日付(MMDD)] の指定がないため本日(%s)を起点に出力します', moment().format('MM/DD')));
  } else {
    dayArg = format('2020%s', dayArg)
  }
  return dayArg;
}

/**
 * 
 */
export const checkArgBatOut = (batOutArg) => {
  let batOut = [];
  if (!batOutArg) {
    console.log('BO=[アウト種別(G/F)] の指定がないので両方を出力します');
    batOut = Object.values(batOuts);
  } else if (Object.keys(batOuts).indexOf(batOutArg) == -1) {
    console.log('BO=[アウト種別(G/F)] で指定してください');
  } else {
    batOut.push(batOuts[batOutArg]);
  }
  return batOut;
}

/**
 * 
 */
export const checkArgStrikeType = (strikeArg) => {
  const strikeTypesKeys = Object.keys(strikeTypes);
  const strikeTypesValues = Object.values(strikeTypes);

  let strikes = []
  if (! strikeArg) {
    console.log(format('ST=[ストライク種別(%s)] の指定がないので両方を出力します', strikeTypesKeys.join('/')))
    strikes = strikeTypesValues;
  } else if (strikeTypesKeys.indexOf(strikeArg) == -1) {
    console.log(format('ST=[ストライク種別(%s)] で指定してください', strikeTypesKeys.join('/')));
  } else {
    strikes.push(strikeTypes[strikeArg]);
  }

  return strikes;
}

/**
 * 
 */
export const checkArgPitcher = (pitcherArg) => {
  const pitcherTypesKeys = Object.keys(pitcherRoles);
  const pitcherTypesValues = Object.values(pitcherRoles);

  let pitchers = []
  if (! pitcherArg) {
    console.log(format('P=[投手種別(%s)] の指定がないので両方を出力します', pitcherTypesKeys.join('/')))
    pitchers = pitcherTypesValues;
  } else if (pitcherTypesKeys.indexOf(pitcherArg) == -1) {
    console.log(format('P=[投手種別(%s)] で指定してください', pitcherTypesKeys.join('/')));
  } else {
    pitchers.push(pitcherRoles[pitcherArg]);
  }

  return pitchers;
}

/**
 * 
 */
export const checkArgPitchType = (pitchTypeArg) => {
  const pitchTypesKeys = Object.keys(pitchTypes);
  const pitchTypesValues = Object.values(pitchTypes);

  let elems = []
  if (! pitchTypeArg) {
    console.log(format('PT=[球種種別(%s)] の指定がないので両方を出力します', pitchTypesKeys.join('/')))
    elems = pitchTypesValues;
  } else if (pitchTypesKeys.indexOf(pitchTypeArg) == -1) {
    console.log(format('PT=[球種種別(%s)] で指定してください', pitchTypesKeys.join('/')));
  } else {
    elems.push(pitcherRoles[pitchTypeArg]);
  }

  return elems;
}

/**
 * 
 */
export const createBatterResultRows = (results: BatterResult[]): string[] => {
  const rows = [];
  for (const result of results) {
    const { b_team, batter, bat, hit, average, hr, rbi } = result;
    const teamClause = b_team ? format(FORMAT_BATTER_TEAM, b_team) : '';
    const hrClause = Number(hr) ? format(FORMAT_BATTER_HR, hr) : '';
    const rbiClause = Number(rbi) ? format(FORMAT_BATTER_RBI, rbi) : '';
  
    rows.push(format(
      FORMAT_BATTER,
      trimRateZero(average), bat, hit, batter, teamClause, hrClause, rbiClause
    ));
  }
  return rows;
}


/**
 * 
 */
export const createBatterOnbaseResultRows = (results: BatterResult[]): string[] => {
  const rows = [];
  for (const result of results) {
    const { b_team, batter, onbase, average_onbase, bat_onbase, hit, bb, hbp } = result;
    const teamClause = b_team ? format(FORMAT_BATTER_TEAM, b_team) : '';

    const hitClause = Number(hit) ? format(FORMAT_BATTER_HIT, hit) : '';
    const bbClause = Number(bb) ? format(FORMAT_BATTER_BB, bb) : '';
    const hbpClause = Number(hbp) ? format(FORMAT_BATTER_HBP, hbp) : '';
  
    rows.push(format(
      FORMAT_BATTER_ONBASE,
      trimRateZero(average_onbase), bat_onbase, onbase, batter, teamClause, hitClause, bbClause, hbpClause
    ));
  }
  return rows;
}

/**
 * 
 */
export const createBatterOpsResultRows = (results: BatterResult[]): string[] => {
  const rows = [];
  for (const result of results) {
    const { b_team, batter, average_onbase, slugging, ops } = result;
    const teamClause = b_team ? format(FORMAT_BATTER_TEAM, b_team) : '';
  
    rows.push(format(
      FORMAT_BATTER_OPS,
      trimRateZero(ops), batter, teamClause, trimRateZero(average_onbase), trimRateZero(slugging)
    ));
  }
  return rows;
}

/**
 * 
 */
export const getTeamTitle = (league, teams, team = '') => {
  let teamTitle = 'NPB';
  if (team) teamTitle = teamNames[team];
  if (league) teamTitle = leagueList[league];
  if (teams.length == 6) {
    league = checkLeague(teams);
    teamTitle = leagueList[league];
  }
  return teamTitle;
}

/**
 * 
 */
export const checkArgSort = (sortArg) => {
  const sortKeys = Object.keys(sortType);
  const sortValues = Object.values(sortType);

  let elems = []
  if (! sortArg) {
    console.log(format('PT=[球種種別(%s)] の指定がないので両方を出力します', sortKeys.join('/')))
    elems = sortValues;
  } else if (sortKeys.indexOf(sortArg) == -1) {
    console.log(format('PT=[球種種別(%s)] で指定してください', sortKeys.join('/')));
  } else {
    elems.push(sortType[sortArg]);
  }

  return elems;
}

/**
 * 
 */
export const getTeamIniEn = (teamInitialKana: string) => {
  const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == teamInitialKana);
  return teamIniEn;
}

/**
 * 
 */
export const getAscSortedArray = (results: any[], column: string) => {
  const targetArray: number[] = results.map(result => result[column]);
  targetArray.sort((a, b) => a - b);
  return targetArray;
}

/**
 * 
 */
export const getDescSortedArray = (results: any[], column: string) => {
  const targetArray: number[] = results.map(result => result[column]);
  targetArray.sort((a, b) => b - a);
  return targetArray;
}

/**
 * 
 */
export const devideTmpRows = (tmpRows: string[]) => {
  const rowsCnt = tmpRows.length, rowsCntHalf = tmpRows.length / 2;
  const rows = [
    tmpRows.slice(0, rowsCntHalf).join(''),
    tmpRows.slice(rowsCntHalf, rowsCnt).join('')
  ];

  return rows;
}

/**
 * 
 */
export const getRank = (targetArray: number[], val: any) => {
  return rankCircle[targetArray.indexOf(val) + 1];
}
