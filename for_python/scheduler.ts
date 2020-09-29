import { createConnection } from 'typeorm';
import { schedule } from 'node-cron';
import * as moment from 'moment';

import { execBatRc5Team, execMonthStand, execPitchGroundFlyStart, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp, execDayBatTeam, execPitchRaPerInningStart } from './query/exec_util';

/**
 * 
 */
const execAfterGame = async () => {
  const connection = await createConnection('default');
  // 各チーム
  await execBatRc5Team();
  await execPitchRc10Team();
  // 各リーグ
  await execDayBatTeam();

  await connection.close();
}

/**
 * 
 */
const execAfterLeftMound = async () => {
  const connection = await createConnection('default');

  await execPitchStrikeSwMsGame();
  await execPitchType();
  await execPitchGroundFlyStart();
  await execPitchPerOut();

  await connection.close();
}

/**
 * 試合終了前 (ナイトゲーム)
 */
schedule('10,40 17-18 * 9-11 *', async () => {
  const connection = await createConnection('default');
  await execPitchRaPerInningStart();
  await connection.close();
});

/**
 * 試合終了前 (土日 デイゲーム)
 */
schedule('10,40 13-16 * 9-11 0,6', async () => {
  const connection = await createConnection('default');
  await execPitchRaPerInningStart();
  await connection.close();
});

/**
 * 試合終了後 (ナイトゲーム)
 */
schedule('2,17,32,47 21-23 * 9-11 *', async () => {
  await execAfterGame();
});

/**
 * 試合終了後 (土日 デイゲーム)
 */
schedule('2,17,32,47 16-18 * 9-11 0,6', async () => {
  await execAfterGame();
});

/**
 * 先発投手降板後 (ナイトゲーム)
 */
schedule('4,19,34,49 19-23 * 9-11 *', async () => {
  await execAfterLeftMound();
});

/**
 * 先発投手降板後 (土日 デイゲーム)
 */
schedule('4,19,34,49 13-17 * 9-11 0,6', async () => {
  await execAfterLeftMound();
});

/**
 * 毎週日曜日 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  const connection = await createConnection('default');

  await execWeekStand();
  await execWeekBatChamp();

  await execMonthStand();  
  await execMonthBatChamp();

  await connection.close();
});

/**
 * 毎月末 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 *', async () => {
  if (moment().add(1, 'days').format('D') == '1') {
    const connection = await createConnection('default');

    await execMonthStand();
    await execMonthBatChamp();

    await connection.close();
  }
});
