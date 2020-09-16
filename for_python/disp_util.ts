import { format } from 'util';
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
  mainContents.push(mainContent);

  if (footer) mainContents.push(footer);

  // display
  mainContents.forEach(text => {
    console.log("--------------------\n\n%s\n", text);
  })
}
