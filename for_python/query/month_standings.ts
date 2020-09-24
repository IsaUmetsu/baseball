import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList } from '../constant';
import { checkArgLG, checkArgM, displayResult, trimRateZero } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  const teams = checkArgLG(league);
  if (! teams.length) return;

  const { monthArg, firstDay, lastDay } = checkArgM(Number(process.env.M));

  const manager = await getManager();
  const results = await manager.query(`
    SELECT
      base.team_initial_kana,
      base.team_initial,
      base.game_cnt,
      away.win_count_away + home.win_count_home AS win_count,
      away.lose_count_away + home.lose_count_home AS lose_count,
      away.draw_count_away + home.draw_count_home AS draw_count,
      ROUND((away.win_count_away + home.win_count_home) / (base.game_cnt - (away.draw_count_away + home.draw_count_home)), 3) AS win_rate,
      '' AS eol
    FROM
      game_cnt_per_month base
      LEFT JOIN (
          SELECT
              away_initial AS team_initial,
              COUNT(
                  away_initial = CASE
                      WHEN home_score > away_score THEN home_initial
                      WHEN home_score < away_score THEN away_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS win_count_away,
              COUNT(
                  away_initial = CASE
                      WHEN home_score < away_score THEN home_initial
                      WHEN home_score > away_score THEN away_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS lose_count_away,
              COUNT(
                  away_initial = CASE
                      WHEN home_score = away_score THEN away_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS draw_count_away,
              eol
          FROM
              baseball_2020.debug_base
          WHERE
              no_game = 0
              AND batting_result = '試合終了'
              AND (date >= '${firstDay}' AND date <= '${lastDay}')
          GROUP BY
              away_initial
      ) away ON away.team_initial = base.team_initial_kana
      LEFT JOIN (
          SELECT
              home_initial AS team_initial,
              COUNT(
                  home_initial = CASE
                      WHEN home_score > away_score THEN home_initial
                      WHEN home_score < away_score THEN away_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS win_count_home,
              COUNT(
                  home_initial = CASE
                      WHEN home_score < away_score THEN home_initial
                      WHEN home_score > away_score THEN away_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS lose_count_home,
              COUNT(
                  home_initial = CASE
                      WHEN home_score = away_score THEN home_initial
                      ELSE NULL
                  END
                  OR NULL
              ) AS draw_count_home,
              eol
          FROM
              baseball_2020.debug_base
          WHERE
              no_game = 0
              AND batting_result = '試合終了'
              AND (date >= '${firstDay}' AND date <= '${lastDay}')
          GROUP BY
              home_initial
      ) home ON home.team_initial = base.team_initial_kana
    WHERE
      base.month = ${monthArg} AND base.team_initial_kana IN ('${teams.join("', '")}')
    ORDER BY
      win_rate DESC
  `);
  
  let prevTeamSavings = 0;
  const title = format("%s球団 %s月 成績\n", league ? leagueList[league] + '6' : 'NPB12', monthArg);
  const rows = [];
  for (let idx in results) {
    const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = results[idx];
    const nowTeamSavings = Number(win_count) - Number(lose_count);

    rows.push(format(
      "\n%s %s勝%s敗%s %s %s %s ",
      team_initial_kana, win_count, lose_count,
      draw_count > 0 ? format("%s分", draw_count) : '', trimRateZero(win_rate),
      Number(idx) > 0 ? (prevTeamSavings - nowTeamSavings) / 2 : '-', teamHashTags[team_initial]
    ));  

    prevTeamSavings = nowTeamSavings;
  }

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
