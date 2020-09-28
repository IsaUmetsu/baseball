
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthBatTitle } from "./query_util";

// Execute
(async () => {
  await createConnection('default');

  const { LG, M } = process.env;
  await execMonthBatTitle(getIsTweet(), LG, M);
})();
