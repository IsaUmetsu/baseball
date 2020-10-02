
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execWeekBatChamp, execMonthBatChamp } from './exec_util';

// Execute
(async () => {
  await createConnection('default');

  const { PR, TM, LG, D, M } = process.env;
  if (PR == 'W') await execWeekBatChamp(getIsTweet(), TM, LG, D);
  if (PR == 'M') await execMonthBatChamp(getIsTweet(), TM, LG, M);
})();
