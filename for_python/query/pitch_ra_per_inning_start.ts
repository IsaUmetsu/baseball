import { getIsTweet } from '../util/tweet';
import { execPitchRaPerInningStart } from '../util/execute';
import { AppDataSource } from '../util/datasource';



// Execute
(async () => {
  await AppDataSource.initialize();
  const { TM, NM } = process.env;
  await execPitchRaPerInningStart(getIsTweet(), TM, NM);
})();
