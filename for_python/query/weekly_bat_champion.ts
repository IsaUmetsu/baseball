
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execWeekBatChamp } from './exec_util';

// Execute
(async () => {
  await createConnection('default');

  const { TM, LG, D } = process.env;
  await execWeekBatChamp(getIsTweet(), TM, LG, D);
})();
