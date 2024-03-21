import { getIsTweet } from '../util/tweet';
import { execPitchRc10Team } from '../util/execute';
import { AppDataSource } from '../util/datasource';

/**
 * Per team
 */
(async () => {
  await AppDataSource.initialize();
  const { TM, LG } = process.env;
  await execPitchRc10Team(TM, LG, getIsTweet());
})();
