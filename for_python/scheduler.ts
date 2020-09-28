import { createConnection } from 'typeorm';
import { schedule } from 'node-cron';
import { execBatRc5Team, execMonthStand, execPitchGroundFlyStart, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekStand } from './query/query_util';

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
 * 週間、月間チーム成績、首位打者 (毎週日曜日)
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  await createConnection('default');

  await execWeekStand();
  await execMonthStand();
  // 週間、月間打撃成績追加
});
