import { AppDataSource } from '../util/datasource';
import { StatsScoreboard } from '../entities/StatsScoreboard';
import { GameInfo } from '../entities/GameInfo';

// Execute
(async () => {
  await AppDataSource.initialize();
  const manager = await AppDataSource.manager;
  // TODO: これもEntityクラスで表せないか確認
  let results = await manager.query(`
    SELECT 
      g_id
    FROM
      baseball_2023.debug_base
    WHERE
      no_game = 0
      AND batting_result = '試合終了'
      AND (away_initial = 'ソ' OR home_initial = 'ソ')
      AND (away_score = home_score)
    ORDER BY date ASC
  `);

  const statsScoreboardRepo = AppDataSource.getRepository(StatsScoreboard);
  let statsScoreboards = statsScoreboardRepo
    .createQueryBuilder("ss")
    .where("ss.game_info_id IN (:ids)", { ids: results.map(result => result.g_id) })
    .getMany();

  let drawCnt = 0;
  let openingScoredCnt = 0;
  let catchesUpWithCnt = 0;
  let catchedUpWithCnt = 0;
  let scorelessDraw = 0;

  let idx = 0;
  do {
    let awayInfo = statsScoreboards[idx];
    let homeInfo = statsScoreboards[idx + 1];
    let awayTeam = awayInfo.bTeam;
    let homeTeam = homeInfo.bTeam;

    let openingScored = false;
    let openingScoredTeam = '';

    let awayTmpScore = 0;
    let homeTmpScore = 0;
    let leadAway = false;
    let leadHome = false;

    let catchesUpWithInfo = [];

    if (Number(awayInfo.total) == 0 && Number(homeInfo.total) == 0) 
      scorelessDraw++;

    // イニングごとに確認
    for (let ing = 1; ing <= 9; ing++) {
      let awayScore = Number(awayInfo[`ing${ing}`]);
      // 先制したか
      if (!openingScored && awayScore > 0) 
        openingScoredTeam = awayTeam;

      awayTmpScore = awayTmpScore + awayScore;

      let homeScore = Number(homeInfo[`ing${ing}`]);
      // 先制したか
      if (!openingScored && homeScore > 0) 
        openingScoredTeam = homeTeam;

      homeTmpScore = homeTmpScore + homeScore;

      if (awayTmpScore > homeTmpScore) {
        if (!leadAway) {
          leadAway = true;
          if (!openingScored) {
            openingScored = true;
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

    if (catchesUpWithInfo.length > 0) {
      let { catches, catched, inning } = catchesUpWithInfo.slice(-1)[0];
      
      if (catches == 'ソ') {
        catchesUpWithCnt++;
      }
      if (catched == 'ソ') {
        catchedUpWithCnt++;
      }
    }

    const gameInfoRepo = AppDataSource.getRepository(GameInfo);
    const gameInfo = await gameInfoRepo.findOne({where: {id: awayInfo.gameInfoId}});

    console.log(`date: ${gameInfo.date}, gameInfoId: ${gameInfo.id}\n`);

    drawCnt++;
    idx = idx + 2;
  } while (idx < Object.keys(statsScoreboards).length);

  console.log(`total draw: ${drawCnt}, catches: ${catchesUpWithCnt}, catched: ${catchedUpWithCnt}, scoreless: ${scorelessDraw}\n`);
})();
