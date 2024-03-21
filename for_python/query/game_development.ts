import { createConnection, getManager } from 'typeorm';
import { getRepository } from 'typeorm';
import { StatsScoreboard } from '../entities/StatsScoreboard';
import { GameInfo } from '../entities/GameInfo';

// Execute
(async () => {
  const targetTeam = 'ソ';
  await createConnection('default');
  const manager = getManager();
  // TODO: これもEntityクラスで表せないか確認
  let results = await manager.query(`
    SELECT 
      g_id
    FROM
      baseball_2024.debug_base
    WHERE
      no_game = 0
      AND batting_result = '試合終了'
      AND (away_initial = '${targetTeam}' OR home_initial = '${targetTeam}')
    ORDER BY date ASC
  `);

  let statsScoreboards = await getRepository(StatsScoreboard)
    .createQueryBuilder("ss")
    .where("ss.game_info_id IN (:ids)", { ids: results.map(result => result.g_id) })
    .getMany();

  let winCnt = 0;
  let loseCnt = 0;
  let drawCnt = 0;
  let openingScoredCnt = 0;
  let winOppoCnt = 0;
  let loseOppoCnt = 0;
  let drawOppoCnt = 0;
  let openingScoredOppoCnt = 0;
  let scorelessDraw = 0;

  let idx = 0;
  do {
    let awayInfo = statsScoreboards[idx];
    let homeInfo = statsScoreboards[idx + 1];
    let awayTeam = awayInfo.bTeam;
    let homeTeam = homeInfo.bTeam;
    const isAway = awayTeam == targetTeam;
    const isHome = homeTeam == targetTeam;

    let openingScored = false;
    let openingScoredTeam = '';

    let awayTmpScore = 0;
    let homeTmpScore = 0;
    let leadAway = false;
    let leadHome = false;

    let catchesUpWithInfo = [];
    let openingScoredInfo = [];

    // イニングごとに確認
    for (let ing = 1; ing <= 9; ing++) {
      let awayScore = Number(awayInfo[`ing${ing}`]);
      // 先制したか
      if (!openingScored && awayScore > 0) openingScoredTeam = awayTeam;
      awayTmpScore = awayTmpScore + awayScore;

      let homeScore = Number(homeInfo[`ing${ing}`]);
      // 先制したか
      if (!openingScored && homeScore > 0) openingScoredTeam = homeTeam;
      homeTmpScore = homeTmpScore + homeScore;

      if (awayTmpScore > homeTmpScore) {
        if (!leadAway) {
          leadAway = true;
          if (!openingScored) {
            openingScored = true;
            openingScoredInfo.push({ team: awayTeam, inning: ing });
            console.log(`opening scored ${awayTeam}, inning: ${ing}`);
          } else {
            leadHome = false;
            console.log(`reversed ${awayTeam}, inning: ${ing}`);
          }
        }
      }
      if (awayTmpScore < homeTmpScore) {
        if (!leadHome) {
          leadHome = true;
          if (!openingScored) {
            openingScored = true;
            openingScoredInfo.push({ team: homeTeam, inning: ing });
            console.log(`opening scored ${homeTeam}, inning: ${ing}`);
          } else {
            leadAway = false;
            console.log(`reversed ${homeTeam}, inning: ${ing}`);
          }
        }
      }
      if (awayTmpScore == homeTmpScore) {
        if (leadAway) {
          leadAway = false;
          console.log(`${homeTeam} catches up with ${awayTeam}, inning: ${ing}`)
          catchesUpWithInfo.push({ catches: homeTeam, catched: awayTeam, inning: ing });
        }
        if (leadHome) {
          leadHome = false;
          console.log(`${awayTeam} catches up with ${homeTeam}, inning: ${ing}`)
          catchesUpWithInfo.push({ catches: awayTeam, catched: homeTeam, inning: ing });
        }
      }
    }

    if (openingScoredInfo.length > 0) {
      let { team, inning } = openingScoredInfo.slice(-1)[0];
      if (team == targetTeam) {
        openingScoredCnt++;
        if (isAway && (Number(awayInfo.total) > Number(homeInfo.total))) winCnt++;
        if (isAway && (Number(awayInfo.total) < Number(homeInfo.total))) loseCnt++;
        if (isHome && (Number(awayInfo.total) < Number(homeInfo.total))) winCnt++;
        if (isHome && (Number(awayInfo.total) > Number(homeInfo.total))) loseCnt++;
        if (Number(awayInfo.total) == Number(homeInfo.total)) drawCnt++;
      } else {
        openingScoredOppoCnt++;
        if (isAway && (Number(awayInfo.total) > Number(homeInfo.total))) winOppoCnt++;
        if (isAway && (Number(awayInfo.total) < Number(homeInfo.total))) loseOppoCnt++;
        if (isHome && (Number(awayInfo.total) < Number(homeInfo.total))) winOppoCnt++;
        if (isHome && (Number(awayInfo.total) > Number(homeInfo.total))) loseOppoCnt++;
        if (Number(awayInfo.total) == Number(homeInfo.total)) drawOppoCnt++;
      }
    } else {
      scorelessDraw++;
    }

    const gameInfo = await getRepository(GameInfo).findOne(awayInfo.gameInfoId);
    console.log(`date: ${gameInfo.date}, gameInfoId: ${gameInfo.id}\n`);
    idx = idx + 2;
  } while (idx < Object.keys(statsScoreboards).length);

  console.log(`openingScored: ${openingScoredCnt}, win: ${winCnt}, lose: ${loseCnt}, draw: ${drawCnt}`);
  console.log(`openingScoredOppo: ${openingScoredOppoCnt}, win: ${winOppoCnt}, lose: ${loseOppoCnt}, draw: ${drawOppoCnt}`);
  console.log(`scorelessDraw: ${scorelessDraw}`);
})();
