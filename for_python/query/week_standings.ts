
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execWeekStand } from './exec_util';

// Execute
(async () => {
  await createConnection('default');

  const { LG, D } = process.env;
  await execWeekStand(getIsTweet(), LG, D);
})();
