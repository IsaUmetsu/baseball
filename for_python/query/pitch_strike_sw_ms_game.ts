import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execPitchStrikeSwMsGame } from './query_util';

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');
  await execPitchStrikeSwMsGame(getIsTweet(), process.env.D, process.env.ST);
})();
