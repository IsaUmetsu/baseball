import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamHashTags, dayOfWeekArr, teamNameHalfToIni } from '../constant';
import { checkArgDow, trimRateZero, displayResult, checkArgTMLG } from '../util/display';
import { getIsTweet, tweetMulti } from '../util/tweet';

/**
 * 曜日ごとの打率(出力単位: チーム単体)
 */
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const league = process.env.LG;

  const teams = checkArgTMLG(teamArg, league);
  if (! teams.length) return;

  const dayOfWeek = checkArgDow(Number(process.env.D));

  for (const targetTeam of teams) {

    const manager = await getManager();
    const results = await manager.query(`
      SELECT
        REPLACE(current_batter_name, ' ', '') AS batter,
        SUM(is_pa) AS pa,
        SUM(is_ab) AS bat,
        SUM(is_hit) AS hit,
        SUM(is_onbase) AS onbase,
        ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average,
        ROUND(SUM(is_onbase) / SUM(is_pa), 3) AS average_onbase,
        game.game_cnt
      FROM
        baseball_2020.debug_base base
      LEFT JOIN (
        SELECT 
          team_initial_kana, game_cnt
        FROM
          baseball_2020.game_cnt_per_day
        WHERE
          dow = ${dayOfWeek} -- 曜日指定
      ) AS game ON game.team_initial_kana = b_team
      WHERE
        is_pa = 1 AND 
        b_team IN ('${targetTeam}') AND 
        DAYOFWEEK(date) = ${dayOfWeek} -- 曜日指定
      GROUP BY current_batter_name, game.game_cnt 
      HAVING pa >= 2 * game.game_cnt 
      ORDER BY average DESC
    `);

    const [ teamName ] = Object.entries(teamNameHalfToIni).find(([,value]) => value == targetTeam);
    const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == targetTeam);
    
    const title = format('%s打者 %s 打率\n', teamName, dayOfWeekArr[dayOfWeek]);
    const rows = [];
    for (const result of results) {
      const { average, bat, hit, batter } = result;
      rows.push(format('\n%s (%s-%s) %s', trimRateZero(average), bat, hit, batter));
    }
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);
    
    if (getIsTweet()) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }
})();
