import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execRelieverAve } from '../util/execute';

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');
  await execRelieverAve(getIsTweet(), process.env.LG);
})();
