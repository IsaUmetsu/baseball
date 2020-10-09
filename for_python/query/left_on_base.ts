import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayLostOnBase, execWeekLostOnBase, execMonthLostOnBase } from '../util/execute';

/**
 * Per team
 */
(async () => {
  await createConnection('default');

  const { PR, D, M } = process.env;

  if (PR == 'D') await execDayLostOnBase(getIsTweet(), D);
  if (PR == 'W') await execWeekLostOnBase(getIsTweet(), D);
  if (PR == 'M') await execMonthLostOnBase(getIsTweet(), M);
})();
