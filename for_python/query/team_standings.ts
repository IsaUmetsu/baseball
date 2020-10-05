
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayOfWeekStand, execMonthStand, execWeekStand } from '../util/execute';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, D, M, DO } = process.env;
  if (PR == 'W') await execWeekStand(getIsTweet(), LG, D);
  if (PR == 'M') await execMonthStand(getIsTweet(), LG, M);
  if (PR == 'D') await execDayOfWeekStand(getIsTweet(), LG, DO);
})();
