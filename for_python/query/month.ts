import * as moment from "moment";
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

  const monthArg = Number(process.env.M);
  if (! monthArg || monthArg < 6 || 12 < monthArg) {
    console.log('M=[月] を指定してください');
    return;
  }
  const firstDay = moment(format("2020%d", monthArg), "YYYYM").startOf('month').format('YYYYMMDD');
  const lastDay = moment(format("2020%d", monthArg), "YYYYM").endOf('month').format('YYYYMMDD');

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
        date BETWEEN '${firstDay}' AND '${lastDay}'
      GROUP BY current_batter_name
    ) AS all_bat_summary
    WHERE pa >= 10
    ORDER BY average DESC;
  `);
  
  console.log(format("%s打者 %d月 打率\n", teamNames[teamArg], monthArg));
  results.forEach(result => {
    console.log(result[colName]);  
  });
  console.log(format("\n%s", teamHashTags[teamArg]));
})();
