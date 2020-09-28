import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execPitchGroundFlyStart } from './query_util';


/**
 * All pitcher
 */
(async () => {
  await createConnection('default');

  const { D, BO } = process.env;
  await execPitchGroundFlyStart(getIsTweet(), D, BO);
})();
