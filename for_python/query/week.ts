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
      CASE LEFT(average, 1) WHEN 1 THEN average ELSE RIGHT(average, 4) END, 
      " (", bat, "-", hit, ") ", 
      REPLACE(batter, ' ', ''), "(", tm, ")"
    ) AS total
  FROM
  (
    SELECT
      lb.current_batter_name AS batter,
      CASE SUBSTRING_INDEX(lh.inning, '回', -1) WHEN '表' THEN lh.away_initial WHEN '裏' THEN lh.home_initial END AS tm,
      COUNT(lb.current_batter_name) AS all_bat, SUM(lb.is_pa) AS pa, SUM(lb.is_ab) AS bat, SUM(lb.is_hit) AS hit, SUM(lb.is_onbase) AS onbase, ROUND(SUM(lb.is_hit) / sum(lb.is_ab), 3) AS average, ROUND(SUM(lb.is_onbase) / sum(lb.is_pa), 3) AS average_onbase,
      '' AS eol
    FROM
      baseball_2020.live_body lb
      LEFT JOIN baseball_2020.live_header lh ON lb.game_info_id = lh.game_info_id AND lb.scene = lh.scene
      LEFT JOIN
        (
          SELECT * FROM baseball_2020.game_info
          WHERE
            (away_team_initial in (${teamsListStr}) OR home_team_initial in (${teamsListStr})) AND
            (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}')
        )
        gi ON lb.game_info_id = gi.id -- 週
      WHERE
        lb.is_pa = 1 AND
        gi.date IS NOT NULL AND
        lh.home_initial IN (${teamsListStr})
      GROUP BY lb.current_batter_name, tm
    ) AS all_bat_summary
    WHERE pa >= 12
    ORDER BY average DESC;
  `);

  const leagueList = {
    'P': 'パリーグ',
    'C': 'セリーグ'
  }
  
  console.log(format("%s打者 %s〜%s 打率\n", league ? leagueList[league] : '' , firstDayOfWeek.format('M/D'), lastDayOfWeek.format('M/D')));
  results.forEach(result => {
    console.log(result[colName]);  
  });
})();
