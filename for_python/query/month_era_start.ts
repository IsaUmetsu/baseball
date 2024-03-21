import { format } from 'util';

import { AppDataSource } from '../util/datasource';
import { leagueList } from '../constant';
import { checkArgLG, checkArgM, displayResult } from '../util/display';
import { tweetMulti, getIsTweet } from '../util/tweet';
import { getYear } from '../util/day';
const YEAR = getYear();

// Execute
(async () => {
  await AppDataSource.initialize();
  const league = process.env.LG;
  const teams = checkArgLG(league);
  if (! teams.length) return;

  let pitcherArg = process.env.P;
  if (! pitcherArg) {
    pitcherArg = 'A';
    console.log('P=[S/M] の指定がないため先発・中継ぎ両方ののデータを出力します');
  } else if (pitcherArg != 'S' && pitcherArg != 'M') {
    console.log('P=[投手種別] の指定がないため先発・中継ぎ両方ののデータを出力します')
  }
  pitcherArg = 'S';
 
  const { month } = checkArgM(process.env.M);

  const manager = await AppDataSource.manager;
  const results = await manager.query(`
    SELECT
      p_team AS tm,
      REPLACE(name, ' ', '') AS p_name,
      COUNT(name) AS game_cnt,
      ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
      CONCAT(
          SUM(outs) DIV 3,
          CASE
              WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3)
              ELSE ''
          END
      ) AS inning,
      SUM(ra) AS ra,
      SUM(er) AS er,
      team_game_cnt,
      SUM(outs) DIV 3 AS inning_int,
      '' AS eol
    FROM
      baseball_${YEAR}.stats_pitcher sp
      LEFT JOIN game_info gi ON gi.id = sp.game_info_id
      LEFT JOIN (
          SELECT
              team_initial_kana,
              game_cnt AS team_game_cnt
          FROM
              baseball_${YEAR}.game_cnt_per_month
          WHERE
              month = DATE_FORMAT(NOW(), '%c')
      ) game ON sp.p_team = game.team_initial_kana
    WHERE
      sp.order = 1
      AND DATE_FORMAT(STR_TO_DATE(gi.date, '%Y%m%d'), '%c') = ${month}
      AND p_team IN ('${teams.join("', '")}')
    GROUP BY
      name,
      p_team,
      team_game_cnt
    HAVING
      inning_int >= game.team_game_cnt
    ORDER BY
      era
  `);

  const rows = [];
  for (const result of results) {
    const { tm, p_name, era, game_cnt, inning, ra, er } = result;
    rows.push(format('\n%s %s(%s) %s試 %s回 失%s 自%s ', era, p_name, tm, game_cnt, inning, ra, er));
  }

  const title = format('%s投手 %s月%s 防御率\n',
    league ? leagueList[league] : 'NPB',
    month,
    pitcherArg == 'A' ? '' : pitcherArg == 'S' ? ' 先発' : ' 中継ぎ'
  );

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
