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

  const dayOfWeek = Number(process.env.D);
  if (! dayOfWeek) {
    console.log('D=[曜日番号] を指定してください');
    return;
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
          SUBSTRING_INDEX(batter, ' ', 1),
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
        LEFT JOIN baseball_2020.game_info gi ON lb.game_info_id = gi.id
        WHERE
          lb.is_pa = 1 AND
          (gi.away_team_initial = '${team}' OR gi.home_team_initial = '${team}') AND
          CASE
            WHEN gi.away_team_initial = '${team}' THEN lh.inning LIKE '%表'
            WHEN gi.home_team_initial = '${team}' THEN lh.inning LIKE '%裏'
          END AND
          DAYOFWEEK(gi.date) = ${dayOfWeek} -- 曜日指定
        GROUP BY lb.current_batter_name
      ) AS all_bat_summary
      WHERE pa >= 10
      ORDER BY average DESC;
    `);

    const dayOfWeekArr = {
      0: "日曜",
      1: "月曜",
      2: "火曜",
      3: "水曜",
      4: "木曜",
      5: "金曜",
      6: "土曜"
    }
    
    console.log(format("\n%s打者 %s 打率\n", teamNames[targetTeam], dayOfWeekArr[dayOfWeek]));
    results.forEach(result => {
      console.log(result[colName]);  
    });
    console.log(format("\n%s", teamHashTags[targetTeam]));
  });
})();
