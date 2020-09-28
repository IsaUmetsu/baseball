import { createConnection } from 'typeorm';
import { schedule } from 'node-cron';
import * as moment from 'moment';

import { execBatRc5Team, execMonthStand, execPitchGroundFlyStart, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp } from './query/query_util';

/**
 * 試合終了後 (ナイトゲーム)
 */
schedule('*/15 21-23 * 9-11 *', async () => {
  await createConnection('default');

  await execBatRc5Team();
  await execPitchRc10Team();
});

/**
 * 試合終了後 (土日 デイゲーム)
 */
schedule('*/15 16-18 * 9-11 0,6', async () => {
  await createConnection('default');

  await execBatRc5Team();
  await execPitchRc10Team();
});

/**
 * 先発投手降板後 (ナイトゲーム)
 */
schedule('*/15 19-23 * 9-11 *', async () => {
  await createConnection('default');

  await execPitchStrikeSwMsGame();
  await execPitchType();
  await execPitchGroundFlyStart();
  await execPitchPerOut();
});

/**
 * 先発投手降板後 (土日 デイゲーム)
 */
schedule('*/15 13-17 * 9-11 0,6', async () => {
  await createConnection('default');

  await execPitchStrikeSwMsGame();
  await execPitchType();
  await execPitchGroundFlyStart();
  await execPitchPerOut();
});

/**
 * 毎週日曜日 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  await createConnection('default');

  await execWeekStand();
  await execWeekBatChamp();

  await execMonthStand();  
  await execMonthBatChamp();
});

/**
 * 毎月末 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 *', async () => {
  if (moment().add(1, 'days').format('D') == '1') {
    await createConnection('default');

    await execMonthStand();
    await execMonthBatChamp();
  }
});
