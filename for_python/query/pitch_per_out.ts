import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execPitchPerOut } from './exec_util';


// Execute
(async () => {
  await createConnection('default');
  await execPitchPerOut(getIsTweet(), process.env.D);
})();
