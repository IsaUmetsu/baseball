import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchRc10Team } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');
  await execPitchRc10Team(getIsTweet(), process.env.TM, process.env.LG);
})();
