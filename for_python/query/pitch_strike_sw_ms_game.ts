import { getIsTweet } from '../util/tweet';
import { execPitchStrikeSwMsGame } from '../util/execute';
import { AppDataSource } from '../util/datasource';

/**
 * All pitcher
 */
(async () => {
  await AppDataSource.initialize();
  await execPitchStrikeSwMsGame(getIsTweet(), process.env.D, process.env.ST);
})();
