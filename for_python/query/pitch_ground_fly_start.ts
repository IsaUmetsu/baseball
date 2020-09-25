import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { checkArgDay, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

interface Result { team: string, pitcher: string, fly_out_cnt: string, ground_out_cnt: string }

// Execute
(async () => {
  await createConnection('default');

  const dayArg = checkArgDay(process.env.D);

  const batResultArray = {'G': 'ground', 'F': 'fly'};
  const batResultArg = process.env.BO;
  let batResults = [];
  if (!batResultArg) {
    console.log('BO=[アウト種別(G/F)] の指定がないので両方を出力します')
    batResults = ['ground', 'fly'];
  } else if (Object.keys(batResultArray).indexOf(batResultArg)) {
    console.log('BO=[アウト種別(G/F)] で指定してください')
  } else {
    batResults.push(batResultArray[batResultArg]);
  }

  const manager = await getManager();
  for (const batResult of batResults) {
    const results: Result[] = await manager.query(`
      SELECT 
        REPLACE(current_pitcher_name, ' ', '') AS pitcher,
        p_team AS team,
        COUNT((batting_result LIKE '%フライ%' OR batting_result LIKE '%飛%') OR NULL) AS fly_out_cnt,
        COUNT((batting_result LIKE '%ゴロ%' OR batting_result LIKE '%併殺%') OR NULL) AS ground_out_cnt
      FROM
        baseball_2020.debug_base
      WHERE
        date = '${dayArg}' AND  current_pitcher_order = 1
      GROUP BY current_pitcher_name, p_team
      ORDER BY ${batResult}_out_cnt DESC
    `);

    const title = format('%s 先発投手\n%sアウト数\n', moment(dayArg, 'YYYYMMDD').format('M/D'), batResult == 'fly' ? 'フライ' : 'ゴロ');
    const rows = [];
    for (const result of results) {
      const { pitcher, team } = result;

      rows.push(format('\n%s  %s(%s)', result[`${batResult}_out_cnt`], pitcher, team));
    }

    if (getIsTweet()) {
      await tweetMulti(title, rows);
    } else {
      displayResult(title, rows);
    }
  }
})();
