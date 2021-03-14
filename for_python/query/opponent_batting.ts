import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';
import { displayResult, checkArgTmOp, createBatterResultRows } from '../util/display';
import { getIsTweet, tweetMulti } from '../util/tweet';
import { BatterResult } from '../type/jsonType';
import { getYear } from '../util/day';
const YEAR = getYear();

/**
 * チームごと打者の対戦チームの打率
 */
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const oppoArg = process.env.OP;

  const targetTeams = await checkArgTmOp(teamArg, oppoArg);

  if (teamArg && oppoArg) {
    targetTeams.push({ team1: teamArg, team2: oppoArg });
  }

  /**
   * 実行メイン関数
   */
  const execute = async (teamArg, oppoArg) => {
    const team = teamArray[teamArg];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const oppo = teamArray[oppoArg];
    if (! oppo) {
      console.log('対戦相手の正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results: BatterResult[] = await manager.query(`
      SELECT
        base.*,
        other.hr,
        other.rbi
      FROM (
        SELECT
          REPLACE(current_batter_name, ' ', '') AS batter,
          b_team,
          SUM(is_pa) AS pa,
          SUM(is_ab) AS bat,
          SUM(is_hit) AS hit,
          ROUND(SUM(is_hit) / sum(is_ab), 3) AS average,
          '' AS eol
        FROM baseball_${YEAR}.debug_base
        WHERE
          is_pa = 1 AND 
          (
            (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
            (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
          ) AND
          CASE
            WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
            WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
          END
        GROUP BY current_batter_name, b_team
        HAVING pa >= 2 * (
          SELECT 
            COUNT(id)
          FROM
            baseball_${YEAR}.game_info
          WHERE
            (
              (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
              (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
            ) AND no_game = 0
        )
      ) AS base
      LEFT JOIN (
        SELECT 
          b_team,
          REPLACE(name, ' ', '') AS batter,
          SUM(rbi) AS rbi,
          SUM(hr) AS hr
        FROM
          baseball_${YEAR}.stats_batter
        WHERE
          b_team = '${team}' AND
          game_info_id IN (
            SELECT A.id FROM (
              SELECT id FROM baseball_${YEAR}.game_info
              WHERE
                (
                  (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
                  (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
                ) AND no_game = 0
            ) AS A)
        GROUP BY name, b_team
      ) AS other ON base.batter = other.batter AND base.b_team = other.b_team
      ORDER BY average DESC
    `);

    const title = format("%s打者 対%s 打撃成績\n", teamNames[teamArg], teamNames[oppoArg]);
    const rows = createBatterResultRows(results);
    const footer = format("\n\n%s", teamHashTags[teamArg]);

    if (getIsTweet()) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }

  for (const { team1, team2 } of targetTeams) { 
    await execute(team1, team2);
    await execute(team2, team1);
  }
})();
