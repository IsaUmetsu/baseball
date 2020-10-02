import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchStrikeSwMsGame } from '../util/execute';

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');
  await execPitchStrikeSwMsGame(getIsTweet(), process.env.D, process.env.ST);
})();
