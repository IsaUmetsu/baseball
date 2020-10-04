import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execBatRc5All, execBatRc5Team, execOnbaseRc5All, execOpsRc5All } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { K, T, TM, LG, S } = process.env;
  // average
  if (K == 'bat') {
    if (T == 'team') await execBatRc5Team(getIsTweet(), TM, LG);
    if (T == 'all') await execBatRc5All(getIsTweet(), TM, LG, S);
  // onbase_average
  } else if (K == 'ob') {
    await execOnbaseRc5All(getIsTweet(), TM, LG, S);
  // ops (onbase plus slugging)
  } else if (K == 'ops') {
    await execOpsRc5All(getIsTweet(), TM, LG, S);
  }
})();
