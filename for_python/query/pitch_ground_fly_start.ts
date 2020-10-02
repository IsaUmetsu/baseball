import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchGroundFlyStart } from '../util/execute';


/**
 * All pitcher
 */
(async () => {
  await createConnection('default');

  const { D, BO } = process.env;
  await execPitchGroundFlyStart(getIsTweet(), D, BO);
})();
