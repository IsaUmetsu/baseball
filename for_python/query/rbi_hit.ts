
import { getIsTweet } from '../util/tweet';
import { execDayRbiHit, execDayRbiHitJs } from "../util/execute";
import { AppDataSource } from '../util/datasource';

// Execute
(async () => {
  await AppDataSource.initialize();
  const { TM, LG, D, PR } = process.env;
  if (PR == 'D') await execDayRbiHit(getIsTweet(), D, TM, LG);
  if (PR == 'J') await execDayRbiHitJs(getIsTweet(), D, TM, LG);
})();
