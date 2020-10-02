import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchStrikeSwMsGame } from './exec_util';

/**
 * All pitcher
 */
(async () => {
  await createConnection('default');
  await execPitchStrikeSwMsGame(getIsTweet(), process.env.D, process.env.ST);
})();
