import { format } from 'util';

import { AppDataSource } from '../util/datasource';
import { teamArray, teamNames, teamHashTags, PT_STARTER, pitcherTypeArgArr } from '../constant';
import { checkArgTmOp, displayResult } from '../util/display';
import { getIsTweet, tweetMulti } from '../util/tweet';
import { getQueryOppoEra, getQueryOppoEraForPicture } from '../util/query';

/**
 * 対戦チームにおける先発・中継ぎ陣の防御率
 */
(async () => {
  await AppDataSource.initialize();
  const { TM: teamArg, OP: oppoArg, D: dayArg, P: pitcherTypeArg } = process.env;

  const targetTeam = await checkArgTmOp(teamArg, oppoArg, dayArg);
  if (teamArg && oppoArg) {
    targetTeam.push({ team1: teamArg, team2: oppoArg });
  }

  let pitcherType = 0;
  if (! pitcherTypeArg) {
    console.log('P=[投手種別 ST(先発)/RV(中継ぎ)] の指定がないため先発・中継ぎを合わせた内容ついて取得します');
  } else if (Object.keys(pitcherTypeArgArr).indexOf(pitcherTypeArg) == -1) {
    console.log('P=[投手種別 ST(先発)/RV(中継ぎ)] で指定してください');
    return;
  } else {
    pitcherType = pitcherTypeArgArr[pitcherTypeArg];
  }

  const queries = [];

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

    // TODO: クエリ表示をどうするか
    queries.push(getQueryOppoEraForPicture(team, oppo));

    const manager = AppDataSource.manager;
    const results = await manager.query(getQueryOppoEra(pitcherType, team, oppo));

    const pitcherTypeClause = pitcherType ? pitcherType == PT_STARTER ? '先発 ': '中継ぎ ' : '';
    const title = format('%s vs %s\n%s投球内容\n', teamNames[teamArg], teamNames[oppoArg], pitcherTypeClause);
    const rows = [];
    for (const result of results) {
      const { p_team, win, lose, era, inning, so, ha, hra, bb, ra, er } = result;
      const [ pTeamIniEn ] = Object.entries(teamArray).find(([, value]) => value == p_team );

      rows.push(format(
        '\n%s\n%s勝%s敗 防%s %s回 %s奪三振 被安%s 被本%s 与四%s 失%s 自%s\n',
        teamNames[pTeamIniEn], win, lose, era, inning, so, ha, hra, bb, ra, er
      ));  
    }
    const footer = format("\n%s\n%s", teamHashTags[teamArg], teamHashTags[oppoArg]);
    
    if (getIsTweet()) {
      await tweetMulti(title, rows, footer);
    } else {
      displayResult(title, rows, footer);
    }
  }

  for (const { team1, team2 } of targetTeam) {
    await execute(team1, team2);
  }

  console.log(queries.join('\nUNION\n'));
})();
