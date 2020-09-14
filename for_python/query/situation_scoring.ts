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
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
    teams = leagueP.concat(leagueC);
  }

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
  
    const results = await manager.query(`
      SELECT 
          SUM(is_ab) AS ab,
          SUM(is_hit) AS hit,
          CASE LEFT(SUM(is_hit)/SUM(is_ab), 1) WHEN 1 THEN ROUND(SUM(is_hit)/SUM(is_ab), 3) ELSE RIGHT(ROUND(SUM(is_hit)/SUM(is_ab), 3), 4) END AS average,
          COUNT(batting_result LIKE '%本塁打%' OR NULL) AS hr,
          SUM(plus_score) AS runs,
          COUNT(batting_result LIKE '%四球%' OR batting_result LIKE '%申告敬遠%' OR NULL) AS walk,
          COUNT(batting_result LIKE '%犠飛%' OR NULL) AS sf,
          SUM(is_pa) AS pa,
          SUM(is_onbase) AS onbase,
          CASE LEFT(SUM(is_onbase)/SUM(is_pa), 1) WHEN 1 THEN ROUND(SUM(is_onbase)/SUM(is_pa), 3) ELSE RIGHT(ROUND(SUM(is_onbase)/SUM(is_pa), 3), 4) END AS onbase_ave,
          '' AS eol
      FROM
          baseball_2020.debug_base
      WHERE
          is_pa = 1
        AND (away_team_initial = '${team}' OR home_team_initial = '${team}')
        AND CASE
              WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
              WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
          END
        AND (
          base2_player IS NOT NULL
          OR base3_player IS NOT NULL)
    `);

    console.log(format("\n2020年%s 得点圏 打撃成績\n", teamNames[targetTeam]));
    results.forEach(result => {
      console.log(
        format(`%s (%d-%d) %d本 %d打点 %d四球 出塁率%s %d犠飛 `,
          result['average'], result['ab'], result['hit'], result['hr'], result['runs'], result['walk'], result['onbase_ave'], result['sf'])
      );
    });
    console.log(format("\n%s", teamHashTags[targetTeam]));
  });
})();
