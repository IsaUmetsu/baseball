import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execOnbaseRc5All } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { TM, LG, S } = process.env;
  await execOnbaseRc5All(getIsTweet(), TM, LG, S);
})();
