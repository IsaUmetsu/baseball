import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { leagueList, teamList, dayOfWeekArr } from '../constant';
import { trimRateZero } from '../db_util';

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
        current_batter_name AS batter,
        base.b_team AS tm,
        COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
        SUM(is_ab) AS bat,
        SUM(is_hit) AS hit,
        SUM(is_onbase) AS onbase,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
        ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
        game_cnt
      FROM
        baseball_2020.debug_base base
      -- 曜日ごとのチーム試合数取得
      LEFT JOIN (
        SELECT 
          b_team,
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
      ) AS gm on base.b_team = gm.b_team
      WHERE
        is_pa = 1 AND 
        home_initial IN (${teamsListStr}) AND 
        DAYOFWEEK(date) = ${dayOfWeek} -- 曜日指定
      GROUP BY current_batter_name, tm, game_cnt
      HAVING pa >= 3.1 * game_cnt
      ORDER BY average DESC;
  `);
  
  console.log(format("\n%s打者 %s 打率\n", league ? leagueList[league] : 'NPB', dayOfWeekArr[dayOfWeek]));
  results.forEach(result => {
    const { average, bat, hit, batter, tm } = result;
    console.log(format("%s (%s-%s) %s(%s)", trimRateZero(average), bat, hit, batter, tm));
  });
})();
