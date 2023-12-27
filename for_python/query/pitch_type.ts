import { getIsTweet } from '../util/tweet';
import { execPitchType } from '../util/execute';
import { AppDataSource } from '../util/datasource';

/**
 * Per team
 */
(async () => {
  await AppDataSource.initialize();
  const { D, TM, LG } = process.env;
  await execPitchType(getIsTweet(), D, TM, LG);
})();
