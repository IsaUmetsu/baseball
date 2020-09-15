import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList, teamList } from '../constant';
import { trimRateZero } from '../db_util';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  if (! league) {
    console.log('LG=[リーグイニシャル] の指定がないため12球団から選択します');
  }

  const teams = league ? teamList[league] : teamList['P'].concat(teamList['C']);
  const teamsListStr = teams.join(", ");

  const dayOfWeek = Number(process.env.D);
  if (! dayOfWeek) {
    console.log('D=[曜日番号] を指定してください');
    return;
  }

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
                      WHEN home_score = away_score THEN away_initial
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
      base.dow = ${dayOfWeek} AND base.team_initial_kana IN (${teamsListStr})
    ORDER BY
      win_rate DESC
  `);

  const dayOfWeekArr = {
    1: "日曜",
    2: "月曜",
    3: "火曜",
    4: "水曜",
    5: "木曜",
    6: "金曜",
    7: "土曜"
  }
  
  console.log(format("\n%s球団 %s 成績\n", league ? leagueList[league] + '6' : 'NPB12', dayOfWeekArr[dayOfWeek]));
  results.forEach(result => {
    const { team_initial_kana, team_initial, win_count, lose_count, draw_count, win_rate } = result;

    console.log(format(
      "%s  %s勝%s敗%s %s %s ",
      team_initial_kana, win_count, lose_count,
      draw_count > 0 ? format("%s分", draw_count) : '',
      trimRateZero(win_rate), teamHashTags[team_initial]
    ));  
  });
})();
