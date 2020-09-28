
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthBatChamp } from "./query_util";

// Execute
(async () => {
  await createConnection('default');

  const { TM, LG, M } = process.env;
  await execMonthBatChamp(getIsTweet(), TM, LG, M);
})();
