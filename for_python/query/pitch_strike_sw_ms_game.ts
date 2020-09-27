import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { checkArgDay, checkArgStrikeType, displayResult } from '../disp_util';
import { SC_PSG, getIsTweet, tweetMulti, findSavedTweeted, saveTweeted, MSG_S, MSG_F } from '../tweet/tw_util';
import { isLeftMoundStarterAllGame } from '../db_util';

interface Result { team: string, pitcher: string, swing_cnt: string, missed_cnt: string }

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');

  const dayArg = checkArgDay(process.env.D);

  const strikes = checkArgStrikeType(process.env.ST);
  if (! strikes.length) return;

  const manager = await getManager();
  for (const strike of strikes) {
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
      ORDER BY ${strike}_cnt DESC
    `);

    const title = format('%s 先発投手\n%sストライク数\n', moment(dayArg, 'YYYYMMDD').format('M/D'), strike == 'swing' ? '空振り' : '見逃し');
    const rows = [];
    for (const result of results) {
      const { pitcher, team } = result;
      rows.push(format('\n%s  %s(%s)', result[`${strike}_cnt`], pitcher, team));
    }

    if (getIsTweet()) {
      const savedTweeted = await findSavedTweeted(SC_PSG, 'ALL', dayArg);
      const isLeft = await isLeftMoundStarterAllGame(dayArg);

      if (! savedTweeted && isLeft) {
        await tweetMulti(title, rows);
        await saveTweeted(SC_PSG, 'ALL', dayArg);
        console.log(format(MSG_S, dayArg, 'ALL', SC_PSG));
      } else {
        const cause = savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other';
        console.log(format(MSG_F, dayArg, 'ALL', SC_PSG, cause));
      }
    } else {
      displayResult(title, rows);
    }
  }
})();
