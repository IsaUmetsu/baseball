import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchType } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { D, TM, LG } = process.env;
  await execPitchType(getIsTweet(), D, TM, LG);
})();
