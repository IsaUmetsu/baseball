import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList, teamArray } from '../constant';
import { checkArgLG, checkArgM } from '../disp_util';

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
 
  const { monthArg, firstDay, lastDay } = checkArgM(Number(process.env.M));

  const manager = await getManager();
  const results = await manager.query(`
    SELECT 
      p_team AS tm,
      CONCAT(
        SUM(outs) DIV 3,
        CASE WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3) ELSE '' END
      ) AS inning,
      SUM(ra) AS ra,
      SUM(er) AS er,
      ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
      '' AS eol
    FROM
      baseball_2020.stats_pitcher sp
    LEFT JOIN game_info gi ON sp.game_info_id = gi.id
    WHERE
      ${pitcherArg == 'A' ? '' : `sp.order ${pitcherArg == 'S' ? '=' : '>'} 1 AND`}
      gi.date BETWEEN '${firstDay}' AND '${lastDay}' AND
      p_team IN (${teams.join(', ')})
    GROUP BY p_team
    ORDER BY era ASC
  `);

  console.log(format("\n%s球団 %s月%s 防御率\n", league ? leagueList[league] + '6' : 'NPB12', monthArg, pitcherArg == 'A' ? '' : pitcherArg == 'S' ? ' 先発' : ' 中継ぎ'));
  results.forEach(result => {
    const { tm, era, inning, ra, er } = result;
    const [ team_initial ] = Object.entries(teamArray).find(([, value]) => value == tm);

    console.log(format(
      "%s %s %s回 %s失点 自責%s %s ",
      tm, era, inning, ra, er, teamHashTags[team_initial]
    ));  
  });
})();
