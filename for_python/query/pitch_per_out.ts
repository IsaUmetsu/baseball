import { getIsTweet } from '../util/tweet';
import { execPitchPerOut } from '../util/execute';
import { AppDataSource } from '../util/datasource';


// Execute
(async () => {
  await AppDataSource.initialize();
  await execPitchPerOut(getIsTweet(), process.env.D);
})();
