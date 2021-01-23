
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execResultBatPerPitch, execResultPitchPerBat } from '../util/execute';

// 対戦相手ごとの成績 (好相性、悪相性)
// NM: 名前、PA: 対戦打席、AV: 基準打率、T: タイプ(G: 好相性、B: 悪相性)
(async () => {
  await createConnection('default');
  const { K, NM, PA, AV, T } = process.env;
  // 投手における対戦打者成績
  if (K == 'BPP') await execResultBatPerPitch(getIsTweet(), NM, Number(PA), Number(AV), T);
  // 打者における対戦投手成績
  if (K == 'PPB') await execResultPitchPerBat(getIsTweet(), NM, Number(PA), Number(AV), T);
})();
