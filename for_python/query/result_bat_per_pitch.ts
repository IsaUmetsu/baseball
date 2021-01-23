
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execResultBatPerPitch } from '../util/execute';

// 打者における対戦投手成績
(async () => {
  await createConnection('default');

  const { NM, PA, AV, T } = process.env;
  await execResultBatPerPitch(getIsTweet(), NM, Number(PA), Number(AV), T);
})();
