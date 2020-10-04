
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execMonthTeamEra, execMonthTeamEraDiv, execWeekTeamEra } from '../util/execute';
import { getIsDevide } from '../util/display';

// Execute
(async () => {
  await createConnection('default');

  const { PR, LG, P, M, D } = process.env;

  if (PR == 'M') {
    if (getIsDevide()) {
      await execMonthTeamEraDiv(getIsTweet(), LG, P, M);
    } else {
      await execMonthTeamEra(getIsTweet(), LG, M);
    }
  } else if (PR == 'W') {
    await execWeekTeamEra(getIsTweet(), LG, D);
  }
})();
