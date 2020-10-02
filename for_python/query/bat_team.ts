
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayBatTeam, execMonthBatTeam } from "./exec_util";

// Execute
(async () => {
  await createConnection('default');

  const { LG, D, M, PR } = process.env;
  if (PR == 'M') await execMonthBatTeam(getIsTweet(), LG, M);
  if (PR == 'D') await execDayBatTeam(getIsTweet(), LG, D);
})();
