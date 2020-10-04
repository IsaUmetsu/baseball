
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayBatTeam, execMonthBatTeam, execWeekBatTeam } from "../util/execute";

// Execute
(async () => {
  await createConnection('default');

  const { LG, D, M, PR } = process.env;
  if (PR == 'M') await execMonthBatTeam(getIsTweet(), LG, M);
  if (PR == 'W') await execWeekBatTeam(getIsTweet(), LG, D);
  if (PR == 'D') await execDayBatTeam(getIsTweet(), LG, D);
})();
