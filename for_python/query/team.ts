import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定してください');
    return;
  }

  const team = teamArray[teamArg];
  if (! team) {
    console.log('正しいチームイニシャル を指定してください');
    return;
  }

  const oppoArg = process.env.OP;
  if (! oppoArg) {
    console.log('OP=[対戦相手チームイニシャル] を指定してください');
    return;
  }

  const oppo = teamArray[oppoArg];
  if (! oppo) {
    console.log('対戦相手の正しいチームイニシャル を指定してください');
    return;
  }

  const colName = "total";
  const manager = await getManager();

  const results = await manager.query(`
    SELECT
      CONCAT(batter, " ", right(average, 4), " (", bat, "-", hit, ")") AS ${colName} -- 打率
      -- CONCAT(batter, " ", right(average, 4), " (", pa, "-", onbase, ")") AS total -- 出塁率
    FROM
      (
      SELECT
        lb.current_batter_name AS batter,
        COUNT(lb.current_batter_name) AS all_bat,
        SUM(lb.is_pa) AS pa,
        SUM(lb.is_ab) AS bat,
        SUM(lb.is_hit) AS hit,
        SUM(lb.is_onbase) AS onbase,
        ROUND(SUM(lb.is_hit) / sum(lb.is_ab), 3) AS average,
        '' AS eol
      FROM baseball_2020.live_body lb
      LEFT JOIN baseball_2020.live_header lh ON lb.game_info_id = lh.game_info_id AND lb.scene = lh.scene
      LEFT JOIN baseball_2020.game_info gi ON lb.game_info_id = gi.id
      WHERE
        lb.is_pa = 1 AND 
        (
          (gi.away_team_initial = '${team}' AND gi.home_team_initial = '${oppo}') OR 
          (gi.home_team_initial = '${team}' AND gi.away_team_initial = '${oppo}')
        ) AND
        CASE
          WHEN gi.away_team_initial = '${team}' THEN lh.inning LIKE '%表'
          WHEN gi.home_team_initial = '${team}' THEN lh.inning LIKE '%裏'
        END
      GROUP BY lb.current_batter_name
    ) AS all_hawks_bat_summary
    WHERE all_bat >= 10
    ORDER BY average DESC
  `);

  console.log(format("%s打者 対%s 打率\n", teamNames[teamArg], teamNames[oppoArg]));
  results.forEach(result => {
    console.log(result[colName]);  
  });
  console.log(format("\n%s", teamHashTags[teamArg]));
})();
