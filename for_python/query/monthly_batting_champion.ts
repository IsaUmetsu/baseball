import { format } from "util";

import { createConnection, getManager } from 'typeorm';
import { teamNames, leagueList } from '../constant';
import { checkArgM, checkArgTMLG, displayResult, trimRateZero } from "../disp_util";
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const leagueArg = process.env.LG;

  const teams = checkArgTMLG(teamArg, leagueArg);
  if (! teams.length) return;

  const { monthArg, firstDay, lastDay } = checkArgM(Number(process.env.M));

  const manager = await getManager();
  const results = await manager.query(`
    SELECT
      REPLACE(current_batter_name, ' ', '') AS batter,
      base.b_team AS tm,
      COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
      SUM(is_ab) AS bat,
      SUM(is_hit) AS hit,
      SUM(is_onbase) AS onbase,
      ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
      ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
      '' AS eol
    FROM
      baseball_2020.debug_base base
    -- 月間試合数 算出
    LEFT JOIN (
      SELECT 
        b_team, COUNT(date) AS game_cnt
      FROM
        (SELECT DISTINCT
          b_team, date
        FROM
          debug_base
        WHERE
          (date >= '${firstDay}' AND date <= '${lastDay}') AND 
          CHAR_LENGTH(b_team) > 0) AS game_cnt_base
      GROUP BY b_team
    ) gm ON base.b_team = gm.b_team
    WHERE
      is_pa = 1 AND 
      base.b_team IN (${teams.join(',')}) AND 
      date BETWEEN '${firstDay}' AND '${lastDay}'
    GROUP BY current_batter_name, base.b_team, game_cnt
    HAVING SUM(is_pa) >= ${teamArg ? 2 : 3.1} * game_cnt AND SUM(is_ab) > 0
    ORDER BY average DESC;
  `);

  let batterTitle = 'NPB';
  if (teamArg) batterTitle = teamNames[teamArg];
  if (leagueArg) batterTitle = leagueList[leagueArg];

  const title = format("%s打者 %d月 打率\n", batterTitle, monthArg);
  const rows = [];
  for (const result of results) {
    const { batter, tm, bat, hit, average } = result;
    const teamClause = teamArg ? '' : format('(%s)', tm);

    rows.push(format('\n%s (%s-%s) %s%s', trimRateZero(average), bat, hit, batter, teamClause));
  }

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
