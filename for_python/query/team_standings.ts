
import { getIsTweet } from '../util/tweet';
import { execDayOfWeekStand, execDayOfWeekStandPerResultTue, execMonthStand, execWeekStand } from '../util/execute';
import { AppDataSource } from '../util/datasource';

// Execute
(async () => {
  await AppDataSource.initialize();
  const { PR, TM, LG, D, M, DO } = process.env;
  if (PR == 'W') await execWeekStand(getIsTweet(), LG, D);
  if (PR == 'M') await execMonthStand(getIsTweet(), LG, M);
  if (PR == 'D') await execDayOfWeekStand(getIsTweet(), LG, DO);
  // result after tuesday
  if (PR == 'RATU') await execDayOfWeekStandPerResultTue(TM, LG, DO);
})();
