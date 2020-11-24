
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execWeekBatChamp, execMonthBatChamp, execDayOfWeekBatChamp, execLeadBehindScore } from '../util/execute';

// Execute
(async () => {
  await createConnection('default');

  const { T, I, S, TM, LG } = process.env;
  await execLeadBehindScore(getIsTweet(), T, Number(I), Number(S), TM, LG);
})();
