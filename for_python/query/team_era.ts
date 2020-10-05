
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execMonthTeamEra, execWeekTeamEra } from '../util/execute';
import { getIsDevide } from '../util/display';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, P, M, D } = process.env;

  if (PR == 'M') {
    await execMonthTeamEra(getIsTweet(), getIsDevide(), LG, P, M);
  } else if (PR == 'W') {
    await execWeekTeamEra(getIsTweet(), getIsDevide(), LG, P, D);
  }
})();
