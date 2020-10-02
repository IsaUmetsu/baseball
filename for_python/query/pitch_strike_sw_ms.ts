import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { checkArgPitcher, checkArgPitchType, checkArgStrikeType, displayResult } from '../util/display';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

interface Result { team: string, pitcher: string, pitch_type: string, swing_cnt: string, missed_cnt: string }

// Execute
(async () => {
  await createConnection('default');

  const pitchers = checkArgPitcher(process.env.PR);
  if (! pitchers.length) return;

  const pitchTypes = checkArgPitchType(process.env.PT);
  if (! pitchTypes.length) return;

  const strikes = checkArgStrikeType(process.env.ST);
  if (! strikes.length) return;

  const manager = await getManager();
  for (const pitcher of pitchers) {
    for (const pitchType of pitchTypes) {
      for (const strike of strikes) {
        const results: Result[] = await manager.query(`
          SELECT 
            p_team AS team,
            REPLACE(current_pitcher_name, ' ', '') AS pitcher,
            pitch_type,
            SUM(is_swing) AS swing_cnt,
            SUM(is_missed) AS missed_cnt
          FROM
            baseball_2020.debug_pitch_base
          WHERE
            current_pitcher_order ${pitcher == '先発' ? '=' : '>'} 1 AND 
            pitch_type ${pitchType == 'ストレート' ? '' : '!'}= 'ストレート'
          GROUP BY p_team, current_pitcher_name, pitch_type
          ORDER BY ${strike}_cnt DESC
          LIMIT 12
        `);

        const title = format('%s投手\n%s %sストライク数\n', pitcher, pitchType, strike == 'swing' ? '空振り' : '見逃し');
        const rows = [];
        for (const result of results) {
          const { pitcher, team, pitch_type } = result;
          const breakballClause = format('%s', pitchType == '変化球' ? pitch_type : '');
          rows.push(format('\n%s  %s(%s) %s', result[`${strike}_cnt`], pitcher, team, breakballClause));
        }

        if (getIsTweet()) {
          await tweetMulti(title, rows);
        } else {
          displayResult(title, rows);
        }
      }
    }
  }
})();
