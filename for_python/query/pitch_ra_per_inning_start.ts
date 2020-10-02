import { createConnection } from 'typeorm';

import { getIsTweet } from '../util/tweet';
import { execPitchRaPerInningStart } from '../util/execute';



// Execute
(async () => {
  await createConnection('default');

  const { TM, NM } = process.env;
  await execPitchRaPerInningStart(getIsTweet(), TM, NM);
})();
