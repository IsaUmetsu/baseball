import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC, dayOfWeekArr } from '../constant';
import { checkArgDow, trimRateZero } from '../disp_util';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
  }

  const teams = teamArg ? [teamArg] : leagueP.concat(leagueC)
  const dayOfWeek = checkArgDow(Number(process.env.D));

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results = await manager.query(`
      SELECT
        SUBSTRING_INDEX(current_batter_name, ' ', 1) AS batter,
        COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
        SUM(is_ab) AS bat,
        SUM(is_hit) AS hit,
        SUM(is_onbase) AS onbase,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
        ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase
      FROM
        baseball_2020.debug_base
      WHERE
        is_pa = 1 AND
        (away_team_initial = '${team}' OR home_team_initial = '${team}') AND
        CASE
          WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
          WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
        END AND
        DAYOFWEEK(date) = ${dayOfWeek} -- 曜日指定
      GROUP BY current_batter_name 
      HAVING SUM(is_pa) >= 10 
      ORDER BY average DESC
    `);
    
    console.log(format("\n%s打者 %s 打率\n", teamNames[targetTeam], dayOfWeekArr[dayOfWeek]));
    results.forEach(result => {
      const { average, bat, hit, batter } = result;
      console.log(format("%s (%s-%s) %s", trimRateZero(average), bat, hit, batter));
    });
    console.log(format("\n%s", teamHashTags[targetTeam]));
  });
})();
