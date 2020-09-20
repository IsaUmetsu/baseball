import * as moment from 'moment';
import { format } from 'util';
import * as yargs from 'yargs';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';
import { countFiles, getJson } from '../fs_util';
import { displayResult, trimRateZero } from '../disp_util';
import { tweetMulti } from '../tweet/tw_util';

const isTweet = yargs.count('team').alias('t', 'tweet').argv.tweet > 0;

const cardsPath = "/Users/IsamuUmetsu/dev/py_baseball/cards/%s";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/cards/%s/%s.json";

// Execute
(async () => {
  await createConnection('default');

  const targetTeam = [];

  /**
   * 実行日の対戦カード取得
   */
  const getCards = async targetTeam => {
    const todayStr = moment().format('YYYYMMDD');
    const totalGameCnt = await countFiles(format(cardsPath, todayStr));
    for (let gameCnt = 1; gameCnt <= totalGameCnt; gameCnt++) {
      const { away, home } = JSON.parse(getJson(format(jsonPath, todayStr, "0" + String(gameCnt))));
      console.log(format('対戦カード%s: %s-%s', gameCnt, away, home));
      targetTeam.push({ team1: away, team2: home })
    }
  }

  const teamArg = process.env.TM;
  if (! teamArg) {
    console.log('TM=[チームイニシャル] の指定がないため実行日の対戦カードについて取得します');
    // 実行日の対戦カード取得
    if (targetTeam.length == 0) await getCards(targetTeam);
  }

  const oppoArg = process.env.OP;
  if (! oppoArg) {
    console.log('OP=[対戦相手チームイニシャル] の指定がないため実行日の対戦カードについて取得します');
    // 実行日の対戦カード取得
    if (targetTeam.length == 0) await getCards(targetTeam);
  }

  if (teamArg && oppoArg) {
    targetTeam.push({ team1: teamArg, team2: oppoArg });
  }

  /**
   * 実行メイン関数
   */
  const execute = async (teamArg, oppoArg) => {
    const team = teamArray[teamArg];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const oppo = teamArray[oppoArg];
    if (! oppo) {
      console.log('対戦相手の正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    const results = await manager.query(`
      SELECT
        REPLACE(current_batter_name, ' ', '') AS batter,
        SUM(is_pa) AS pa,
        SUM(is_ab) AS bat,
        SUM(is_hit) AS hit,
        ROUND(SUM(is_hit) / sum(is_ab), 3) AS average,
        '' AS eol
      FROM baseball_2020.debug_base
      WHERE
        is_pa = 1 AND 
        (
          (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
          (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
        ) AND
        CASE
          WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
          WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
        END
      GROUP BY current_batter_name
      HAVING pa >= 2 * (
        SELECT 
            COUNT(id)
        FROM
            baseball_2020.game_info
        WHERE
            (
              (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
              (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
            )
      )
      ORDER BY average DESC
    `);

    const title = format("%s打者 対%s 打率\n", teamNames[teamArg], teamNames[oppoArg]);
    const rows = [];
    results.forEach(result => {
      const { batter, bat, hit, average } = result;
      rows.push(format('\n%s (%s-%s) %s', trimRateZero(average), bat, hit, batter));  
    });
    const footer = format("\n\n%s", teamHashTags[teamArg]);
    
    if (isTweet) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }

  targetTeam.forEach(async ({ team1, team2 }) => {
    await execute(team1, team2);
    await execute(team2, team1);
  })
})();
