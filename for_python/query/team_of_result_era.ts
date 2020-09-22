import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamNames, teamHashTags, PT_STARTER, pitcherTypeArgArr } from '../constant';
import { checkArgTmOp, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti } from '../tweet/tw_util';

const isTweet = getIsTweet();

/**
 * 対戦チームにおける先発・中継ぎ陣の防御率
 */
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const oppoArg = process.env.OP;

  const targetTeam = await checkArgTmOp(teamArg, oppoArg);

  if (teamArg && oppoArg) {
    targetTeam.push({ team1: teamArg, team2: oppoArg });
  }

  const pitcherTypeArg = process.env.P;
  let pitcherType = 0;
  if (! pitcherTypeArg) {
    console.log('P=[投手種別 ST(先発)/RV(中継ぎ)] の指定がないため先発・中継ぎを合わせた内容ついて取得します');
  } else if (Object.keys(pitcherTypeArgArr).indexOf(pitcherTypeArg) == -1) {
    console.log('P=[投手種別 ST(先発)/RV(中継ぎ)] で指定してください');
    return;
  } else {
    pitcherType = pitcherTypeArgArr[pitcherTypeArg];
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
        p_team,
          COUNT(result = '勝' OR NULL) AS win,
          COUNT(result = '敗' OR NULL) AS lose,
          ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
          CONCAT(
          SUM(outs) DIV 3,
          CASE
            WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3)
            ELSE ''
          END
        ) AS inning,
        SUM(np) AS np,
          SUM(bf) AS bf,
          SUM(so) AS so,
        SUM(ha) AS ha,
          SUM(hra) AS hra,
          SUM(bb) AS bb,
          SUM(ra) AS ra,
          SUM(er) AS er
      FROM
          baseball_2020.stats_pitcher sp
      WHERE
        ${pitcherType ? `sp.order ${pitcherType == PT_STARTER ? '=' : '>'} 1 AND ` : ``}
        game_info_id IN (
        SELECT 
          id
        FROM
          baseball_2020.game_info
        WHERE
          (away_team_initial = '${team}' AND home_team_initial = '${oppo}') OR 
          (home_team_initial = '${team}' AND away_team_initial = '${oppo}')
        )
      GROUP BY
        p_team
    `);

    const pitcherTypeClause = pitcherType ? pitcherType == PT_STARTER ? '先発 ': '中継ぎ ' : '';
    const title = format('%s vs %s\n%s投球内容\n', teamNames[teamArg], teamNames[oppoArg], pitcherTypeClause);
    const rows = [];
    results.forEach(result => {
      const { p_team, win, lose, era, inning, so, ha, hra, bb, ra, er } = result;
      const [ pTeamIniEn ] = Object.entries(teamArray).find(([, value]) => value == p_team );

      rows.push(format(
        '\n%s\n%s勝%s敗 防%s %s回 %s奪三振 被安%s 被本%s 与四%s 失%s 自%s\n',
        teamNames[pTeamIniEn], win, lose, era, inning, so, ha, hra, bb, ra, er
      ));  
    });
    const footer = format("\n%s\n%s", teamHashTags[teamArg], teamHashTags[oppoArg]);
    
    if (isTweet) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }

  targetTeam.forEach(async ({ team1, team2 }) => {
    await execute(team1, team2);
  })
})();
