import { getIsTweet } from '../util/tweet';
import { execPitchGroundFlyStart } from '../util/execute';
import { AppDataSource } from '../util/datasource';


/**
 * All pitcher
 */
(async () => {
  await AppDataSource.initialize();
  const { D, BO } = process.env;
  await execPitchGroundFlyStart(getIsTweet(), D, BO);
})();
