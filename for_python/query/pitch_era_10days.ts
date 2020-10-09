import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchRc10Team } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');
  const { TM, LG } = process.env;
  await execPitchRc10Team(TM, LG, getIsTweet());
})();
