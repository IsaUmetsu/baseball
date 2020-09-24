import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { leagueList, teamNames } from "../constant";
import { checkArgTargetDay, checkArgTMLG, displayResult, trimRateZero } from "../disp_util";
import { getIsTweet, tweetMulti } from "../tweet/tw_util";

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const league = process.env.LG;

  const teams = checkArgTMLG(teamArg, league);
  if (! teams.length) return;

  const dayArg = process.env.D;
  const { firstDayOfWeek, lastDayOfWeek, firstDayOfWeekStr, lastDayOfWeekStr } = checkArgTargetDay(dayArg);

  const manager = await getManager();
  const results = await manager.query(`
    SELECT
      REPLACE(current_batter_name, ' ', '') AS batter,
      base.b_team AS tm,
      COUNT(current_batter_name) AS all_bat,
      SUM(is_pa) AS pa,
      SUM(is_ab) AS bat,
      SUM(is_hit) AS hit,
      SUM(is_onbase) AS onbase,
      ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
      ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
      '' AS eol
    FROM
      baseball_2020.debug_base base
    -- 週間試合数 算出
    LEFT JOIN (
      SELECT 
        b_team, COUNT(date) AS game_cnt
      FROM
        (SELECT DISTINCT
          b_team, date
        FROM
          debug_base
        WHERE
          (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}') AND 
          CHAR_LENGTH(b_team) > 0) AS game_cnt_base
      GROUP BY b_team
    ) gm ON base.b_team = gm.b_team
    WHERE
      is_pa = 1 AND
      home_initial IN ('${teams.join("', '")}') AND 
      (date >= '${firstDayOfWeekStr}' AND date <= '${lastDayOfWeekStr}')
    GROUP BY current_batter_name, tm, game_cnt
    HAVING SUM(is_pa) >= ${teamArg ? 2 : 3.1} * gm.game_cnt AND SUM(is_ab) > 0
    ORDER BY average DESC, bat DESC;
  `);

  let batterTitle = 'NPB';
  if (teamArg) batterTitle = teamNames[teamArg];
  if (league) batterTitle = leagueList[league];

  const title = format("%s打者 %s〜%s 打率\n", batterTitle, firstDayOfWeek.format('M/D'), lastDayOfWeek.format('M/D'));
  const rows = [];
  for (const result of results) {
    const { batter, tm, bat, hit, average } = result;
    rows.push(format("\n%s (%s-%s) %s(%s)", trimRateZero(average), bat, hit, batter, tm));
  }

  if (getIsTweet()) {
    tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
