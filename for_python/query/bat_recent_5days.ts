import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execBatRc5All, execBatRc5Team } from './exec_util';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { T, TM, LG, S } = process.env;
  if (T == 'team') await execBatRc5Team(getIsTweet(), TM, LG);
  if (T == 'all') await execBatRc5All(getIsTweet(), TM, LG, S);
})();
