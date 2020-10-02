import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC } from '../constant';
import { displayResult } from '../util/display';
import { getIsScoringPos } from '../util/tweet';

const isScoringPos = getIsScoringPos();

// Execute
(async () => {
  await createConnection('default');

  let teams = [];
  const teamArg = process.env.TM;
  if (teamArg) {
    teams.push(teamArg);
  } else {
    console.log('TM=[チームイニシャル] を指定がないため12球団分出力します');
    teams = leagueP.concat(leagueC);
  }

  /**
   * 
   */
  const getBaseQuery = team => `
    SELECT 
      SUM(is_ab) AS ab,
      SUM(is_hit) AS hit,
      CASE LEFT(SUM(is_hit)/SUM(is_ab), 1) WHEN 1 THEN ROUND(SUM(is_hit)/SUM(is_ab), 3) ELSE RIGHT(ROUND(SUM(is_hit)/SUM(is_ab), 3), 4) END AS average,
      COUNT(batting_result LIKE '%本塁打%' OR NULL) AS hr,
      SUM(plus_score) AS runs,
      COUNT(batting_result LIKE '%四球%' OR batting_result LIKE '%申告敬遠%' OR NULL) AS walk,
      COUNT(batting_result LIKE '%犠飛%' OR NULL) AS sf,
      SUM(is_pa) AS pa,
      SUM(is_onbase) AS onbase,
      CASE LEFT(SUM(is_onbase)/SUM(is_pa), 1) WHEN 1 THEN ROUND(SUM(is_onbase)/SUM(is_pa), 3) ELSE RIGHT(ROUND(SUM(is_onbase)/SUM(is_pa), 3), 4) END AS onbase_ave,
      '' AS eol
    FROM
      baseball_2020.debug_base
    WHERE
      is_pa = 1
      AND (away_team_initial = '${team}' OR home_team_initial = '${team}')
      AND CASE
            WHEN away_team_initial = '${team}' THEN inning LIKE '%表'
            WHEN home_team_initial = '${team}' THEN inning LIKE '%裏'
        END
  `;

  for (const targetTeam of teams) {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();
    // 得点圏指定
    if (isScoringPos) {
      const results = await manager.query(`
          ${getBaseQuery(team)}
          AND ((base2_player IS NOT NULL) OR (base3_player IS NOT NULL))
      `);

      const rows = [];
      for (const result of results) {
        const { average, ab, hit, hr, runs, walk, onbase_ave, sf } = result;

        rows.push(format(
          '\n%s (%d-%d) %d本 %d打点 %d四球 出塁率%s %s犠飛\n',
          average, ab, hit, hr, runs, walk, onbase_ave, sf
        ));
      }

      displayResult(
        format("2020年%s 得点圏 打撃成績\n", teamNames[targetTeam]), rows,
        format('\n%s', teamHashTags[targetTeam])
      );
    // 得点圏未指定
    } else {
      let outCountArr = [];
      const outCountArg = process.env.O;
      if (outCountArg) {
        outCountArr.push(Number(outCountArg));
      } else {
        console.log('O=[アウトカウント] を指定がないため全アウトカウント分出力します');
        outCountArr = [0, 1, 2];
      }

      let onbaseArr = [];
      const onbaseArg = process.env.OB;

      if (onbaseArg) {
        const [fistArg, secondArg, thirdArg] = onbaseArg.split('');
        onbaseArr.push([Number(fistArg), Number(secondArg), Number(thirdArg)]);
      } else {
        console.log('OB=[塁状況] を指定がないため全塁状況分出力します');
        onbaseArr = [[0,0,0],[0,1,0],[0,1,1],[0,0,1],[1,0,0],[1,1,0],[1,1,1],[1,0,1]];
      }

      /**
       * 
       */
      const createOnbaseStr = (first, second, third) => {
        let onbaseStr = '';
        if (first) onbaseStr += '一';
        if (second) onbaseStr += '二';
        if (third) onbaseStr += '三';
        if (first && second && third) onbaseStr = '満';
        onbaseStr += onbaseStr.length ? '塁' : '走者無し';
        return onbaseStr;
      }

      for (const outCount of outCountArr) {
        for (const onbase of onbaseArr) {
          const [first, second, third] = onbase;
    
          const results = await manager.query(`
              ${getBaseQuery(team)}
              AND prev_count_out = ${outCount}
              AND (
                (base1_player IS ${first ? 'NOT' : ''} NULL)
                AND (base2_player IS ${second ? 'NOT' : ''} NULL)
                AND (base3_player IS ${third ? 'NOT' : ''} NULL)
              )
          `);

          const rows = [];
          for (const result of results) {
            const { average, ab, hit, hr, runs, walk, onbase_ave, sf } = result;

            rows.push(format(
              '\n%s (%d-%d) %d本 %d打点 %d四球 出塁率%s %s',
              average, ab, hit, hr, runs, walk, onbase_ave, outCount < 2 && third ? format('%d犠飛 ', sf) : ''
            ));
          }

          displayResult(
            format('2020年%s %s死%s 打撃成績\n',
              teamNames[targetTeam],
              outCount == 0 ? '無' : outCount == 1 ? '一' : '二',
              createOnbaseStr(first, second, third)
            ),
            rows, format("\n\n%s", teamHashTags[targetTeam])
          );
        }
      }
    }
  }
})();
