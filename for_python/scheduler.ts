import { schedule } from 'node-cron';

import { execAfterLeftMound, execDuringGame, execTest, execAfterGame, execAfterGameSunday } from './util/scheduler';
import { execProcessJson } from './process.json';

const IMPORT_GAME_NIGHT = '5-59/6 18-22 * 3-10 *';
const IMPORT_GAME_DAY_HOLIDAY = '5-59/6 14-18 * 3-10 0-3,6';

const BEFORE_GAME_NIGHT       = '5,35 17-18 * 3-10 *';
const BEFORE_GAME_DAY_HOLIDAY = '5,35 13-16 * 3-10 0-3,6';
const AFTER_GAME_NIGHT        = '9-59/10 21-23 * 3-10 *';
const AFTER_GAME_DAY_HOLIDAY  = '9-59/10 16-19 * 3-10 0-3,6';
const AFTER_LEAVE_MOUND_STARTER_NIGHT       = '7-57/10 19-23 * 3-10 *';
const AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY = '7-57/10 13-17 * 3-10 0-3,6';
const DURING_GAME_NIGHT       = '8-58/10 18-21 * 3-10 *';
const DURING_GAME_DAY_HOLIDAY = '8-58/10 13-17 * 3-10 0-3,6';

// for test
(async () => await execTest())();

// インポート (ナイトゲーム)
schedule(IMPORT_GAME_NIGHT, async() => await execProcessJson());
// インポート (土日デイゲーム)
schedule(IMPORT_GAME_DAY_HOLIDAY, async () => await execProcessJson());

// 試合開始直後 (ナイトゲーム)
// schedule(BEFORE_GAME_NIGHT, async () => await execBeforeGame());
// 試合開始直後 (土日 デイゲーム)
// schedule(BEFORE_GAME_DAY_HOLIDAY, async () => await execBeforeGame());

// 試合中 (ナイトゲーム)
schedule(DURING_GAME_NIGHT, async () => await execDuringGame());
// 試合中 (土日 デイゲーム)
schedule(DURING_GAME_DAY_HOLIDAY, async () => await execDuringGame());

// 先発投手降板後 (ナイトゲーム)
schedule(AFTER_LEAVE_MOUND_STARTER_NIGHT, async () => await execAfterLeftMound());
// 先発投手降板後 (土日 デイゲーム)
schedule(AFTER_LEAVE_MOUND_STARTER_DAY_HOLIDAY, async () => await execAfterLeftMound());

// 試合終了後 (ナイトゲーム)
schedule(AFTER_GAME_NIGHT, async () => await execAfterGame());
// 試合終了後 (土日 デイゲーム)
schedule(AFTER_GAME_DAY_HOLIDAY, async () => await execAfterGame());

// 毎週日曜日 試合終了後
schedule('*/15 16-18,21-23 * 3-10 0', async () => await execAfterGameSunday());

// 毎月中旬 試合終了後
// schedule('*/15 16-18,21-23 14-16 3-10 *', async () => await execAfterGameMonthMiddle());

// 毎月末 試合終了後
// schedule('*/15 16-18,21-23 28-31 3-10 *', async () => await execAfterGameMonthEnd());
