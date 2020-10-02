
import { createConnection } from 'typeorm';
import { getIsTweet } from '../util/tweet';
import { execMonthBatTitle, execMonthPitchTitle } from "./exec_util";

// Execute
(async () => {
  await createConnection('default');

  const { TM, LG, M, T } = process.env;

  let execBat = false, execPitch = false;
  if (! T) {
    console.log('T=[タイトル種別(B/P) に指定がないため、打撃/投球の両方を出力します');
    execBat = true, execPitch = true;
  } else {
    if (T == 'B') execBat = true;
    if (T == 'P') execPitch = true;
    if (! (T == 'B' || T == 'P')) console.log('T=[タイトル種別(B/P) に誤りがあるため実行されません');
  }

  if (execBat) await execMonthBatTitle(getIsTweet(), TM, LG, M);
  if (execPitch) await execMonthPitchTitle(getIsTweet(), TM, LG, M);
})();
