import * as moment from 'moment';
import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags } from '../constant';
import { countFiles, getJson } from '../fs_util';

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

    const colName = "total";
    const manager = await getManager();

    const results = await manager.query(`
      SELECT
        CONCAT(SUBSTRING_INDEX(batter, ' ', 1), " ", right(average, 4), " (", bat, "-", hit, ")") AS ${colName} -- 打率
      FROM
        (
        SELECT
          lb.current_batter_name AS batter,
          COUNT(lb.current_batter_name) AS all_bat,
          SUM(lb.is_pa) AS pa,
          SUM(lb.is_ab) AS bat,
          SUM(lb.is_hit) AS hit,
          SUM(lb.is_onbase) AS onbase,
          ROUND(SUM(lb.is_hit) / sum(lb.is_ab), 3) AS average,
          '' AS eol
        FROM baseball_2020.live_body lb
        LEFT JOIN baseball_2020.live_header lh ON lb.game_info_id = lh.game_info_id AND lb.scene = lh.scene
        LEFT JOIN baseball_2020.game_info gi ON lb.game_info_id = gi.id
        WHERE
          lb.is_pa = 1 AND 
          (
            (gi.away_team_initial = '${team}' AND gi.home_team_initial = '${oppo}') OR 
            (gi.home_team_initial = '${team}' AND gi.away_team_initial = '${oppo}')
          ) AND
          CASE
            WHEN gi.away_team_initial = '${team}' THEN lh.inning LIKE '%表'
            WHEN gi.home_team_initial = '${team}' THEN lh.inning LIKE '%裏'
          END
        GROUP BY lb.current_batter_name
      ) AS all_hawks_bat_summary
      WHERE all_bat >= 10
      ORDER BY average DESC
    `);

    console.log(format("\n%s打者 対%s 打率\n", teamNames[teamArg], teamNames[oppoArg]));
    results.forEach(result => {
      console.log(result[colName]);  
    });
    console.log(format("\n%s", teamHashTags[teamArg]));
  }

  targetTeam.forEach(async ({ team1, team2 }) => {
    await execute(team1, team2);
    await execute(team2, team1);
  })
})();
