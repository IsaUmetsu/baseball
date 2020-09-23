import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC, FORMAT_BATTER } from '../constant';
import { displayResult, trimRateZero } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
  }

  const teams = teamArg ? teamArg.split(' ') : leagueP.concat(leagueC)

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results = await manager.query(`
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
          date IN (
            SELECT A.date FROM (
              SELECT date FROM baseball_2020.game_info
              WHERE (away_team_initial = '${team}' OR home_team_initial = '${team}') AND no_game = 0
              ORDER BY date DESC LIMIT 5
            ) AS A) -- 最近5試合
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
          game_info_id IN (
            SELECT A.id FROM (
              SELECT id FROM baseball_2020.game_info
              WHERE (away_team_initial = '${team}' OR home_team_initial = '${team}') AND no_game = 0
              ORDER BY date DESC LIMIT 5
            ) AS A) -- 最近5試合
        GROUP BY name, b_team
      ) AS other ON base.batter = other.batter AND base.b_team = other.b_team
      ORDER BY average DESC
    `);

    const title = format('%s打者 最近5試合 打撃成績\n', teamNames[targetTeam]);
    let rows = [];
    for (const result of results) {
      const { average, batter, bat, hit, hr, rbi } = result;
      rows.push(format(FORMAT_BATTER, trimRateZero(average), bat, hit, hr, rbi, batter));
    }
    const footer = format('\n\n%s', teamHashTags[targetTeam]);

    if (getIsTweet()) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  })
})();
