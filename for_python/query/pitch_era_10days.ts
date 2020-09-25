import { format } from 'util';

import { createConnection, getManager } from 'typeorm';
import { teamArray, teamHashTags, teamNames } from '../constant';
import { checkArgLG, displayResult } from '../disp_util';
import { getIsTweet, tweetMulti, SC_RC10, genTweetedDay, findSavedTweeted, saveTweeted } from '../tweet/tw_util';
import { isFinishedGame } from '../db_util';

// Execute
(async () => {
  await createConnection('default');

  const league = process.env.LG;
  const teams = checkArgLG(league);
  if (! teams.length) return;

  const manager = await getManager();
  for (const team of teams) {
    const results = await manager.query(`
      SELECT
        p_team AS tm,
        REPLACE(name, ' ', '') AS p_name,
        COUNT(name) AS game_cnt,
        COUNT(result = '勝' or null) AS win,
        COUNT(result = '敗' or null) AS lose,
        COUNT(result = 'H' or null) AS hold,
        COUNT(result = 'S' or null) AS save,
        ROUND(SUM(er) * 27 / SUM(outs), 2) AS era,
        CONCAT(
            SUM(outs) DIV 3,
            CASE
                WHEN SUM(outs) MOD 3 > 0 THEN CONCAT('.', SUM(outs) MOD 3)
                ELSE ''
            END
        ) AS inning,
        SUM(ra) AS ra,
        SUM(er) AS er,
        '' AS eol
      FROM
        baseball_2020.stats_pitcher sp
        LEFT JOIN game_info gi ON gi.id = sp.game_info_id
      WHERE
        sp.order > 1
        AND game_info_id IN (SELECT id FROM game_id_recent_10days WHERE team = '${team}')
        AND p_team = '${team}'
      GROUP BY name, p_team
      ORDER BY SUM(er) * 27 / SUM(outs), game_cnt DESC, inning DESC, win
    `);

    const [ teamIniEn ] = Object.entries(teamArray).find(([,value]) => value == team);

    const title = format('%s 中継ぎ投手 最近10試合 成績\n', teamNames[teamIniEn]);
    const footer = format('\n\n%s', teamHashTags[teamIniEn]);
    const rows = [];

    for (const result of results) {
      const { p_name, era, hold, save, win, lose, game_cnt, inning, er, ra } = result;

      let resultClause = format('%s%s%s%s',
        Number(win) > 0 ? format('%s勝', win) : '',
        Number(lose) > 0 ? format('%s敗', lose) : '',
        Number(hold) > 0 ? format('%sH', hold) : '',
        Number(save) > 0 ? format('%sH', save) : ''
      );
      resultClause = resultClause.length > 0 ? resultClause + ' ' : resultClause;

      let erClause = Number(ra) == 0 && Number(er) == 0 ? '' : format('自%s', er);

      rows.push(format(
        '\n防%s  %s  %s試 %s回 %s失%s %s',
        era, p_name, game_cnt, inning, resultClause, ra, erClause
      ));
    }

    if (getIsTweet()) {
      const tweetedDay = genTweetedDay();

      const savedTweeted = await findSavedTweeted(SC_RC10, team, tweetedDay);
      const isFinished = await isFinishedGame(team, tweetedDay);

      if (! savedTweeted && isFinished) {
        await tweetMulti(title, rows, footer);
        await saveTweeted(SC_RC10, team, tweetedDay);

        console.log(format(
          '----- [done] date: [%s], team: [%s], script: [%s] -----',
          tweetedDay, team, SC_RC10
        ));
      } else {
        console.log(format(
          '----- date: [%s], team: [%s], script: [%s], not tweeted because: [%s] -----',
          tweetedDay, team, SC_RC10, savedTweeted ? 'done tweet' : !isFinished ? 'not complete game' : 'other'
        ));
      }
    } else {
      displayResult(title, rows, footer);
    }
  }
})();
