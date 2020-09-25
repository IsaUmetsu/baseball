import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamHashTags, teamHalfNames } from '../constant';
import { checkArgDay, checkArgTMLG, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti, findSavedTweeted, SC_PT, saveTweeted } from '../tweet/tw_util';
import { isLeftMoundStarterByTeam } from '../db_util';

interface Result { team: string, pitcher: string, pitch_type: string, pitch_type_cnt: string }
interface PitchType { type: string, cnt: number }
interface PitcherPitchType { team: string, pitcher: string, types: PitchType[] }

// Execute
(async () => {
  await createConnection('default');

  const dayArg = checkArgDay(process.env.D);

  const teams = checkArgTMLG(process.env.TM, process.env.LG);
  if (! teams.length) return;

  const manager = await getManager();
  const results: Result[] = await manager.query(`
    SELECT 
      p_team AS team,
      REPLACE(current_pitcher_name, ' ', '') AS pitcher,
      pitch_type,
      COUNT(pitch_type) AS pitch_type_cnt
    FROM
      baseball_2020.debug_pitch_base
    WHERE
      date = '${dayArg}'
      AND current_pitcher_order = 1
      AND p_team IN ('${teams.join("', '")}')
    GROUP BY p_team, current_pitcher_name , pitch_type
    ORDER BY p_team DESC, current_pitcher_name DESC, pitch_type_cnt DESC
  `);

  if (! results.length) console.log('出力対象のデータがありません');

  const newResults: PitcherPitchType[] = [];
  // 投手単位 球種別投球数リスト作成
  for (const result of results) {
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

  for (const newResult of newResults) {
    let rows: string[] = [];
    const { team, pitcher, types } = newResult;

    const total = types.reduce((a, x) => a + x.cnt, 0);
    const [ teamIniEn ] = Object.entries(teamArray).find(([, value]) => value == team);

    rows.push(format('\n%s\n%s投手 (投球数 %s)\n', teamHalfNames[teamIniEn], pitcher, total));

    for (const typeUnit of types) {
      const { type, cnt } = typeUnit;
      rows.push(format('\n%s (%s%) ', cnt, Math.round(cnt * 100 / total * 10) / 10), type);
    }

    const title = format('%s 先発投手 投球球種内容\n', moment(dayArg, 'YYYYMMDD').format('M/D'));
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);

    if (getIsTweet()) {
      const savedTweeted = await findSavedTweeted(SC_PT, team, dayArg);
      const isLeft = await isLeftMoundStarterByTeam(dayArg, team);

      if (! savedTweeted && isLeft) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_PT, team, dayArg);

        console.log(format(
          '----- [done] date: [%s], team: [%s], script: [%s] -----',
          dayArg, team, SC_PT
        ));
      } else {
        console.log(format(
          '----- date: [%s], team: [%s], script: [%s], not tweeted because: [%s] -----',
          dayArg, team, SC_PT, savedTweeted ? 'done tweet' : !isLeft ? 'not left mound starter' : 'other'
        ));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
})();
