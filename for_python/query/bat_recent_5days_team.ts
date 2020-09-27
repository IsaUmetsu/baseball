import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';
import { checkArgTMLG, createBatterResultRows, displayResult } from '../disp_util';
import { findSavedTweeted, genTweetedDay, getIsTweet, saveTweeted, SC_RC5, tweetMulti, MSG_S, MSG_F } from '../tweet/tw_util';
import { BatterResult } from '../type/jsonType';
import { isFinishedGame } from '../db_util';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const teams = checkArgTMLG(process.env.TM, process.env.LG);
  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const results: BatterResult[] = await manager.query(`
      SELECT
        base.*,
        other.hr,
        other.rbi
      FROM (
        SELECT
          REPLACE(current_batter_name, ' ', '') AS batter,
          COUNT(current_batter_name) AS all_bat, SUM(is_pa) AS pa,
          b_team,
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
          b_team = '${team}' AND 
          g_id IN (SELECT id FROM game_id_recent_5days WHERE team = '${team}')
        GROUP BY current_batter_name, b_team 
        HAVING pa >= 2 * 5
      ) AS base
      LEFT JOIN (
        SELECT 
          b_team,
          name,
          REPLACE(name, ' ', '') AS batter,
          SUM(rbi) AS rbi,
          SUM(hr) AS hr
        FROM
          baseball_2020.stats_batter
        WHERE
          b_team = '${team}' AND
          game_info_id IN (SELECT id FROM game_id_recent_5days WHERE team = '${team}')
        GROUP BY name, b_team
      ) AS other ON base.batter = other.batter AND base.b_team = other.b_team
      ORDER BY average DESC
    `);

    const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == team);

    const title = format('%s打者 最近5試合 打撃成績\n', teamNames[teamIniEn]);
    const rows = createBatterResultRows(results);
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (getIsTweet()) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_RC5, team, tweetedDay);
      const isFinished = await isFinishedGame(team, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_RC5, team, tweetedDay);
        console.log(format(MSG_S, tweetedDay, team, SC_RC5));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other';
        console.log(format(MSG_F, tweetedDay, team, SC_RC5, cause));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
})();