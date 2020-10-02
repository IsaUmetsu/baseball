
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthStand, execWeekStand } from './exec_util';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, D, M } = process.env;
  if (PR == 'W') await execWeekStand(getIsTweet(), LG, D);
  if (PR == 'M') await execMonthStand(getIsTweet(), LG, M);
})();
