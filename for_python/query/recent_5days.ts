import { format } from 'util';
import * as yargs from 'yargs';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC } from '../constant';
import { displayResult, trimRateZero } from '../disp_util';
import { tweetMulti } from '../tweet/tw_util';

const isTweet = yargs.count('team').alias('t', 'tweet').argv.tweet > 0;

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
  }

  const teams = teamArg ? teamArg.split(' ') : leagueP.concat(leagueC)

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results = await manager.query(`
      SELECT
        REPLACE(current_batter_name, ' ', '') AS batter,
        COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
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
        (away_team_initial = '${team}' OR home_team_initial = '${team}') AND 
        CASE
          WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
          WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
        END AND
        date IN (
          SELECT A.date FROM (
            SELECT date FROM baseball_2020.game_info
            WHERE (away_team_initial = '${team}' OR home_team_initial = '${team}') AND no_game = 0
            ORDER BY date DESC LIMIT 5
          ) AS A) -- 最近5試合
      GROUP BY current_batter_name
      HAVING pa >= 2 * 5
      ORDER BY average DESC
    `);

    const title = format('%s打者 最近5試合 打率\n', teamNames[targetTeam]);
    let rows = [];
    results.forEach(result => {
      const { average, batter, bat, hit } = result;
      rows.push(format('\n%s (%s-%s) %s', trimRateZero(average), bat, hit, batter));
    });
    const footer = format('\n\n%s', teamHashTags[targetTeam]);

    if (isTweet) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  })
})();
