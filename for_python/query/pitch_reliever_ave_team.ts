import { getIsTweet } from '../util/tweet';
import { execRelieverAve } from '../util/execute';
import { AppDataSource } from '../util/datasource';

/**
 * All pitcher
 */
(async () => {
  await AppDataSource.initialize();
  await execRelieverAve(getIsTweet(), process.env.LG);
})();
