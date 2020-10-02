import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchPerOut } from './exec_util';


// Execute
(async () => {
  await createConnection('default');
  await execPitchPerOut(getIsTweet(), process.env.D);
})();
