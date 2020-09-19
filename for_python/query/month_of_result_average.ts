import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { teamHashTags, leagueList, dayOfWeekArr, teamArray } from '../constant';
import { checkArgLG, trimRateZero } from '../disp_util';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  const teams = checkArgLG(league);
  if (! teams.length) return;

  let monthArg = Number(process.env.M);
  if (! monthArg) {
    monthArg = Number(moment().format('M'));
    console.log(format('M=[月] を指定がないため今月(%d月)のデータを出力します', monthArg));
  } else if (monthArg < 6 || 12 < monthArg) {
    console.log('M=[月] は6〜12月の間で入力してください');
    return;
  }

  const firstDay = moment(format("2020%d", monthArg), "YYYYM").startOf('month').format('YYYYMMDD');
  const lastDay = moment(format("2020%d", monthArg), "YYYYM").endOf('month').format('YYYYMMDD');

  const manager = await getManager();
  const results = await manager.query(`
    SELECT 
      b_team AS tm,
      SUM(is_ab) AS bat,
      SUM(is_hit) AS hit,
      ROUND(SUM(is_hit) / SUM(is_ab), 3) AS average
    FROM
      baseball_2020.debug_base
    WHERE
      date BETWEEN '${firstDay}' AND '${lastDay}'
      AND CHAR_LENGTH(b_team) > 0
      AND b_team IN (${teams.join(', ')})
    GROUP BY b_team
    ORDER BY average DESC
  `);
  
  console.log(format("\n%s球団 %s月 打率\n", league ? leagueList[league] + '6' : 'NPB12', monthArg));
  results.forEach(result => {
    const { tm, bat, hit, average } = result;

    const [ team_initial ] = Object.entries(teamArray).find(([, value]) => value == tm);

    console.log(format(
      "%s %s (%s-%s) %s ",
      tm, trimRateZero(average), bat, hit, teamHashTags[team_initial]
    ));  
  });
})();