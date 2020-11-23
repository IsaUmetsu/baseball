import { schedule } from 'node-cron';

import { generateConnection } from './util/db';
import { execAfterGame, execAfterGameMonthEnd, execAfterGameMonthMiddle, execAfterGameSunday, execAfterLeftMound, execBeforeGame, execDuringGame, execTest } from './util/scheduler';

const BEFORE_GAME_NIGHT       = '5,35 17-18 * 9-11 *';
const BEFORE_GAME_DAY_HOLIDAY = '5,35 13-16 * 9-11 0,6';
const AFTER_GAME_NIGHT        = '2,17,32,47 21-23 * 9-11 *';
const AFTER_GAME_DAY_HOLIDAY  = '2,17,32,47 16-18 * 9-11 0,6';
const AFTER_LEAVE_MOUND_STARTER_NIGHT       = '4,19,34,49 19-23 * 9-11 *';
const AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY = '4,19,34,49 13-17 * 9-11 0,6';
const DURING_GAME_NIGHT       = '7,22,37,52 18-21 * 9-11 *';
const DURING_GAME_DAY_HOLIDAY = '7,22,37,52 13-17 * 9-11 0,6';

// for test
(async () => await execTest())();

// 試合開始直後 (ナイトゲーム)
schedule(BEFORE_GAME_NIGHT, async () => await execBeforeGame());

// 試合開始直後 (土日 デイゲーム)
// schedule(BEFORE_GAME_DAY_HOLIDAY, async () => await execBeforeGame());

// 試合中 (ナイトゲーム)
schedule(DURING_GAME_NIGHT, async () => await execDuringGame());

// 試合中 (土日 デイゲーム)
// schedule(DURING_GAME_DAY_HOLIDAY, async () => await execDuringGame());

// 先発投手降板後 (ナイトゲーム)
schedule(AFTER_LEAVE_MOUND_STARTER_NIGHT, async () => await execAfterLeftMound());

// 先発投手降板後 (土日 デイゲーム)
// schedule(AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY, async () => await execAfterLeftMound());

// 試合終了後 (ナイトゲーム)
schedule(AFTER_GAME_NIGHT, async () => await execAfterGame());

// 試合終了後 (土日 デイゲーム)
// schedule(AFTER_GAME_DAY_HOLIDAY, async () => await execAfterGame());

// 毎週日曜日 試合終了後
// schedule('*/15 16-18,21-23 * 9-11 0', async () => await execAfterGameSunday());

// 毎月中旬 試合終了後
// schedule('*/15 16-18,21-23 14-16 9-11 *', async () => await execAfterGameMonthMiddle());

// 毎月末 試合終了後
// schedule('*/15 16-18,21-23 28-31 9-11 *', async () => await execAfterGameMonthEnd());
