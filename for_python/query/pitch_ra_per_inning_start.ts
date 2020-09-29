import { createConnection } from 'typeorm';

import { getIsTweet } from '../tweet/tw_util';
import { execPitchRaPerInningStart } from './exec_util';



// Execute
(async () => {
  await createConnection('default');

  const { TM, NM } = process.env;
  await execPitchRaPerInningStart(getIsTweet(), TM, NM);
})();
