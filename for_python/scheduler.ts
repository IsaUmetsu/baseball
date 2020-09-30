import { createConnection } from 'typeorm';
import { schedule } from 'node-cron';
import * as moment from 'moment';

import { execBatRc5Team, execMonthStand, execPitchGroundFlyStart, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp, execDayBatTeam, execPitchRaPerInningStart, execMonthTeamEra, execMonthBatTitle, execPitchTitle } from './query/exec_util';
import { teamArray } from './constant';

/**
 * 
 */
const execAfterGame = async () => {
  const conn = await createConnection('default');
  // 各チーム
  await execBatRc5Team();
  await execPitchRc10Team();
  // 各リーグ
  await execDayBatTeam();

  await conn.close();
}

/**
 * 
 */
const execAfterLeftMound = async () => {
  const conn = await createConnection('default');

  await execPitchStrikeSwMsGame();
  await execPitchType();
  await execPitchGroundFlyStart();
  await execPitchPerOut();

  await conn.close();
}

/**
 * 試合終了前 (ナイトゲーム)
 */
schedule('10,40 17-18 * 9-11 *', async () => {
  console.log('\n\n ----- START [before game] -----');
  const conn = await createConnection('default');
  await execPitchRaPerInningStart();
  await conn.close();
  console.log('----- END [before game] -----');
});

/**
 * 試合終了前 (土日 デイゲーム)
 */
schedule('10,40 13-16 * 9-11 0,6', async () => {
  console.log('\n\n ----- START [before game] -----');
  const conn = await createConnection('default');
  await execPitchRaPerInningStart();
  await conn.close();
  console.log('----- END [before game] -----');
});

/**
 * 試合終了後 (ナイトゲーム)
 */
schedule('2,17,32,47 21-23 * 9-11 *', async () => {
  console.log('\n\n ----- START [after game] -----');
  await execAfterGame();
  console.log('----- END [after game] -----');
});

/**
 * 試合終了後 (土日 デイゲーム)
 */
schedule('2,17,32,47 16-18 * 9-11 0,6', async () => {
  console.log('\n\n ----- START [after game] -----');
  await execAfterGame();
  console.log('----- END [after game] -----');
});

/**
 * 先発投手降板後 (ナイトゲーム)
 */
schedule('4,19,34,49 19-23 * 9-11 *', async () => {
  console.log('\n\n ----- START [after leave mound] -----');
  await execAfterLeftMound();
  console.log('----- END [after leave mound] -----');
});

/**
 * 先発投手降板後 (土日 デイゲーム)
 */
schedule('4,19,34,49 13-17 * 9-11 0,6', async () => {
  console.log('\n\n ----- START [after leave mound] -----');
  await execAfterLeftMound();
  console.log('----- END [after leave mound] -----');
});

/**
 * 毎週日曜日 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  console.log('\n\n ----- START [after game weekend] -----');
  const conn = await createConnection('default');

  await execWeekStand();
  await execWeekBatChamp();

  await execMonthStand();  
  await execMonthBatChamp();
  await execMonthTeamEra();

  await conn.close();
  console.log('----- END [after game weekend] -----');
});

/**
 * 毎月末 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 *', async () => {
  if (moment().add(1, 'days').format('D') == '1') {
    console.log('\n\n ----- START [after game month-end] -----');
    const conn = await createConnection('default');

    await execMonthStand();
    await execMonthBatChamp();
    await execMonthTeamEra();
    // per league
    await execMonthBatTitle();
    await execPitchTitle();
    // per team
    for (const team of Object.keys(teamArray)) {
      await execMonthBatTitle(true, team);
      await execPitchTitle(true, team);
    }

    await conn.close();
    console.log('----- END [after game month-end] -----');
  }
});
