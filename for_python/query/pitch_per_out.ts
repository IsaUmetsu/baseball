import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { checkArgDay, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

interface Result { team: string, pitcher: string, ball_cnt: string }

// Execute
(async () => {
  await createConnection('default');

  const dayArg = checkArgDay(process.env.D);

  const manager = await getManager();
  const results: Result[] = await manager.query(`
    SELECT 
        p_team AS team,
        REPLACE(name, ' ', '') AS pitcher,
        round(np / outs, 2) AS ball_cnt
    FROM
        baseball_2020.debug_stats_pitcher sp
    WHERE sp.date = '${dayArg}' AND sp.order = 1
    ORDER BY ball_cnt
  `);

  const title = format('%s 先発投手\n1アウト毎 所要投球数\n', moment(dayArg, 'YYYYMMDD').format('M/D'));
  const rows = [];
  for (const result of results) {
    const { pitcher, team, ball_cnt } = result;
    rows.push(format('\n%s  %s(%s)', ball_cnt, pitcher, team));
  }

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
