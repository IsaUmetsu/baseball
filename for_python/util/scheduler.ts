import * as moment from 'moment';

import { execMonthStand, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp, execDayBatTeam, execPitchRaPerInningStart, execMonthTeamEra, execMonthBatTitle, execMonthPitchTitle, execMonthBatTeam, execWeekBatTeam, execWeekTeamEra, execWeekTeamEraDiv, execMonthTeamEraDiv, execPitchCourse, execBatRc5Team, execBatRc5Npb, execOnbaseRc5Npb, execOpsRc5Npb, execPitchRc10Npb, execDayOfWeekBatChampNpb, execDayTeamEra, execDayLostOnBase, execWeekLostOnBase, execMonthLostOnBase, execPitchTypeStarter3innings, execPitchTypeStarter6innings, execDayRbiHit, execDayRbiHitJs, execBatRc5TeamJs } from './execute';
import { generateConnection } from './db';
import { outputLogStart, outputLogEnd } from './tweet';

/**
 * 
 */
export const execTest = async () => {
  // await generateConnection();
  // await execPitchRc10Npb();
  // await execPitchTypeStarter6innings();  // 12
  // await execPitchType();    // 12
}

/**
 * 
 */
export const execBeforeGame = async (msg = 'before game') => {
  outputLogStart(msg);
  await generateConnection();
  await execPitchRaPerInningStart();  // 12
  outputLogEnd(msg);
}

/**
 * 
 */
export const execDuringGame = async (msg = 'during game') => {
  outputLogStart(msg);
  await generateConnection();
  await execPitchTypeStarter3innings();  // 12
  await execPitchTypeStarter6innings();  // 12
  outputLogEnd(msg);
}

/**
 * 
 */
export const execAfterLeftMound = async (msg = 'after leave mound') => {
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
export const execAfterGame = async (msg = 'after game') => {
  outputLogStart(msg);
  await generateConnection();

  // per team (only hawks)
  // await execBatRc5Team();     // 12 (1*12)
  // await execPitchRc10Team();  // 12 (1*12)
  await execDayRbiHit();      // 1~4

  // per league
  // await execDayBatTeam();     // 4 (2*2)
  // await execDayTeamEra();     // 4 (2*2)
  // await execDayOfWeekStand();     // 4 (2*2)

  // NPB
  await execDayLostOnBase();  // 1
  await execBatRc5Npb();      // 1〜3
  await execOnbaseRc5Npb();   // 1〜3
  await execOpsRc5Npb();      // 1〜3
  await execPitchRc10Npb();   // 1〜4
  // await execDayOfWeekBatChampNpb();  // 1〜3

  outputLogEnd(msg);
}

/**
 * 
 */
export const execAfterGameSunday = async (msg = 'after game weekend') => {
  outputLogStart(msg);
  await generateConnection();

  // per league
  await execWeekStand();
  await execWeekBatTeam();
  await execWeekBatChamp();
  await execWeekTeamEra();    // 2*2(P,C)
  await execWeekTeamEraDiv(); // 2*3(total, starter, middle)*2(P,C)

  // NPB
  await execWeekLostOnBase(); // 1

  outputLogEnd(msg);
}

/**
 * 
 */
export const execAfterGameMonthMiddle = async() => {
  // const today = moment().format('D');
  // const thisMonthMaxDay = moment().endOf('month').format('D');

  // if (Number(today) == Math.ceil(Number(thisMonthMaxDay))) {
  //   const LOG_MSG = 'after game mid-month';
  //   outputLogStart(LOG_MSG);
  //   await generateConnection();

  //   await execMonthStand();
  //   await execMonthBatTeam();
  //   await execMonthBatChamp();
  //   await execMonthTeamEra();
  //   await execMonthTeamEraDiv();
  //   // per league
  //   await execMonthBatTitle();
  //   await execMonthPitchTitle();

  //   outputLogEnd(LOG_MSG);
  // }
}

/**
 * 
 */
export const execAfterGameMonthEnd = async() => {
  // if (moment().add(1, 'days').format('D') == '1') {
  //   const LOG_MSG = 'after game month-end';
  //   outputLogStart(LOG_MSG);
  //   await generateConnection();

  //   await execMonthStand();
  //   await execMonthBatChamp();
  //   await execMonthTeamEra();
  //   await execMonthBatTeam();
  //   // per league
  //   await execMonthBatTitle();
  //   await execMonthPitchTitle();
  //   // NPB
  //   await execMonthLostOnBase();  // 1

  //   outputLogEnd(LOG_MSG);
  // }
}
