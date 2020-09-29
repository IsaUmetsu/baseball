
import { createConnection } from 'typeorm';
import { getIsTweet } from '../tweet/tw_util';
import { execMonthBatChamp } from "./exec_util";

// Execute
(async () => {
  await createConnection('default');

  const { TM, LG, M } = process.env;
  await execMonthBatChamp(getIsTweet(), TM, LG, M);
})();
