import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
  }

  const leagueP = ['H', 'M', 'E', 'F', 'L', 'B'];
  const leagueC = ['G', 'T', 'De', 'D', 'C', 'S'];

  const teams = teamArg ? [teamArg] : leagueP.concat(leagueC)

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const colName = "total";
    const manager = await getManager();

    const results = await manager.query(`
      SELECT
        CONCAT(
          CASE LEFT(average, 1) WHEN 1 THEN average ELSE RIGHT(average, 4) END, " (", bat, "-", hit, ")",
          " ", SUBSTRING_INDEX(batter, ' ', 1)
        ) AS '${colName}'
      FROM
      (
        SELECT
          current_batter_name AS batter,
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
      ) AS all_bat_summary
      WHERE pa >= 10
      ORDER BY average DESC;
    `);

    console.log(format("\n%s打者 最近5試合 打率\n", teamNames[targetTeam]));
    results.forEach(result => {
      console.log(result[colName]);  
    });
    console.log(format("\n%s", teamHashTags[targetTeam]));
  })
})();
