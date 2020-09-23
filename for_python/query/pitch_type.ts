import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamHashTags, teamHalfNames } from '../constant';
import { displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

const isTweet = getIsTweet();

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

  const manager = await getManager();
  const results: any[] = await manager.query(`
    SELECT 
      p_team AS team,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      pitch_type,
      COUNT(pitch_type) AS pitch_type_cnt
    FROM
      baseball_2020.debug_pitch_base
    WHERE
      date = '${dayArg}' AND current_pitcher_order = 1
    GROUP BY p_team, current_pitcher_name , pitch_type
    ORDER BY p_team DESC, current_pitcher_name DESC, pitch_type_cnt DESC
  `);

  const newResults = [];
  for (let idxRlt in results) {
    const result = results[idxRlt];
    const existResult = newResults.find(({ team, pitcher }) => result.team == team && result.pitcher == pitcher);
    if (existResult) {
      const idx = newResults.indexOf(existResult);
      const { pitch_type, pitch_type_cnt } = result;
      newResults[idx].types.push({ type: pitch_type, cnt: Number(pitch_type_cnt) })
    } else {
      const { team, pitcher, pitch_type, pitch_type_cnt } = result;
      newResults.push({
        team,
        pitcher,
        types: [{ type: pitch_type, cnt: Number(pitch_type_cnt) }]
      })
    }
  }

  for (let idxNewRsl in newResults) {
    let rows = [];

    const { team, pitcher, types } = newResults[idxNewRsl];
    const total = types.reduce((a, x) => a + x.cnt, 0);
    const [ teamIniEn ] = Object.entries(teamArray).find(([, value]) => value == team);
    const teamHashTag = teamHashTags[teamIniEn];

    rows.push(format('\n%s\n%s投手 (投球数 %s)\n', teamHalfNames[teamIniEn], pitcher, total));

    for (let idx in types) {
      const { type, cnt } = types[idx];
      rows.push(format('\n%s (%s%) ', cnt, Math.round(cnt * 100 / total * 10) / 10), type);
    }

    const title = format('%s 先発投手 投球球種内容\n', moment(dayArg, 'YYYYMMDD').format('M/D'));
    const footer = format('\n\n%s', teamHashTag);

    if (isTweet) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }
})();
