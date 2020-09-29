import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execPitchRc10Team } from './exec_util';

/**
 * Per team
 */
(async () => {
  await createConnection('default');
  await execPitchRc10Team(getIsTweet(), process.env.TM, process.env.LG);
})();
