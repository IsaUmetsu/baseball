
import { getIsTweet } from '../util/tweet';
import { execWeekBatChamp, execMonthBatChamp, execDayOfWeekBatChamp } from '../util/execute';
import { AppDataSource } from '../util/datasource';

// Execute
(async () => {
  await AppDataSource.initialize();
  const { PR, TM, LG, D, M, DO } = process.env;
  if (PR == 'W') await execWeekBatChamp(getIsTweet(), TM, LG, D);
  if (PR == 'M') await execMonthBatChamp(getIsTweet(), TM, LG, M); 
  if (PR == 'DO') await execDayOfWeekBatChamp(getIsTweet(), TM, LG, DO);
})();
