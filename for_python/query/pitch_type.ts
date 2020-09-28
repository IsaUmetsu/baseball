import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execPitchType } from './query_util';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { D, TM, LG } = process.env;
  await execPitchType(getIsTweet(), D, TM, LG);
})();
