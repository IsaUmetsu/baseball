
import { getIsTweet } from '../util/tweet';
import { execLeadBehindScore } from '../util/execute';
import { AppDataSource } from '../util/datasource';

// Execute
(async () => {
  await AppDataSource.initialize();
  const { T, I, S, TM, LG } = process.env;
  await execLeadBehindScore(getIsTweet(), T, Number(I), Number(S), TM, LG);
})();
