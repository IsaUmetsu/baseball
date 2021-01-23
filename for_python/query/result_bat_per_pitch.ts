
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execResultBatPerPitch } from '../util/execute';

// Execute
(async () => {
  await createConnection('default');

  const { NM, PA, AV } = process.env;
  await execResultBatPerPitch(getIsTweet(), NM, Number(PA), Number(AV));
})();
