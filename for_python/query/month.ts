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
        batter,
        " ",
        CASE LEFT(average, 1) WHEN 1 THEN average ELSE RIGHT(average, 4) END,
        " (",
        bat,
        "-",
        hit,
        ")"
      ) AS '${colName}'
    FROM
    (
      SELECT
        lb.current_batter_name AS batter,
        COUNT(lb.current_batter_name) AS all_bat, SUM(lb.is_pa) AS pa,
        SUM(lb.is_ab) AS bat,
        SUM(lb.is_hit) AS hit,
        SUM(lb.is_onbase) AS onbase,
        ROUND(SUM(lb.is_hit) / SUM(lb.is_ab), 3) AS average,
        ROUND(SUM(lb.is_onbase) / SUM(lb.is_pa), 3) AS average_onbase,
        '' AS eol
      FROM
        baseball_2020.live_body lb
      LEFT JOIN baseball_2020.live_header lh ON lb.game_info_id = lh.game_info_id AND lb.scene = lh.scene
      LEFT JOIN
        (
          SELECT * FROM baseball_2020.game_info
          WHERE
            (away_team_initial = '${team}' OR home_team_initial = '${team}') AND
            date BETWEEN '${firstDay}' AND '${lastDay}'
        ) gi ON lb.game_info_id = gi.id -- 指定月
      WHERE
        lb.is_pa = 1 AND 
        (gi.away_team_initial = '${team}' OR gi.home_team_initial = '${team}') AND 
        CASE
          WHEN gi.away_team_initial = '${team}' THEN lh.inning LIKE '%表'
          WHEN gi.home_team_initial = '${team}' THEN lh.inning LIKE '%裏'
        END
      GROUP BY lb.current_batter_name
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
