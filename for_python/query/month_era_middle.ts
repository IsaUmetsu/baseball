import { format } from 'util';

import { AppDataSource } from '../util/datasource';
import { leagueList } from '../constant';
import { checkArgLG, checkArgM, displayResult } from '../util/display';
import { getIsTweet, tweetMulti } from '../util/tweet';
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
  pitcherArg = 'M';
 
  const { month } = checkArgM(process.env.M);

  const manager = await AppDataSource.manager;
  const results = await manager.query(`
    SELECT
      p_team AS tm,
      REPLACE(name, ' ', '') AS p_name,
      COUNT(name) AS game_cnt,
      COUNT(result = 'H' or null) AS hold,
      COUNT(result = '勝' or null) AS win,
      COUNT(result = 'H' or null) + COUNT(result = '勝' or null) AS hp,
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
      '' AS eol
    FROM
      baseball_${YEAR}.stats_pitcher sp
      LEFT JOIN game_info gi ON gi.id = sp.game_info_id
    WHERE
      sp.order > 1
      AND DATE_FORMAT(STR_TO_DATE(gi.date, '%Y%m%d'), '%c') = ${month}
      AND p_team IN ('${teams.join("', '")}')
    GROUP BY
      name,
      p_team
    HAVING hp > 0
    ORDER BY
      hp DESC
  `);

  const rows = [];
  for (const result of results) {
    const { tm, p_name, era, hp, hold, win, game_cnt } = result;
    let winClause = Number(win) > 0 ? format('%s勝 ', win) : '';
    let holdClause = Number(hold) > 0 ? format('%sH', hold) : '';
    rows.push(format('\n%s %s(%s) 防%s %s試 %s%s', hp, p_name, tm, era, game_cnt, winClause, holdClause));
  }

  const title = format('%s投手 %s月%s HP数\n',
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
