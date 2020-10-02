import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execPitchPerOut } from '../util/execute';


// Execute
(async () => {
  await createConnection('default');
  await execPitchPerOut(getIsTweet(), process.env.D);
})();
