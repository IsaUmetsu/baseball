import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execBatRc5All, execBatRc5Npb, execBatRc5Team, execOnbaseRc5All, execOpsRc5All, execOnbaseRc5Npb, execOpsRc5Npb, execBatRc5TeamJs } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { K, T, TM, LG, S } = process.env;
  // average
  if (K == 'bat') {
    if (T == 'team') await execBatRc5Team(TM, LG, getIsTweet());
    if (T == 'all') await execBatRc5All(getIsTweet(), TM, LG, S);
    if (T == 'npb') await execBatRc5Npb(getIsTweet(), TM, LG, S);
    if (T == 'js') await execBatRc5TeamJs(TM, LG, getIsTweet());
  // onbase_average
  } else if (K == 'ob') {
    if (T == 'all') await execOnbaseRc5All(getIsTweet(), TM, LG, S);
    if (T == 'npb') await execOnbaseRc5Npb(getIsTweet(), TM, LG, S);
  // ops (onbase plus slugging)
  } else if (K == 'ops') {
    if (T == 'all') await execOpsRc5All(getIsTweet(), TM, LG, S);
    if (T == 'npb') await execOpsRc5Npb(getIsTweet(), TM, LG, S);
  }
})();
