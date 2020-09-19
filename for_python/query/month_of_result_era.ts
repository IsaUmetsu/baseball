import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList, teamArray } from '../constant';
import { checkArgLG, checkArgM, displayResult } from '../disp_util';

// Execute
(async () => {
  await createConnection('default');

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
 
  const { monthArg } = checkArgM(Number(process.env.M));

  const manager = await getManager();
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
      baseball_2020.stats_pitcher sp
      LEFT JOIN game_info gi ON gi.id = sp.game_info_id
      LEFT JOIN (
          SELECT
              team_initial_kana,
              game_cnt AS team_game_cnt
          FROM
              baseball_2020.game_cnt_per_month
          WHERE
              month = DATE_FORMAT(NOW(), '%c')
      ) game ON sp.p_team = game.team_initial_kana
    WHERE
      sp.order = 1
      AND DATE_FORMAT(STR_TO_DATE(gi.date, '%Y%m%d'), '%c') = ${monthArg}
      AND p_team IN (${teams.join(',')})
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
  results.forEach(result => {
    const { tm, p_name, era, game_cnt, inning, ra, er } = result;
    rows.push(format('\n%s %s(%s) 試%s %s回 失%s 自%s ', era, p_name, tm, game_cnt, inning, ra, er));
  });

  let pitcherTitle = 'NPB';
  if (league) pitcherTitle = leagueList[league];
  let pitcherType = pitcherArg == 'A' ? '' : pitcherArg == 'S' ? ' 先発' : ' 中継ぎ';

  displayResult(format('%s投手 %s月%s 防御率\n', pitcherTitle, monthArg, pitcherType), rows);
})();
