import { format } from 'util';
import { createConnection, getManager } from 'typeorm';

import { teamArray, teamHashTags } from '../constant';
import { getPitcher } from '../fs_util';
import { displayResult } from '../disp_util';
import { getIsTweet, tweet } from '../tweet/tw_util';

const pitcherPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s/%s.json";

// Execute
(async () => {
  await createConnection('default');

  let targetPitchers = [];
  const teamArg = process.env.TM;
  const nameArg = process.env.NM;

  if (!teamArg && !nameArg) {
    console.log('NM=[名前] TM=[チームイニシャル] の指定がないため本日の先発投手を指定します');
    targetPitchers = await getPitcher(pitcherPath, jsonPath, getIsTweet());
    if (! targetPitchers.length) {
      console.log('本日の予告先発がいない または ツイート対象の投手がいません');
      return;
    }
  }

  if (teamArg && nameArg) {
    targetPitchers.push({ team: teamArg, pitcher: nameArg, oppoTeam: '' });
  }

  // if (teamArg) {
  //   teams.push(teamArg);
  // } else {
  //   console.log('TM=[チームイニシャル] を指定してください');
  //   return;
  // }

  // if (! nameArg) {
  //   console.log('NM=[名前] を指定してください');
  //   return;
  // }

  for (const { team: targetTeam, pitcher, oppoTeam } of targetPitchers) {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results: any[] = await manager.query(`
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

    const longestIp: any[] = await manager.query(`
      SELECT
        MAX(ip) AS inning
      FROM baseball_2020.stats_pitcher WHERE name LIKE '%${pitcher.split(' ').join('%')}%';
    `);

    if (longestIp.length == 0) {
      console.log(format("表示可能なデータがありません TM:[%s] NM:[%s]", team, pitcher));
      return;
    }

    const { inning } = longestIp[0];
    let [ intPart, decimalPart ] = inning.split('.');
    intPart = decimalPart ? Number(intPart) + 1 : Number(intPart)
    
    const title = format("2020年 %s投手 イニング別失点数\n", pitcher.split(' ').join(''));
    const rows = [];
    
    for (let ingNum = 1; ingNum <= intPart; ingNum++) {
      const targetInning = results.find(result => result.inning == ingNum);

      let inning = targetInning ? targetInning.inning : ingNum;
      let runAllowed = targetInning ? targetInning.ra : 0;
      rows.push(format("\n%s回 %s", inning, runAllowed));
    }

    if (intPart + 1 < 10) rows.push(format("\n(%s回以降未登板)", intPart + 1));
    const footer = format("\n\n%s\n%s", teamHashTags[targetTeam], oppoTeam ? teamHashTags[oppoTeam] : '');

    if (getIsTweet()) {
      await tweet(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }
})();
