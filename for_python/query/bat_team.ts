
import { getIsTweet } from '../util/tweet';
import { execDayBatTeam, execMonthBatTeam, execWeekBatTeam } from "../util/execute";
import { AppDataSource } from '../util/datasource';

// Execute
(async () => {
  await AppDataSource.initialize();
  const { LG, D, M, PR } = process.env;
  if (PR == 'M') await execMonthBatTeam(getIsTweet(), LG, M);
  if (PR == 'W') await execWeekBatTeam(getIsTweet(), LG, D);
  if (PR == 'D') await execDayBatTeam(getIsTweet(), LG, D);
})();
