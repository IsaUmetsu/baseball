import { format } from 'util';
import * as moment from 'moment';
import * as twitter from "twitter-text";
import { leagueList, teamArray, teamList } from './constant';

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
      teams.push(format('\'%s\'', teamArray[teamArg]));
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
export const checkArgM = (month: number) => {
  let monthArg = month;
 
  if (! month) {
    monthArg = Number(moment().format('M'));
    console.log(format('M=[月] を指定がないため今月(%d月)のデータを出力します', monthArg));
  } else if (month < 6 || 12 < month) {
    console.log('M=[月] は6〜12月の間で入力してください');
    monthArg = 0;
  }

  const fmYYYYM = format("2020%d", monthArg);

  return {
    monthArg,
    firstDay: moment(fmYYYYM, "YYYYM").startOf('month').format('YYYYMMDD'),
    lastDay: moment(fmYYYYM, "YYYYM").endOf('month').format('YYYYMMDD')
  }
}

/**
 * 
 */
export const trimRateZero = rate => {
  return Number(rate) < 1 ? String(rate).slice(1) : rate;
}

/**
 * 
 */
export const displayResult = (title, rows, footer?) => {
  const mainContents = [];
  let mainContent = "";

  mainContent += title;
  
  rows.forEach(row => {
    if (twitter.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      mainContents.push(mainContent);
      mainContent = title; // reset
    }
  });

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
  mainContents.forEach(text => {
    console.log("--------------------\n\n%s\n", text);
  })
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

  return { targetDay, seasonEndArg, specifyArg }
}
