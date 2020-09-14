import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, leagueP, leagueC } from '../constant';
import { RunsRunsAllowed } from '../type/jsonType';

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

  let onbaseArr = [];
  const onbaseArg = process.env.OB;
  if (onbaseArg) {
    const [fistArg, secondArg, thirdArg] = onbaseArg.split('');
    onbaseArr.push([Number(fistArg), Number(secondArg), Number(thirdArg)]);
  } else {
    console.log('OB=[塁状況] を指定がないため全塁状況分出力します');
    onbaseArr = [[0,0,0],[0,1,0],[0,1,1],[0,0,1],[1,0,0],[1,1,0],[1,1,1],[1,0,1]];
  }

  let outCountArr = [];
  const outCountArg = process.env.O;
  if (outCountArg) {
    outCountArr.push(Number(outCountArg));
  } else {
    console.log('O=[アウトカウント] を指定がないため全アウトカウント分出力します');
    outCountArr = [0, 1, 2];
  }

  teams.forEach(async targetTeam => {
    const team = teamArray[targetTeam];
    if (! team) {
      console.log('正しいチームイニシャル を指定してください');
      return;
    }

    const manager = await getManager();

    outCountArr.forEach(async outCount => {
      onbaseArr.forEach(async onbase => {
        const [first, second, third] = onbase;
  
        const results = await manager.query(`
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
            AND prev_count_out = ${outCount}
            AND (
              base1_player IS ${first ? 'NOT' : ''} NULL
              AND base2_player IS ${second ? 'NOT' : ''} NULL
              AND base3_player IS ${third ? 'NOT' : ''} NULL)
        `);

        const outCountStr = outCount == 0 ? '無' : outCount == 1 ? '一' : '二';
        let onbaseStr = '';
        if (first) onbaseStr += '一';
        if (second) onbaseStr += '二';
        if (third) onbaseStr += '三';
        if (first && second && third) onbaseStr = '満';
        onbaseStr += onbaseStr.length ? '塁' : '走者無し';

        console.log(format("\n2020年%s %s死%s 打撃成績\n", teamNames[targetTeam], outCountStr, onbaseStr));
        results.forEach(result => {
          const { average, ab, hit, hr, runs, walk, onbase_ave, sf } = result;
          if (outCount < 2 && third) {
            console.log(
              format(`%s (%d-%d) %d本 %d打点 %d四球 出塁率%s %d犠飛 `, average, ab, hit, hr, runs, walk, onbase_ave, sf));
          } else {
            console.log(
              format(`%s (%d-%d) %d本 %d打点 %d四球 出塁率%s `, average, ab, hit, hr, runs, walk, onbase_ave));
          }
        });
        console.log(format("\n%s", teamHashTags[targetTeam]));
      });
    });
  });
})();
