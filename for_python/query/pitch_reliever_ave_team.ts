import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execRelieverAve } from './exec_util';

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');
  await execRelieverAve(getIsTweet(), process.env.LG);
})();
