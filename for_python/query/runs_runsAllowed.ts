import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC } from '../constant';
import { RunsRunsAllowed } from '../type/jsonType.d';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
  }

  const teams = teamArg ? [teamArg] : leagueP.concat(leagueC);

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results: RunsRunsAllowed[] = await manager.query(`
      SELECT
          R.inning,
          R.score AS runs,
          RA.score AS runsAllowed
      FROM
          (
              SELECT
                  ing_num AS inning,
                  SUM(debug_base.plus_score) AS score
              FROM
                  baseball_2020.debug_base
              WHERE
                  (
                      away_team_initial = '${team}'
                      OR home_team_initial = '${team}'
                  )
                  AND CASE
                      WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
                      WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
                  END
                  AND plus_score > 0
              GROUP BY
                  ing_num
          ) AS R
          LEFT JOIN (
              SELECT
                  ing_num AS inning,
                  SUM(debug_base.plus_score) AS score
              FROM
                  baseball_2020.debug_base
              WHERE
                  (
                      away_team_initial = '${team}'
                      OR home_team_initial = '${team}'
                  )
                  AND CASE
                      WHEN away_team_initial = '${team}' THEN inning LIKE '%裏'
                      WHEN home_team_initial = '${team}' THEN inning LIKE '%表'
                  END
                  AND plus_score > 0
              GROUP BY
                  ing_num
          ) RA ON R.inning = RA.inning
    `);

    // 10回情報の位置を9回の次に移動
    const inning10Result = results.find(result => result.inning == 10);
    if (inning10Result) {
      results.splice(results.indexOf(inning10Result), 1);
      results.push(inning10Result);
    } else {
      results.push({ inning: 10, runs: 0, runsAllowed: 0 })
    }

    console.log(format("\n2020年%s イニング別得失点\n(順番: 得点 失点)\n", teamNames[targetTeam]));
    results.forEach(result => {
      console.log(format('%d回 %d %d', result['inning'], result['runs'], result['runsAllowed']));  
    });
    console.log(format("\n%s", teamHashTags[targetTeam]));
  })
})();
