import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { checkArgDay, displayResult } from '../disp_util';
import { findSavedTweeted, getIsTweet, MSG_F, MSG_S, saveTweeted, SC_POS, tweetMulti } from '../tweet/tw_util';
import { isLeftMoundStarterAllGame } from '../db_util';

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
    const savedTweeted = await findSavedTweeted(SC_POS, 'ALL', dayArg);
    const isLeft = await isLeftMoundStarterAllGame(dayArg);

    if (! savedTweeted && isLeft) {
      await tweetMulti(title, rows);
      await saveTweeted(SC_POS, 'ALL', dayArg);
      console.log(format(MSG_S, dayArg, 'ALL', SC_POS));
    } else {
      const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
      console.log(format(MSG_F, dayArg, 'ALL', SC_POS, cause));
    }
  } else {
    displayResult(title, rows);
  }
})();
