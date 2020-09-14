import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamNames, teamHashTags, leagueList, leagueP, leagueC, teamList } from '../constant';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  if (! league) {
    console.log('LG=[リーグイニシャル] の指定がないため12球団から選択します');
  }

  const teams = league ? teamList[league] : teamList['P'].concat(teamList['C']);
  const teamsListStr = teams.join(", ");

  const dayOfWeek = Number(process.env.D);
  if (! dayOfWeek) {
    console.log('D=[曜日番号] を指定してください');
    return;
  }

  const manager = await getManager();
  const results = await manager.query(`
    SELECT
      CASE LEFT(average, 1) WHEN 1 THEN average ELSE RIGHT(average, 4) END AS ave,
      REPLACE(batter, ' ', '') AS batter_name,
      L.*
    FROM
    (
      SELECT
        current_batter_name AS batter,
        b_team AS tm,
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
        home_initial IN (${teamsListStr}) AND 
        DAYOFWEEK(date) = ${dayOfWeek} -- 曜日指定
      GROUP BY current_batter_name, tm
    ) AS L
    LEFT JOIN (
      SELECT 
        b_team AS tm,
        COUNT(date) AS game_cnt
      FROM
        (
          SELECT 
            date, b_team
          FROM
            baseball_2020.debug_base
          WHERE
            DAYOFWEEK(date) = ${dayOfWeek} -- 曜日指定
            AND b_team IS NOT NULL
          GROUP BY date , b_team
        ) AS A
      GROUP BY b_team
    ) AS R on L.tm = R.tm
    WHERE pa >= 3 * game_cnt
    ORDER BY average DESC;
  `);

  const dayOfWeekArr = {
    1: "日曜",
    2: "月曜",
    3: "火曜",
    4: "水曜",
    5: "木曜",
    6: "金曜",
    7: "土曜"
  }
  
  console.log(format("\n%s打者 %s 打率\n", league ? leagueList[league] : 'NPB', dayOfWeekArr[dayOfWeek]));
  results.forEach(result => {
    const { ave, bat, hit, batter_name, tm } = result;
    console.log(format("%s (%s-%s) %s(%s)", ave, bat, hit, batter_name, tm));  
  });
})();
