import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchGroundFlyStart } from './exec_util';


/**
 * All pitcher
 */
(async () => {
  await createConnection('default');

  const { D, BO } = process.env;
  await execPitchGroundFlyStart(getIsTweet(), D, BO);
})();
