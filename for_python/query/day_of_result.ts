import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList, dayOfWeekArr } from '../constant';
import { checkArgDow, checkArgLG, displayResult, trimRateZero } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

const isTweet = getIsTweet();

/**
 * 曜日ごとの対戦成績出力
 */
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  const teams = checkArgLG(league);
  if (! teams.length) return;

  const dayOfWeek = checkArgDow(Number(process.env.D));

  const manager = await getManager();
  const results = await manager.query(`
    SELECT
      base.team_initial_kana,
      base.team_initial,
      base.game_cnt,
      IFNULL(away.win_count_away, 0) + IFNULL(home.win_count_home, 0) AS win_count,
      IFNULL(away.lose_count_away, 0) + IFNULL(home.lose_count_home, 0) AS lose_count,
      IFNULL(away.draw_count_away, 0) + IFNULL(home.draw_count_home, 0) AS draw_count,
      ROUND((IFNULL(away.win_count_away, 0) + IFNULL(home.win_count_home, 0)) / (base.game_cnt - (IFNULL(away.draw_count_away, 0) + IFNULL(home.draw_count_home, 0))), 3) AS win_rate,
      '' AS eol
    FROM
      game_cnt_per_day base
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
              AND DAYOFWEEK(date) = ${dayOfWeek}
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
              AND DAYOFWEEK(date) = ${dayOfWeek}
          GROUP BY
              home_initial
      ) home ON home.team_initial = base.team_initial_kana
    WHERE
      base.dow = ${dayOfWeek} AND base.team_initial_kana IN (${teams.join(", ")})
    ORDER BY
      win_rate DESC
  `);
  
  let prevTeamSavings = 0;
  const title = format("%s球団 %s 成績\n", league ? leagueList[league] + '6' : 'NPB12', dayOfWeekArr[dayOfWeek]);
  const rows = [];

  results.forEach((result, idx) => {
    const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = result;
    const nowTeamSavings = Number(win_count) - Number(lose_count);

    rows.push(format(
      '\n%s  %s勝%s敗%s %s %s',
      team_initial_kana, win_count, lose_count,
      draw_count > 0 ? format('%s分', draw_count) : '', trimRateZero(win_rate),
      idx > 0 ? (prevTeamSavings - nowTeamSavings) / 2 : '-', teamHashTags[team_initial]
    ));

    prevTeamSavings = nowTeamSavings;
  });

  if (isTweet) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
