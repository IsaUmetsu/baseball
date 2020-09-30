
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthTeamEra, execMonthTeamEraDiv } from './exec_util';
import { getIsDevide } from '../disp_util';

// Execute
(async () => {
  await createConnection('default');

  const { LG, P, M } = process.env;
  if (getIsDevide()) {
    await execMonthTeamEraDiv(getIsTweet(), LG, P, M);
  } else {
    await execMonthTeamEra(getIsTweet(), LG, M);
  }
})();
