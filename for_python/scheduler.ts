import { schedule } from 'node-cron';
import * as moment from 'moment';

import { execMonthStand, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp, execDayBatTeam, execPitchRaPerInningStart, execMonthTeamEra, execMonthBatTitle, execMonthPitchTitle, execMonthBatTeam, execWeekBatTeam, execWeekTeamEra, execWeekTeamEraDiv, execMonthTeamEraDiv, execPitchCourse, execBatRc5Team, execBatRc5Npb, execOnbaseRc5Npb, execOpsRc5Npb, execPitchRc10Npb, execDayOfWeekBatChampNpb, execDayTeamEra, execDayLostOnBase, execWeekLostOnBase, execMonthLostOnBase, execPitchTypeStarter3innings, execPitchTypeStarter6innings, execDayRbiHit } from './util/execute';
import { generateConnection } from './util/db';
import { outputLogStart, outputLogEnd } from './util/tweet';

const BEFORE_GAME_NIGHT       = '5,35 17-18 * 9-11 *';
const BEFORE_GAME_DAY_HOLIDAY = '5,35 13-16 * 9-11 0,6';
const AFTER_GAME_NIGHT        = '2,17,32,47 21-23 * 9-11 *';
const AFTER_GAME_DAY_HOLIDAY  = '2,17,32,47 16-18 * 9-11 0,6';
const AFTER_LEAVE_MOUND_STARTER_NIGHT       = '4,19,34,49 19-23 * 9-11 *';
const AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY = '4,19,34,49 13-17 * 9-11 0,6';
const DURING_GAME_NIGHT       = '7,22,37,52 18-21 * 9-11 *';
const DURING_GAME_DAY_HOLIDAY = '7,22,37,52 13-17 * 9-11 0,6';

(async () => {
  // await generateConnection();
})();

/**
 * 
 */
const execBeforeGame = async (msg = 'before game') => {
  outputLogStart(msg);
  await generateConnection();
  await execPitchRaPerInningStart();  // 12
  outputLogEnd(msg);
}

/**
 * 
 */
const execDuringGame = async (msg = 'during game') => {
  outputLogStart(msg);
  await generateConnection();
  await execPitchTypeStarter3innings();  // 12
  await execPitchTypeStarter6innings();  // 12
  outputLogEnd(msg);
}

/**
 * 
 */
const execAfterLeftMound = async (msg = 'after leave mound') => {
  outputLogStart(msg);
  await generateConnection();
  // per team
  await execPitchType();    // 12
  // all pitchers
  await execPitchStrikeSwMsGame();  // 2
  // await execPitchGroundFlyStart();  // 2
  await execPitchPerOut();          // 1
  // await execPitchCourse();          // 2*2
  outputLogEnd(msg);
}

/**
 * 
 */
const execAfterGame = async (msg = 'after game') => {
  outputLogStart(msg);
  await generateConnection();

  // per team (only hawks)
  // await execBatRc5Team();     // 12 (1*12)
  // await execPitchRc10Team();  // 12 (1*12)
  // await execDayRbiHit();      // 1~4

  // per league
  // await execDayBatTeam();     // 4 (2*2)
  // await execDayTeamEra();     // 4 (2*2)
  // await execDayOfWeekStand();     // 4 (2*2)

  // NPB
  // await execDayLostOnBase();  // 1
  // await execBatRc5Npb();      // 1〜3
  // await execOnbaseRc5Npb();   // 1〜3
  // await execOpsRc5Npb();      // 1〜3
  // await execPitchRc10Npb();   // 1〜4
  // await execDayOfWeekBatChampNpb();  // 1〜3

  outputLogEnd(msg);
}

// 試合前 (ナイトゲーム)
schedule(BEFORE_GAME_NIGHT, async () => await execBeforeGame());

// 試合前 (土日 デイゲーム)
schedule(BEFORE_GAME_DAY_HOLIDAY, async () => await execBeforeGame());

// 試合開始直後 (ナイトゲーム)
schedule(AFTER_GAME_NIGHT, async () => await execAfterGame());

// 試合開始直後 (土日 デイゲーム)
schedule(AFTER_GAME_DAY_HOLIDAY, async () => await execAfterGame());

// 試合中 (ナイトゲーム)
schedule(DURING_GAME_NIGHT, async () => await execDuringGame());

// 試合中 (土日 デイゲーム)
schedule(DURING_GAME_DAY_HOLIDAY, async () => await execDuringGame());

// 先発投手降板後 (ナイトゲーム)
schedule(AFTER_LEAVE_MOUND_STARTER_NIGHT, async () => await execAfterLeftMound());

// 先発投手降板後 (土日 デイゲーム)
schedule(AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY, async () => await execAfterLeftMound());

/**
 * 毎週日曜日 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  outputLogStart('after game weekend');
  await generateConnection();

  // per league
  // await execWeekStand();
  // await execWeekBatTeam();
  // await execWeekBatChamp();
  // await execWeekTeamEra();    // 2*2(P,C)
  // await execWeekTeamEraDiv(); // 2*3(total, starter, middle)*2(P,C)

  // NPB
  // await execWeekLostOnBase(); // 1

  outputLogEnd('after game weekend');
});

/**
 * 毎月中旬 試合終了後
 */
// schedule('*/15 16-18,21-23 14-16 9-11 *', async () => {
//   const today = moment().format('D');
//   const thisMonthMaxDay = moment().endOf('month').format('D');

//   if (Number(today) == Math.ceil(Number(thisMonthMaxDay))) {
//     const LOG_MSG = 'after game mid-month';
//     outputLogStart(LOG_MSG);
//     await generateConnection();

//     await execMonthStand();
//     await execMonthBatTeam();
//     await execMonthBatChamp();
//     await execMonthTeamEra();
//     await execMonthTeamEraDiv();
//     // per league
//     await execMonthBatTitle();
//     await execMonthPitchTitle();

//     outputLogEnd(LOG_MSG);
//   }
// });

/**
 * 毎月末 試合終了後
 */
// schedule('*/15 16-18,21-23 28-31 9-11 *', async () => {
//   if (moment().add(1, 'days').format('D') == '1') {
//     const LOG_MSG = 'after game month-end';
//     outputLogStart(LOG_MSG);
//     await generateConnection();

//     await execMonthStand();
//     await execMonthBatChamp();
//     await execMonthTeamEra();
//     await execMonthBatTeam();
//     // per league
//     await execMonthBatTitle();
//     await execMonthPitchTitle();
//     // NPB
//     await execMonthLostOnBase();  // 1

//     outputLogEnd(LOG_MSG);
//   }
// });
