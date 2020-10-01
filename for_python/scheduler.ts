import { schedule } from 'node-cron';
import * as moment from 'moment';

import { execMonthStand, execPitchGroundFlyStart, execPitchPerOut, execPitchRc10Team, execPitchStrikeSwMsGame, execPitchType, execWeekBatChamp, execWeekStand, execMonthBatChamp, execDayBatTeam, execPitchRaPerInningStart, execMonthTeamEra, execMonthBatTitle, execPitchTitle, execMonthBatTeam, execBatRc5All } from './query/exec_util';
import { teamArray } from './constant';
import { generateConnection } from './db_util';
import { outputLogStart, outputLogEnd } from './tweet/tw_util';

(async () => {
  // await generateConnection();
})();

/**
 * 
 */
const execAfterGame = async () => {
  await generateConnection();

  // 各チーム
  await execPitchRc10Team();
  // 各リーグ
  await execDayBatTeam();
  await execBatRc5All();
}

/**
 * 
 */
const execAfterLeftMound = async () => {
  await generateConnection();

  // per team
  await execPitchType();
  // all pitchers
  await execPitchStrikeSwMsGame();
  await execPitchGroundFlyStart();
  await execPitchPerOut();
}

/**
 * 試合前 (ナイトゲーム)
 */
schedule('10,40 17-18 * 9-11 *', async () => {
  outputLogStart('before game');
  await generateConnection();
  await execPitchRaPerInningStart();
  outputLogEnd('before game');
});

/**
 * 試合前 (土日 デイゲーム)
 */
schedule('10,40 13-16 * 9-11 0,6', async () => {
  outputLogStart('before game');
  await generateConnection();
  await execPitchRaPerInningStart();
  outputLogEnd('before game');
});

/**
 * 試合終了後 (ナイトゲーム)
 */
schedule('2,17,32,47 21-23 * 9-11 *', async () => {
  outputLogStart('after game');
  await execAfterGame();
  outputLogEnd('after game');
});

/**
 * 試合終了後 (土日 デイゲーム)
 */
schedule('2,17,32,47 16-18 * 9-11 0,6', async () => {
  outputLogStart('after game');
  await execAfterGame();
  outputLogEnd('after game');
});

/**
 * 先発投手降板後 (ナイトゲーム)
 */
schedule('4,19,34,49 19-23 * 9-11 *', async () => {
  outputLogStart('after leave mound');
  await execAfterLeftMound();
  outputLogEnd('after leave mound');
});

/**
 * 先発投手降板後 (土日 デイゲーム)
 */
schedule('4,19,34,49 13-17 * 9-11 0,6', async () => {
  outputLogStart('after leave mound');
  await execAfterLeftMound();
  outputLogEnd('after leave mound');
});

/**
 * 毎週日曜日 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 0', async () => {
  outputLogStart('after game weekend');
  await generateConnection();

  await execWeekStand();
  await execWeekBatChamp();

  await execMonthStand();  
  await execMonthBatChamp();
  await execMonthTeamEra();

  outputLogEnd('after game weekend');
});

/**
 * 毎月末 試合終了後
 */
schedule('*/15 16-18,21-23 * 9-11 *', async () => {
  if (moment().add(1, 'days').format('D') == '1') {
    outputLogStart('after game month-end');
    await generateConnection();

    await execMonthStand();
    await execMonthBatChamp();
    await execMonthTeamEra();
    await execMonthBatTeam();
    // per league
    await execMonthBatTitle();
    await execPitchTitle();
    // per team
    for (const team of Object.keys(teamArray)) {
      await execMonthBatTitle(true, team);
      await execPitchTitle(true, team);
    }

    outputLogEnd('after game month-end');
  }
});
