import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { checkArgDay, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

interface Result { team: string, pitcher: string, swing_cnt: string, missed_cnt: string }

// Execute
(async () => {
  await createConnection('default');

  const dayArg = checkArgDay(process.env.D);

  let strikeArg = process.env.S;
  if (! strikeArg) {
    strikeArg = 'SW';
  }

  const manager = await getManager();
  const results: Result[] = await manager.query(`
    SELECT 
      p_team AS team,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      SUM(is_swing) AS swing_cnt,
      SUM(is_missed) AS missed_cnt
    FROM
      baseball_2020.debug_pitch_base
    WHERE
      date = '${dayArg}' AND current_pitcher_order = 1
    GROUP BY p_team, current_pitcher_name
    ORDER BY ${ strikeArg == 'SW' ? 'swing_cnt' : 'look_cnt' } DESC
  `);

  const title = format('%s 先発投手\n%sストライク数\n', moment(dayArg, 'YYYYMMDD').format('M/D'), strikeArg == 'SW' ? '空振り': '見逃し');
  const rows = [];
  for (const result of results) {
    const { pitcher, team, swing_cnt, missed_cnt } = result;

    rows.push(format(
      '\n%s  %s(%s)',
      strikeArg == 'SW' ? swing_cnt : missed_cnt, pitcher, team
    ));
  }

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
