import * as moment from "moment";
import { format } from 'util';

import { createConnection, getManager } from 'typeorm';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  if (! league) {
    console.log('LG=[リーグイニシャル] の指定がないため12球団から選択します');
  }

  const teamList = {
    'P': ["\'ソ\'", "\'ロ\'", "\'楽\'", "\'日\'", "\'西\'", "\'オ\'"],
    'C': ["\'巨\'", "\'デ\'", "\'神\'", "\'ヤ\'", "\'中\'", "\'広\'"]
  }

  const teams = league ? teamList[league] : teamList['P'].concat(teamList['C']);
  const teamsListStr = teams.join(", ");

  const dayArg = process.env.D;
  let targetDay;
  if (! process.env.D) {
    console.log('D=[日付] の指定がないため実行日を指定します');
    targetDay = moment();
  } else {
    targetDay = moment(format("2020%s", dayArg), "YYYYMMDD");
  }

  // [週始] 指定日が日曜なら前の週の月曜を指定、月曜〜土曜ならその週の月曜指定
  let firstDayOfWeek;
  if (targetDay.day() > 0) {
    firstDayOfWeek = moment(targetDay).day(1);
  } else {
    firstDayOfWeek = moment(targetDay).add(-7, 'days').day(1);
  }
  // [週終] 指定日が日曜なら前の週の土曜を指定、月曜〜土曜ならその次の週の日曜を指定
  let lastDayOfWeek;
  if (targetDay.day() > 0) {
    lastDayOfWeek = moment(targetDay).add(7, 'days').day(0);
  } else {
    lastDayOfWeek = moment(targetDay);
  }

  const firstDayOfWeekStr = firstDayOfWeek.format('YYYYMMDD');
  const lastDayOfWeekStr = lastDayOfWeek.format('YYYYMMDD');

  const colName = "total";
  const manager = await getManager();

  const results = await manager.query(`
  SELECT
    CONCAT(
      CASE LEFT(average, 1) WHEN 1 THEN average ELSE RIGHT(average, 4) END,  " (", bat, "-", hit, ") ", 
      REPLACE(batter, ' ', ''), "(", tm, ")"
    ) AS total
  FROM
  (
    SELECT
      current_batter_name AS batter,
      b_team AS tm,
      COUNT(current_batter_name) AS all_bat,
      SUM(is_pa) AS pa,
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
        (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}')
      GROUP BY current_batter_name, tm
    ) AS all_bat_summary
    WHERE pa >= 12
    ORDER BY average DESC;
  `);

  const leagueList = {
    'P': 'パリーグ',
    'C': 'セリーグ'
  }
  
  console.log(format("\n%s打者 %s〜%s 打率\n", league ? leagueList[league] : 'NPB' , firstDayOfWeek.format('M/D'), lastDayOfWeek.format('M/D')));
  results.forEach(result => {
    console.log(result[colName]);  
  });
})();
