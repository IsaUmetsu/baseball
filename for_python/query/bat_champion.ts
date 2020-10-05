
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execWeekBatChamp, execMonthBatChamp, execDayOfWeebBatChamp } from '../util/execute';

// Execute
(async () => {
  await createConnection('default');

  const { PR, TM, LG, D, M, DO } = process.env;
  if (PR == 'W') await execWeekBatChamp(getIsTweet(), TM, LG, D);
  if (PR == 'M') await execMonthBatChamp(getIsTweet(), TM, LG, M); 
  if (PR == 'DO') await execDayOfWeebBatChamp(getIsTweet(), TM, LG, DO);
})();
