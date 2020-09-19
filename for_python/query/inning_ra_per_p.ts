import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamHashTags } from '../constant';
import { getPitcher } from '../fs_util';
import { displayResult } from '../disp_util';
import { tweet } from '../tweet/tw_util';
import * as yargs from 'yargs';

const pitcherPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s/%s.json";

const argv = yargs.count('team').alias('t', 'tweet').argv;
const isTweet = argv.tweet > 0;

// Execute
(async () => {
  await createConnection('default');

  let targetPitchers = [];
  const teamArg = process.env.TM;
  const nameArg = process.env.NM;

  if (!teamArg && !nameArg) {
    console.log('NM=[名前] TM=[チームイニシャル] の指定がないため本日の先発投手を指定します');
    targetPitchers = await getPitcher(pitcherPath, jsonPath);
    if (! targetPitchers.length) {
      console.log('本日の予告先発がいません');
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

  targetPitchers.forEach(async ({ team: targetTeam, pitcher, oppoTeam }) => {
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
          date,
          SUM(plus_out_count) as total_out,
          CONCAT(
            SUM(plus_out_count) DIV 3,
            CASE WHEN SUM(plus_out_count) MOD 3 > 0 THEN CONCAT('.', SUM(plus_out_count) MOD 3) ELSE '' END
          ) AS inning
      FROM
          baseball_2020.debug_base
      WHERE
          current_pitcher_name LIKE '%${pitcher.split(' ').join('%')}%'
      GROUP BY date , current_pitcher_name
      ORDER BY total_out DESC, date DESC
      LIMIT 1
    `);

    if (longestIp.length == 0) {
      console.log(format("表示可能なデータがありません TM:[%s] NM:[%s]", team, pitcher));
      return;
    }

    const { inning } = longestIp[0];
    const title = format("2020年 %s投手 イニング別失点数\n", pitcher.split(' ').join(''));
    const rows = [];
    
    for (let ingNum = 1; ingNum <= Math.ceil(Number(inning)); ingNum++) {
      const targetInning = results.find(result => result.inning == ingNum);

      let inning = targetInning ? targetInning.inning : ingNum;
      let runAllowed = targetInning ? targetInning.ra : 0;
      rows.push(format("\n%s回 %s", inning, runAllowed));
    }

    if (Math.ceil(Number(inning)) + 1 < 10) rows.push(format("\n(%s回以降未登板)", Math.ceil(Number(inning)) + 1));
    const footer = format("\n\n%s\n%s", teamHashTags[targetTeam], oppoTeam ? teamHashTags[oppoTeam] : '');

    if (isTweet) {
      await tweet(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  });
})();
