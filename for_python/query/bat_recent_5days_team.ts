import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execBatRc5Team } from './query_util';

/**
 * Per team
 */
(async () => {
  await createConnection('default');
  await execBatRc5Team(getIsTweet(), process.env.TM, process.env.LG);
})();
