
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayTeamEra, execMonthTeamEra, execWeekTeamEra } from '../util/execute';
import { getIsDevide } from '../util/display';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, P, M, D } = process.env;

  if (PR == 'D') await execDayTeamEra(getIsTweet(), getIsDevide(), LG, P, D);
  if (PR == 'W') await execWeekTeamEra(getIsTweet(), getIsDevide(), LG, P, D);
  if (PR == 'M') await execMonthTeamEra(getIsTweet(), getIsDevide(), LG, P, M);
})();
