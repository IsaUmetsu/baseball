
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthTeamEra } from './exec_util';

// Execute
(async () => {
  await createConnection('default');

  const { LG, P } = process.env;
  await execMonthTeamEra(getIsTweet(), LG, P);
})();
