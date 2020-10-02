
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execMonthStand, execWeekStand } from '../util/execute';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, D, M } = process.env;
  if (PR == 'W') await execWeekStand(getIsTweet(), LG, D);
  if (PR == 'M') await execMonthStand(getIsTweet(), LG, M);
})();
