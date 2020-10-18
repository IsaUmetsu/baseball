
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execDayRbiHit } from "../util/execute";

// Execute
(async () => {
  await createConnection('default');

  const { TM, LG, D, PR } = process.env;
  if (PR == 'D') await execDayRbiHit(getIsTweet(), D, TM, LG);
})();
