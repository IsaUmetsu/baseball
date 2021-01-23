
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execResultPitchPerBat } from '../util/execute';

// 投手における対戦打者成績
(async () => {
  await createConnection('default');

  const { NM, PA, AV, T } = process.env;
  await execResultPitchPerBat(getIsTweet(), NM, Number(PA), Number(AV), T);
})();
