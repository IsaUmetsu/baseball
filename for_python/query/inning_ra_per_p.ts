import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC } from '../constant';
import { RunsRunsAllowed } from '../type/jsonType';

// Execute
(async () => {
  await createConnection('default');

  let teams = [];
  const teamArg = process.env.TM;
  if (teamArg) {
    teams.push(teamArg);
  } else {
    console.log('TM=[チームイニシャル] を指定してください');
    return;
  }

  const nameArg = process.env.NM;
  if (! nameArg) {
    console.log('NM=[名前] を指定してください');
    return;
  }

  teams.forEach(async targetTeam => {
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
          AND current_pitcher_name like '%${nameArg.split(' ').join('%')}%'
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
          current_pitcher_name LIKE '%${nameArg.split(' ').join('%')}%'
      GROUP BY date , current_pitcher_name
      ORDER BY total_out DESC, date DESC
      LIMIT 1
    `);

    if (longestIp.length == 0) {
      console.log("表示可能なデータがありません");
      return;
    }

    console.log(format("\n2020年 %s投手 イニング別失点数\n", nameArg.split(' ').join('')));
    const { inning } = longestIp[0];
    for (let ingNum = 1; ingNum <= Math.ceil(Number(inning)); ingNum++) {
      const targetInning = results.find(result => result.inning == ingNum);
      if (targetInning) {
        console.log(format(`%s回 %s`, targetInning.inning, targetInning.ra));
      } else {
        console.log(format(`%s回 %s`, ingNum, 0));
      }
    }
    if (Math.ceil(Number(inning)) + 1 < 10) console.log(format(`(%s回以降未登板)`, Math.ceil(Number(inning)) + 1));
    console.log(format("\n%s", teamHashTags[targetTeam]));
  });
})();