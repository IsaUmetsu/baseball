import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

// Execute
(async () => {
  await createConnection('default');

  let dayArg = process.env.D;
  if (! dayArg) {
    dayArg = moment().format('YYYYMMDD');
    console.log(format('D=[日付(MMDD)] の指定がないため本日(%s)の先発投手について出力します', moment().format('MM/DD')));
  } else {
    dayArg = format('2020%s', dayArg)
  }

  let strikeArg = process.env.S;
  if (! strikeArg) {
    strikeArg = 'SW';
  }

  const manager = await getManager();
  const results: any[] = await manager.query(`
    SELECT 
      p_team AS tm,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      SUM(is_swing) AS swing_cnt,
      SUM(is_missed) AS look_cnt
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
    const { pitcher, tm, swing_cnt, look_cnt } = result;

    rows.push(format(
      '\n%s  %s(%s)',
      strikeArg == 'SW' ? swing_cnt : look_cnt, pitcher, tm
    ));
  }

  if (getIsTweet()) {
    await tweetMulti(title, rows);
  } else {
    displayResult(title, rows);
  }
})();
